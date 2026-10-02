"""Fetch AusTender contract notices from the free OCDS API (no key) for build-contracts.py.

python3 scripts/fetch-austender.py 2025-07-01 2026-06-30 export.json
Writes {"published": <all parent notices in the window>, "items": [<notices of $1m or more>]}.
Needs openpyxl for the UNSPSC category names: pip install openpyxl
"""
import io, json, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date, timedelta
import openpyxl

API = "https://api.tenders.gov.au/ocds/findByDates/contractPublished"
UNSPSC = ("https://data.gov.au/data/dataset/5c7fa69b-b0e9-4553-b8df-2a022dd2e982/resource/"
          "bae9cb73-1500-4d45-a862-eac2706cfbd4/download/austender-customised-unspsc-codeset-1-july-2023-1.xlsx")
MIN_VALUE = 1_000_000


def get(url):
    for attempt in range(5):
        try:
            return json.load(urllib.request.urlopen(url, timeout=120))
        except Exception:
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)


def month_releases(start, end):
    url = f"{API}/{start}T00:00:00Z/{end}T23:59:59Z"
    out = []
    while url:
        page = get(url)
        if not page.get("releases"):
            break
        out += page["releases"]
        url = page.get("links", {}).get("next")
    return out


start, end = (date.fromisoformat(d) for d in sys.argv[1:3])
months = []
d = start
while d <= end:
    nxt = (d.replace(day=28) + timedelta(days=4)).replace(day=1)
    months.append((d.isoformat(), min(nxt - timedelta(days=1), end).isoformat()))
    d = nxt
with ThreadPoolExecutor(len(months)) as pool:
    releases = [r for rs in pool.map(lambda m: month_releases(*m), months) for r in rs]

# UNSPSC titles at class or family level; contract codes are matched to the nearest one.
rows = openpyxl.load_workbook(io.BytesIO(urllib.request.urlopen(UNSPSC).read()), read_only=True).worksheets[0].iter_rows(values_only=True)
titles = {}
for r in rows:
    r = [c for c in r if c is not None]
    if len(r) >= 2 and isinstance(r[0], int):
        titles[str(r[0])] = str(r[1]).strip()


def title(code):
    for c in (code, code[:6] + "00", code[:4] + "0000", code[:2] + "000000"):
        if c in titles:
            return titles[c]
    return f"UNSPSC {code}" if code else None


seen, items = set(), []
for r in releases:
    c = (r.get("contracts") or [{}])[0]
    cid = c.get("id", "")
    if not cid or "-A" in cid or cid in seen:  # parents only, once each
        continue
    seen.add(cid)
    value = float(c.get("value", {}).get("amount") or 0)
    if value < MIN_VALUE:
        continue
    parties = {role: p for p in r.get("parties", []) for role in p.get("roles", [])}
    sup, buyer, tender = parties.get("supplier", {}), parties.get("procuringEntity", {}), r.get("tender", {})
    abn = next((i["id"] for i in sup.get("additionalIdentifiers", []) if i.get("scheme") == "AU-ABN"), None)
    code = ((c.get("items") or [{}])[0].get("classification") or {}).get("id", "")
    items.append({
        "contractId": cid,
        "supplierName": sup.get("name", "Unknown"),
        "supplierAbn": abn,
        "supplierRegion": sup.get("address", {}).get("region"),
        "agencyName": buyer.get("name", "Unknown"),
        "valueAmount": value,
        "publishedDate": r.get("date", ""),
        "procurementMethod": tender.get("procurementMethod", ""),
        "limitedTenderReason": tender.get("limitedTenderReason"),
        "unspscDescription": title(code),
    })

json.dump({"published": len(seen), "items": items}, open(sys.argv[3], "w"))
print(f"{len(releases)} releases, {len(seen)} parent notices, {len(items)} of ${MIN_VALUE:,}+")
