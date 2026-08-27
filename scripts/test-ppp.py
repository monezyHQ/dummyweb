#!/usr/bin/env python3
"""Sanity-check PPP formulas against World Bank identity relations."""

import json
import math
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
js = (ROOT / "ppp-data.js").read_text(encoding="utf-8")
match = re.search(r"window\.PPP_DATA = (\{.*\});\s*$", js, re.S)
data = json.loads(match.group(1))
by = {c["iso3"]: c for c in data["countries"]}

ind = by["IND"]
usa = by["USA"]
gbr = by["GBR"]
che = by["CHE"]

assert usa["pppCons"] == 1.0
assert usa["pppGdp"] == 1.0
assert abs(usa["pliCons"] - 100) < 1e-6

# PLI identity: PLI ≈ (PPP / XR) × 100
for iso in ("IND", "CHE", "GBR", "JPN", "DEU", "SGP", "CHN"):
    c = by[iso]
    implied = (c["pppGdp"] / c["xr"]) * 100
    assert abs(implied - c["pliGdp"]) < 0.05, (iso, implied, c["pliGdp"])

# Equivalent salary: ₹15 lakh in India → US consumption dollars
amount = 1_500_000
us_eq = amount / ind["pppCons"]
ind_back = us_eq * ind["pppCons"]
assert abs(ind_back - amount) < 1e-6
uk_eq = amount * (gbr["pppCons"] / ind["pppCons"])
assert uk_eq > 0

# Switzerland should be more expensive than India (higher consumption PLI)
assert che["pliCons"] > ind["pliCons"]

# INR undervalued vs USD: PPP << market FX
underval = (1 - ind["pppCons"] / ind["xr"]) * 100
assert underval > 50

# Jevons: two identical price relatives of 2 should yield 2
rel = math.exp((math.log(20 / 10) + math.log(6 / 3)) / 2)
assert abs(rel - 2) < 1e-12

engine = (ROOT / "ppp-engine.js").read_text(encoding="utf-8")
# Node unit checks if node exists
node = subprocess.run(["which", "node"], capture_output=True, text=True)
if node.returncode == 0:
    script = r"""
const { createContext, runInContext } = require('vm');
const fs = require('fs');
const engineSrc = fs.readFileSync('ppp-engine.js','utf8');
const dataSrc = fs.readFileSync('ppp-data.js','utf8');
const ctx = { console, module: { exports: {} }, window: {} };
runInContext(engineSrc + '\n' + dataSrc, createContext(ctx));
const E = ctx.module.exports;
const data = ctx.window.PPP_DATA;
const by = Object.fromEntries(data.countries.map(c => [c.iso3, c]));
const ind = by.IND, usa = by.USA, gbr = by.GBR;
const amount = 1500000;
const eq = E.equivalent(amount, ind, usa, 'cons');
if (Math.abs(eq - amount / ind.pppCons) > 1e-6) throw new Error('eq');
const back = E.equivalent(eq, usa, ind, 'cons');
if (Math.abs(back - amount) > 1e-6) throw new Error('roundtrip');
const j = E.jevonsPpp([10,3],[20,6]);
if (Math.abs(j-2)>1e-12) throw new Error('jevons');
const cmp = E.compare(amount, ind, gbr, 'cons');
if (!(cmp.pppTo > 0 && cmp.intl > 0)) throw new Error('compare');
if (E.flagEmoji('IN') !== '🇮🇳') throw new Error('flag');
console.log('node engine ok', { usEq: eq, ukEq: cmp.pppTo, intl: cmp.intl });
"""
    r = subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True, text=True)
    print(r.stdout)
    if r.returncode != 0:
        print(r.stderr)
        sys.exit(r.returncode)
else:
    print("node not found; python identities only")

print(
    "python ok",
    {
        "year": data["year"],
        "count": data["count"],
        "india_ppp_cons": ind["pppCons"],
        "us_eq_15lakh": round(us_eq, 2),
        "uk_eq_15lakh": round(uk_eq, 2),
        "inr_undervalued_pct": round(underval, 1),
    },
)
