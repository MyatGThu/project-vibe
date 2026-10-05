# Australian Government Spending by State

A static web page that tracks public spending in each Australian state and territory, using official data from the Australian Bureau of Statistics (ABS).

## What it shows

- A map of the states and territories (ABS ASGS 2021 boundaries), shaded by total or per-person spending. Tap or click a state (or tab to it and press Enter) to open its full breakdown in a popup: rank, share of the national total, change on one and five years, latest quarter, population and each spending component.
- Job openings by state from the ABS Job Vacancies survey: private and public sector, per 1,000 residents and change on a year earlier.
- Find a job: keywords and state, linking to Workforce Australia, APSJobs and each state government's job board. Victoria's board opens the search directly; for the others the keywords are copied to paste in.
- How much each state owes: net and gross debt, debt per person, interest paid and five-year change (ABS Government Finance Statistics 2024-25).
- State & local government spending compared with the taxes states and councils collect (ABS Taxation Revenue 2024-25), with each tax type.
- Federal contracts of $1m or more in 2025-26 by the state of the supplier, by month, category and the reason given for limited tenders (AusTender).
- Company tax from the ATO's 2024-25 tax transparency report: most tax payable, largest income with no tax payable, and lowest tax on taxable income over $100m.
- Claude usage by state from the Anthropic Economic Index, against each state's share of population.
- Headline figures for the selected financial year (July–June): national total, change on the previous year, spending per person, the highest per-person state and the fastest-growing state.
- Findings written from the data for the selected year.
- A stacked bar chart per state, split into Commonwealth consumption, state & local consumption, government investment and public corporation investment. You can switch between total dollars and dollars per person.
- A rolling 12-month trend line for every state since 2010, with one state highlighted.
- A table with every value.

## Data

| Dataset | ABS dataflow | Used for |
|---|---|---|
| Australian National Accounts – State Final Demand | `ANA_SFD` | Government final consumption (`FCE`) and gross fixed capital formation (`GFC`) by sector and state, current prices, original series, quarterly |
| Quarterly Population Estimates | `ERP_Q` | Per-person figures |
| Job Vacancies | `JV` | Job openings by state and sector, quarterly |

The page requests both from the [ABS Data API](https://data.api.abs.gov.au) in the browser. The API is free, needs no key and allows cross-origin requests. If the request fails, the page falls back to the snapshot in `data/`.

**Coverage:** these are national-accounts measures of what governments buy and build in each state. They do not include transfer payments (pensions, welfare, subsidies, interest). Commonwealth spending is counted in the state where it takes place, which is why the ACT, home of the federal public service, has a much higher per-person figure.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Serve the folder over HTTP rather than opening `index.html` from disk; browsers block `fetch` of local files.

## Refresh the snapshot

```sh
./scripts/update-data.sh
```

The ABS publishes State Final Demand each quarter, about two months after the quarter ends.

## Rebuild the map

```sh
python3 scripts/build-map.py
```

Downloads generalised state boundaries from the ABS ASGS 2021 map service and writes SVG paths to `data/states.json`.

## Rebuild the tax, contract and AI usage data

```sh
pip install openpyxl
python3 scripts/build-tax.py                      # data/state-tax.json, data/company-tax.json
python3 scripts/build-debt.py                     # data/state-debt.json
python3 scripts/fetch-austender.py 2025-07-01 2026-06-30 export.json   # AusTender OCDS API, no key
python3 scripts/build-contracts.py export.json "<window label>"         # data/contracts.json
```

`build-contracts.py` also accepts an Apify dataset export from the actor `knotty_mistveil/austender-contract-notices` (date type `contractPublished`, minimum value 1000000, no amendments); pass the number of notices published as a third argument. Both sources give the same figures. `data/economic-index.json` holds figures from the Anthropic Economic Index (period 2026-05-01).

## Deploy

The site is plain HTML, CSS and JavaScript with no build step. `.github/workflows/pages.yml` publishes it to GitHub Pages on every push to `main`; the repository's Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment).
