#!/usr/bin/env sh
# Refresh the offline snapshot in data/ from the ABS Data API.
# The page fetches live data first and only falls back to these files.
set -eu
cd "$(dirname "$0")/.."

BASE="https://data.api.abs.gov.au/rest/data"
START="2010-Q1"

# State Final Demand, current prices, original series:
# final consumption (FCE) and investment (GFC) by government sector and state.
curl -fsS --retry 3 -o data/spending.csv \
  "$BASE/ABS,ANA_SFD,1.0.0/C.FCE+GFC.GGC+GGS_SL+GGS+GES_SL+GEC.10.1+2+3+4+5+6+7+8.Q?startPeriod=$START&format=csvfile"

# Estimated resident population, persons, all ages, by state.
curl -fsS --retry 3 -o data/population.csv \
  "$BASE/ABS,ERP_Q,1.0.0/1.3.TOT.1+2+3+4+5+6+7+8.Q?startPeriod=$START&format=csvfile"

date -u +%Y-%m-%dT%H:%M:%SZ > data/fetched-at.txt
wc -l data/spending.csv data/population.csv
