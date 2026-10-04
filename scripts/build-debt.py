"""Build data/state-debt.json from ABS Government Finance Statistics, Annual, 2024-25 (5512.0).

Needs openpyxl: pip install openpyxl
Gross debt = debt liabilities (currency and deposits, advances, other loans and placements, debt securities).
Net debt = gross debt less the same kinds of financial assets held (cash and deposits, advances, loans and placements),
the ABS GFS definition. Equity investments and superannuation liabilities are excluded.
"""
import io, json, urllib.request
import openpyxl

BASE = "https://www.abs.gov.au/statistics/economy/government/government-finance-statistics-annual/2024-25/55120DO{:03d}_202425.xlsx"
SECTORS = {"gg": 3, "nfps": 35}  # workbook number for NSW; states 1-8 follow in order
DEBT = ["Currency and deposits", "Advances", "Other loans and placements", "Debt securities"]


def table(wb, name):
    rows = list(wb[name].iter_rows(values_only=True))
    years = [y for y in rows[4][1:] if y]
    return years, [((r[0] or "").strip(), r[1:1 + len(years)]) for r in rows[6:]]


out = {}
for sector, first in SECTORS.items():
    for code in range(1, 9):
        wb = openpyxl.load_workbook(io.BytesIO(urllib.request.urlopen(BASE.format(first + code - 1)).read()), read_only=True)
        years, bs = table(wb, "Table_3")
        split = next(i for i, (label, _) in enumerate(bs) if label == "Liabilities")
        side = lambda rows: {label: [v or 0 for v in vals] for label, vals in rows if label in DEBT}
        assets, liabs = side(bs[:split]), side(bs[split:])
        _, ops = table(wb, "Table_1")
        interest = next(vals for label, vals in ops if label in ("Interest expenses n.e.c.", "Other interest expenses"))
        state = out.setdefault(str(code), {})
        for i, y in enumerate(years):
            gross = sum(v[i] for v in liabs.values())
            held = sum(v[i] for k, v in assets.items() if k != "Debt securities")
            state.setdefault(y, {})[sector] = {"gross": gross * 1e6, "net": (gross - held) * 1e6, "interest": (interest[i] or 0) * 1e6}

json.dump({"source": "ABS Government Finance Statistics, Annual, 2024-25 (5512.0), released 21 April 2026",
           "states": out}, open("data/state-debt.json", "w"), separators=(",", ":"))
assert len(out) == 8 and all("2024-25" in s and len(s["2024-25"]) == 2 for s in out.values())
