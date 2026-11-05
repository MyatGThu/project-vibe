"""Build data/rates.json from Reserve Bank of Australia statistical tables (monthly, per cent a year).

F1 cash rate target (daily, so decision dates are exact), F5 indicator lending rates,
F4 retail deposit rates, F2.1 government bond yields.
"""
import csv, io, json, urllib.request
from datetime import datetime

TABLES = "https://www.rba.gov.au/statistics/tables/csv/{}-data.csv"
SERIES = {  # series ID: (table, label)
    "FIRMMCRTD": ("f1", "Cash rate target"),
    "FILRHLBVS": ("f5", "Home loan, standard variable (owner-occupier)"),
    "FILRHLBVD": ("f5", "Home loan, discounted variable (owner-occupier)"),
    "FILRHL3YF": ("f5", "Home loan, 3-year fixed (owner-occupier)"),
    "FILRHLBVSI": ("f5", "Home loan, standard variable (investor)"),
    "FILRSBVRT": ("f5", "Small business, variable term loan"),
    "FILRPLRCCS": ("f5", "Credit card, standard"),
    "FRDIRSAO10K": ("f4", "Online savings account ($10,000)"),
    "FRDIRSAB10K": ("f4", "Bonus savings account ($10,000)"),
    "FRDIRBTD10K1Y": ("f4", "1-year term deposit ($10,000)"),
    "FCMYGBAG2": ("f2.1", "2-year government bond"),
    "FCMYGBAG10": ("f2.1", "10-year government bond"),
}
START = "2010-01"


def day(d):
    for f in ("%d/%m/%Y", "%d-%b-%Y"):
        try:
            return datetime.strptime(d, f).strftime("%Y-%m-%d")
        except ValueError:
            pass
    raise ValueError(d)


out = {}
for table in sorted({t for t, _ in SERIES.values()}):
    req = urllib.request.Request(TABLES.format(table), headers={"User-Agent": "Mozilla/5.0"})
    rows = list(csv.reader(io.StringIO(urllib.request.urlopen(req).read().decode("utf-8-sig", "replace"))))
    ids = next(r for r in rows if r and r[0] == "Series ID")
    for col, sid in enumerate(ids):
        if SERIES.get(sid, (None,))[0] != table:
            continue
        daily = sorted((day(r[0]), float(r[col])) for r in rows if r and r[0][:1].isdigit() and col < len(r) and r[col].strip())
        points = {d[:7]: v for d, v in daily}  # last value in each month
        out[sid] = {"label": SERIES[sid][1], "data": {m: v for m, v in points.items() if m >= START}}
        if sid == "FIRMMCRTD":  # every change in the target, with its effective date
            out[sid]["changes"] = [[d, v] for (d, v), (_, p) in zip(daily[1:], daily) if v != p and d >= START]
            out[sid]["asAt"] = daily[-1][0]

json.dump({"source": "Reserve Bank of Australia statistical tables F1, F2.1, F4 and F5", "series": out},
          open("data/rates.json", "w"), separators=(",", ":"))
assert set(out) == set(SERIES) and all(s["data"] for s in out.values()), set(SERIES) - set(out)
