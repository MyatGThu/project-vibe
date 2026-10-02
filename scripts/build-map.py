"""Build data/states.json: SVG paths for each state from ABS ASGS 2021 boundaries."""
import json, math, urllib.request

URL = ("https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/STE/MapServer/0/query"
       "?where=1%3D1&outFields=STATE_CODE_2021&returnGeometry=true"
       "&maxAllowableOffset=0.02&geometryPrecision=3&outSR=4326&f=geojson")
K = math.cos(math.radians(27))  # equirectangular, scaled for mid-latitude
MIN_AREA = 0.02                 # drop islands smaller than ~0.02 sq degrees
W = 1000

feats = json.load(urllib.request.urlopen(URL))["features"]
rings = {}
for f in feats:
    code = f["properties"]["state_code_2021"]
    g = f["geometry"]
    if code not in "12345678" or not g:
        continue
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        outer = poly[0]
        area = abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(outer, outer[1:]))) / 2
        if area >= MIN_AREA or code == "8":
            rings.setdefault(code, []).append([(x * K, -y) for x, y in outer])

xs = [p[0] for rs in rings.values() for r in rs for p in r]
ys = [p[1] for rs in rings.values() for r in rs for p in r]
s = W / (max(xs) - min(xs))
H = round((max(ys) - min(ys)) * s)

def path(rs):
    out = []
    for r in rs:
        pts = []
        for x, y in r:
            p = (round((x - min(xs)) * s, 1), round((y - min(ys)) * s, 1))
            if not pts or p != pts[-1]:
                pts.append(p)
        if len(pts) > 2:
            out.append("M" + "L".join(f"{x},{y}" for x, y in pts) + "Z")
    return "".join(out)

json.dump({"viewBox": f"0 0 {W} {H}", "paths": {c: path(rs) for c, rs in sorted(rings.items())}},
          open("data/states.json", "w"), separators=(",", ":"))
