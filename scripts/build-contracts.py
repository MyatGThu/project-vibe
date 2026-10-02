"""Build data/contracts.json from an Apify AusTender dataset export.

Run the Apify actor knotty_mistveil/austender-contract-notices, export its dataset as JSON
(fields: supplierRegion, valueAmount, supplierName, supplierAbn, agencyName, procurementMethod,
publishedDate, unspscDescription, limitedTenderReason), then:
python3 scripts/build-contracts.py export.json "<window label>" <notices published in window>
"""
import json, sys
from collections import Counter, defaultdict

CODES = {"NSW": "1", "VIC": "2", "QLD": "3", "SA": "4", "WA": "5", "TAS": "6", "NT": "7", "ACT": "8"}
raw = json.load(open(sys.argv[1]))
items = raw["items"] if isinstance(raw, dict) else raw

# Group suppliers by ABN, since names vary between notices; show each ABN's most common name.
key = lambda r: r.get("supplierAbn") or r["supplierName"].strip().upper()
name_counts = defaultdict(Counter)
for r in items:
    name_counts[key(r)][r["supplierName"].strip()] += 1
names = {k: c.most_common(1)[0][0] for k, c in name_counts.items()}


def summary(rows, n=5):
    by_sup, by_agency, by_cat = defaultdict(float), defaultdict(float), defaultdict(float)
    for r in rows:
        by_sup[key(r)] += r["valueAmount"]
        by_agency[r["agencyName"].strip()] += r["valueAmount"]
        by_cat[r.get("unspscDescription") or "Not stated"] += r["valueAmount"]
    top = lambda d, label: [[label(k), v] for k, v in sorted(d.items(), key=lambda kv: -kv[1])[:n]]
    return {
        "count": len(rows),
        "value": sum(r["valueAmount"] for r in rows),
        "limited": sum(1 for r in rows if r["procurementMethod"] == "limited"),
        "topSuppliers": top(by_sup, names.get),
        "topAgencies": top(by_agency, str),
        "topCategories": top(by_cat, str),
    }


groups = defaultdict(list)
for r in items:
    groups[CODES.get(r.get("supplierRegion"), "other")].append(r)
monthly = defaultdict(lambda: {"count": 0, "value": 0.0, "limited": 0})
for r in items:
    m = monthly[r["publishedDate"][:7]]  # UTC, same as the query window
    m["count"] += 1
    m["value"] += r["valueAmount"]
    m["limited"] += r["procurementMethod"] == "limited"
reasons = Counter((r.get("limitedTenderReason") or "Not stated").strip() for r in items if r["procurementMethod"] == "limited")
json.dump({
    "source": "AusTender contract notices via Apify actor knotty_mistveil/austender-contract-notices",
    "window": sys.argv[2],
    "published": int(sys.argv[3]),  # all notices in the window, from the run's SUMMARY record
    "monthly": dict(sorted(monthly.items())),
    "limitedReasons": reasons.most_common(6),
    "national": summary(items, 10),
    "states": {k: summary(v) for k, v in groups.items()},
}, open("data/contracts.json", "w"), separators=(",", ":"))
assert sum(len(v) for v in groups.values()) == len(items)
