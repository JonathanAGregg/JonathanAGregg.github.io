"""Build the Massachusetts "field map" base layer: assets/js/ma-map.js

Downloads the U.S. Census Bureau 2024 cartographic boundary file for
Massachusetts county subdivisions (the state's 351 cities and towns, 1:500k),
simplifies and projects the shapes, and writes them as SVG path data.

Usage:  python3 tools/make_ma_map.py            (downloads the Census file)
        python3 tools/make_ma_map.py path.zip   (uses a file you downloaded)
Needs:  Python 3 only (no GIS libraries). Downloads about 240 KB.

The projection is a simple equirectangular projection scaled by cos(latitude)
at the state's center. Over an area this small it is visually close to
Massachusetts State Plane. main.js inverts it for the cursor coordinate
readout, so if you change PROJ here the readout stays correct automatically.
"""
import io, json, math, struct, subprocess, sys, urllib.request, zipfile

URL = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_25_cousub_500k.zip"
OUT = "assets/js/ma-map.js"
TOLERANCE_TOWN = 0.0012   # degrees; roughly 100 m. Raise it for a smaller file.
TOLERANCE_STATE = 0.0006
WIDTH = 1000              # SVG width in px; height follows the state's shape
PAD = 18

def read_zip(url):
    """Local .zip path (argument 1) if given; otherwise download, falling back
    to curl when Python's SSL certificates aren't set up (common on macOS)."""
    if len(sys.argv) > 1:
        return zipfile.ZipFile(sys.argv[1])
    try:
        with urllib.request.urlopen(url) as r:
            return zipfile.ZipFile(io.BytesIO(r.read()))
    except Exception:
        data = subprocess.run(["curl", "-sfL", url], check=True, capture_output=True).stdout
        return zipfile.ZipFile(io.BytesIO(data))

def read_dbf(data):
    n = struct.unpack("<I", data[4:8])[0]
    hlen, rlen = struct.unpack("<HH", data[8:12])
    fields, pos = [], 32
    while data[pos] != 0x0D:
        name = data[pos:pos + 11].split(b"\0")[0].decode()
        fields.append((name, data[pos + 16]))
        pos += 32
    rows = []
    for i in range(n):
        rec = data[hlen + i * rlen + 1: hlen + (i + 1) * rlen]
        row, off = {}, 0
        for name, flen in fields:
            row[name] = rec[off:off + flen].decode("latin-1").strip()
            off += flen
        rows.append(row)
    return rows

def read_shp(data):
    """Polygons only (shape type 5). Returns a list of lists of rings."""
    shapes, pos = [], 100
    while pos < len(data):
        _, clen = struct.unpack(">II", data[pos:pos + 8])
        body = data[pos + 8: pos + 8 + clen * 2]
        pos += 8 + clen * 2
        if struct.unpack("<i", body[:4])[0] != 5:
            shapes.append([])
            continue
        nparts, npts = struct.unpack("<ii", body[36:44])
        parts = list(struct.unpack(f"<{nparts}i", body[44:44 + 4 * nparts]))
        base = 44 + 4 * nparts
        pts = [struct.unpack("<dd", body[base + 16 * k: base + 16 * k + 16]) for k in range(npts)]
        parts.append(npts)
        shapes.append([pts[parts[k]:parts[k + 1]] for k in range(nparts)])
    return shapes

def simplify(pts, tol):
    """Douglas-Peucker, iterative. Keeps the first and last points."""
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        norm = math.hypot(dx, dy)
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            if norm < 1e-12:   # closed ring (start == end): use distance to the start point
                d = math.hypot(pts[i][0] - x1, pts[i][1] - y1)
            else:
                d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / norm
            if d > best:
                best, idx = d, i
        if best > tol and idx > 0:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k]

def main():
    z = read_zip(URL)
    name = [n for n in z.namelist() if n.endswith(".shp")][0][:-4]
    shapes = read_shp(z.read(name + ".shp"))
    rows = read_dbf(z.read(name + ".dbf"))

    towns = []
    for shp, row in zip(shapes, rows):
        if not shp or row.get("COUSUBFP") == "00000":   # skip water-only records
            continue
        towns.append((row.get("NAME", ""), row.get("NAMELSADCO", ""), shp))

    # State outline = edges used by exactly one town (coastline and state line).
    count = {}
    key = lambda p: (round(p[0], 7), round(p[1], 7))
    for _, _, rings in towns:
        for ring in rings:
            for a, b in zip(ring, ring[1:]):
                e = tuple(sorted((key(a), key(b))))
                count[e] = count.get(e, 0) + 1
    outer = [e for e, c in count.items() if c == 1]
    adj = {}
    for a, b in outer:
        adj.setdefault(a, []).append(b)
        adj.setdefault(b, []).append(a)
    used, state_lines = set(), []
    for a, b in outer:
        if (a, b) in used:
            continue
        line = [a, b]; used |= {(a, b), (b, a)}
        while True:
            nxt = next((c for c in adj.get(line[-1], []) if (line[-1], c) not in used), None)
            if nxt is None:
                break
            used |= {(line[-1], nxt), (nxt, line[-1])}
            line.append(nxt)
        if len(line) > 3:
            state_lines.append(line)

    lons = [p[0] for _, _, rs in towns for r in rs for p in r]
    lats = [p[1] for _, _, rs in towns for r in rs for p in r]
    lon0, lat0 = (min(lons) + max(lons)) / 2, (min(lats) + max(lats)) / 2
    k = math.cos(math.radians(lat0))
    minx, maxx = (min(lons) - lon0) * k, (max(lons) - lon0) * k
    miny, maxy = -max(lats), -min(lats)
    scale = (WIDTH - 2 * PAD) / (maxx - minx)
    height = round((maxy - miny) * scale + 2 * PAD)

    def proj(p):
        return ((p[0] - lon0) * k - minx) * scale + PAD, (-p[1] - miny) * scale + PAD

    def path(rings, tol, close):
        out = []
        for r in rings:
            s = simplify(r, tol)
            if len(s) < 3:
                continue
            xy = [proj(p) for p in s]
            out.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in xy) + ("Z" if close else ""))
        return "".join(out)

    town_out = []
    for nm, county, rings in sorted(towns, key=lambda t: t[0]):
        d = path(rings, TOLERANCE_TOWN, True)
        if d:
            town_out.append({"n": nm, "c": county, "d": d})
    state_d = path(state_lines, TOLERANCE_STATE, False)

    data = {
        "width": WIDTH, "height": height,
        "proj": {"lon0": lon0, "lat0": lat0, "k": k, "minx": minx, "miny": miny, "scale": scale, "pad": PAD},
        "kmPerPx": 111.32 / scale,   # km per SVG unit (1 degree of latitude is about 111.32 km)
        "state": state_d,
        "towns": town_out,
        "source": "U.S. Census Bureau, 2024 cartographic boundary file, county subdivisions (1:500,000)",
    }
    js = ("/* Generated by tools/make_ma_map.py. Do not edit by hand. */\n"
          "window.MA_MAP = " + json.dumps(data, separators=(",", ":")) + ";\n")
    open(OUT, "w").write(js)
    print(f"{len(town_out)} towns, {len(state_lines)} outline segments, {len(js)//1024} KB -> {OUT}")

if __name__ == "__main__":
    main()
