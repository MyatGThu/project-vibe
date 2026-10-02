# Australian Government Spending by State

A static web page that tracks public spending in each Australian state and territory, using official data from the Australian Bureau of Statistics (ABS).

## What it shows

- A map of the states and territories (ABS ASGS 2021 boundaries), shaded by total or per-person spending. Hover, tap or tab to a state for its full breakdown: rank, share of the national total, change on one and five years, latest quarter, population and each spending component.
- State & local government spending compared with the taxes states and councils collect (ABS Taxation Revenue 2024-25), with each tax type.
- Federal contracts of $1m or more by the state of the supplier, collected from AusTender with Apify.
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
python3 scripts/build-contracts.py export.json    # data/contracts.json
```

For contracts, run the Apify actor `knotty_mistveil/austender-contract-notices` (date type `contractPublished`, minimum value 1000000, no amendments) and export its dataset as JSON. `data/economic-index.json` holds figures from the Anthropic Economic Index (period 2026-05-01).

## Deploy

The site is plain HTML, CSS and JavaScript with no build step, so it can be served from GitHub Pages or any static host.
