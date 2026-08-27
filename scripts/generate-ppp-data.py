#!/usr/bin/env python3
"""Download World Bank PPP indicators and write ppp-data.js."""

from __future__ import annotations

import json
import urllib.request
from pathlib import Path

INDICATORS = {
    "pppGdp": "PA.NUS.PPP",
    "pppCons": "PA.NUS.PRVT.PP",
    "xr": "PA.NUS.FCRF",
    "pliGdp": "PA.NUS.GDP.PLI",
    "pliCons": "PA.NUS.PRVT.PLI",
    "gdppc": "NY.GDP.PCAP.CD",
    "gdppcPpp": "NY.GDP.PCAP.PP.CD",
}

# ISO 3166-1 alpha-3 → ISO 4217. Euro-area members use EUR.
CURRENCY = {
    "ABW": "AWG", "AFG": "AFN", "AGO": "AOA", "ALB": "ALL", "ARE": "AED",
    "ARG": "ARS", "ARM": "AMD", "ATG": "XCD", "AUS": "AUD", "AUT": "EUR",
    "AZE": "AZN", "BDI": "BIF", "BEL": "EUR", "BEN": "XOF", "BFA": "XOF",
    "BGD": "BDT", "BGR": "BGN", "BHR": "BHD", "BHS": "BSD", "BIH": "BAM",
    "BLR": "BYN", "BLZ": "BZD", "BMU": "BMD", "BOL": "BOB", "BRA": "BRL",
    "BRB": "BBD", "BRN": "BND", "BTN": "BTN", "BWA": "BWP", "CAF": "XAF",
    "CAN": "CAD", "CHE": "CHF", "CHL": "CLP", "CHN": "CNY", "CIV": "XOF",
    "CMR": "XAF", "COD": "CDF", "COG": "XAF", "COL": "COP", "COM": "KMF",
    "CPV": "CVE", "CRI": "CRC", "CUB": "CUP", "CUW": "ANG", "CYM": "KYD",
    "CYP": "EUR", "CZE": "CZK", "DEU": "EUR", "DJI": "DJF", "DMA": "XCD",
    "DNK": "DKK", "DOM": "DOP", "DZA": "DZD", "ECU": "USD", "EGY": "EGP",
    "ERI": "ERN", "ESP": "EUR", "EST": "EUR", "ETH": "ETB", "FIN": "EUR",
    "FJI": "FJD", "FRA": "EUR", "FSM": "USD", "GAB": "XAF", "GBR": "GBP",
    "GEO": "GEL", "GHA": "GHS", "GIN": "GNF", "GMB": "GMD", "GNB": "XOF",
    "GNQ": "XAF", "GRC": "EUR", "GRD": "XCD", "GTM": "GTQ", "GUY": "GYD",
    "HKG": "HKD", "HND": "HNL", "HRV": "EUR", "HTI": "HTG", "HUN": "HUF",
    "IDN": "IDR", "IND": "INR", "IRL": "EUR", "IRN": "IRR", "IRQ": "IQD",
    "ISL": "ISK", "ISR": "ILS", "ITA": "EUR", "JAM": "JMD", "JOR": "JOD",
    "JPN": "JPY", "KAZ": "KZT", "KEN": "KES", "KGZ": "KGS", "KHM": "KHR",
    "KIR": "AUD", "KNA": "XCD", "KOR": "KRW", "KWT": "KWD", "LAO": "LAK",
    "LBN": "LBP", "LBR": "LRD", "LBY": "LYD", "LCA": "XCD", "LKA": "LKR",
    "LSO": "LSL", "LTU": "EUR", "LUX": "EUR", "LVA": "EUR", "MAC": "MOP",
    "MAR": "MAD", "MDA": "MDL", "MDG": "MGA", "MDV": "MVR", "MEX": "MXN",
    "MHL": "USD", "MKD": "MKD", "MLI": "XOF", "MLT": "EUR", "MMR": "MMK",
    "MNE": "EUR", "MNG": "MNT", "MOZ": "MZN", "MRT": "MRU", "MUS": "MUR",
    "MWI": "MWK", "MYS": "MYR", "NAM": "NAD", "NER": "XOF", "NGA": "NGN",
    "NIC": "NIO", "NLD": "EUR", "NOR": "NOK", "NPL": "NPR", "NZL": "NZD",
    "OMN": "OMR", "PAK": "PKR", "PAN": "PAB", "PER": "PEN", "PHL": "PHP",
    "PLW": "USD", "PNG": "PGK", "POL": "PLN", "PRI": "USD", "PRT": "EUR",
    "PRY": "PYG", "PSE": "ILS", "QAT": "QAR", "ROU": "RON", "RUS": "RUB",
    "RWA": "RWF", "SAU": "SAR", "SDN": "SDG", "SEN": "XOF", "SGP": "SGD",
    "SLB": "SBD", "SLE": "SLE", "SLV": "USD", "SOM": "SOS", "SRB": "RSD",
    "SSD": "SSP", "STP": "STN", "SUR": "SRD", "SVK": "EUR", "SVN": "EUR",
    "SWE": "SEK", "SWZ": "SZL", "SYC": "SCR", "SYR": "SYP", "TCA": "USD",
    "TCD": "XAF", "TGO": "XOF", "THA": "THB", "TJK": "TJS", "TKM": "TMT",
    "TLS": "USD", "TON": "TOP", "TTO": "TTD", "TUN": "TND", "TUR": "TRY",
    "TUV": "AUD", "TWN": "TWD", "TZA": "TZS", "UGA": "UGX", "UKR": "UAH",
    "URY": "UYU", "USA": "USD", "UZB": "UZS", "VCT": "XCD", "VEN": "VES",
    "VGB": "USD", "VIR": "USD", "VNM": "VND", "VUT": "VUV", "WSM": "WST",
    "XKX": "EUR", "YEM": "YER", "ZAF": "ZAR", "ZMB": "ZMW", "ZWE": "ZWG",
}

SYMBOLS = {
    "USD": "$", "EUR": "€", "GBP": "£", "INR": "₹", "JPY": "¥", "CNY": "¥",
    "KRW": "₩", "RUB": "₽", "TRY": "₺", "BRL": "R$", "ZAR": "R", "AUD": "A$",
    "CAD": "C$", "SGD": "S$", "HKD": "HK$", "CHF": "CHF", "SEK": "kr",
    "NOK": "kr", "DKK": "kr", "PLN": "zł", "THB": "฿", "IDR": "Rp",
    "PHP": "₱", "VND": "₫", "MYR": "RM", "AED": "د.إ", "SAR": "﷼",
    "ILS": "₪", "EGP": "E£", "NGN": "₦", "PKR": "₨", "BDT": "৳",
    "LKR": "Rs", "NPR": "Rs", "MXN": "MX$", "ARS": "$", "CLP": "$",
    "COP": "$", "NZD": "NZ$", "TWD": "NT$", "QAR": "QR", "KWD": "KD",
    "BHD": "BD", "OMR": "OMR", "HUF": "Ft", "CZK": "Kč", "RON": "lei",
    "UAH": "₴", "KZT": "₸", "KES": "KSh", "GHS": "GH₵",
}


def get_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "MonezyPPP/1.0"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.load(resp)


def fetch_indicator(code: str) -> dict:
    url = (
        "https://api.worldbank.org/v2/country/all/indicator/"
        f"{code}?format=json&per_page=400&mrnev=1"
    )
    payload = get_json(url)
    if not isinstance(payload, list) or len(payload) < 2 or not payload[1]:
        raise SystemExit(f"Failed to fetch {code}: {payload}")
    out = {}
    last_updated = payload[0].get("lastupdated")
    for row in payload[1]:
        iso = row.get("countryiso3code")
        if not iso or row.get("value") is None:
            continue
        out[iso] = {"year": int(row["date"]), "value": float(row["value"])}
    return out, last_updated


def main() -> None:
    meta_rows = get_json(
        "https://api.worldbank.org/v2/country/all?format=json&per_page=400"
    )[1]
    meta = {
        row["id"]: row
        for row in meta_rows
        if row.get("region", {}).get("value") not in (None, "Aggregates")
    }

    series = {}
    updated = {}
    for key, code in INDICATORS.items():
        series[key], updated[key] = fetch_indicator(code)
        print(f"{code:16} {key:10} n={len(series[key]):3} updated={updated[key]}")

    isos = sorted(set(series["pppGdp"]) & set(series["pppCons"]) & set(meta))
    countries = []
    for iso in isos:
        info = meta[iso]
        currency = CURRENCY.get(iso, "")
        years = [
            series[k][iso]["year"]
            for k in ("pppGdp", "pppCons")
            if iso in series[k]
        ]
        rec = {
            "iso3": iso,
            "iso2": info.get("iso2Code") or info.get("id"),
            "name": info["name"],
            "region": (info.get("region") or {}).get("value", "").strip(),
            "income": (info.get("incomeLevel") or {}).get("value", ""),
            "currency": currency,
            "symbol": SYMBOLS.get(currency, currency),
            "pppGdp": round(series["pppGdp"][iso]["value"], 8),
            "pppCons": round(series["pppCons"][iso]["value"], 8),
            "year": max(years),
        }
        if iso in series["xr"]:
            rec["xr"] = round(series["xr"][iso]["value"], 8)
        if iso in series["pliGdp"]:
            rec["pliGdp"] = round(series["pliGdp"][iso]["value"], 6)
        if iso in series["pliCons"]:
            rec["pliCons"] = round(series["pliCons"][iso]["value"], 6)
        if iso in series["gdppc"]:
            rec["gdppc"] = round(series["gdppc"][iso]["value"], 2)
        if iso in series["gdppcPpp"]:
            rec["gdppcPpp"] = round(series["gdppcPpp"][iso]["value"], 2)
        if "xr" not in rec and rec.get("pliGdp"):
            rec["xr"] = round(rec["pppGdp"] / (rec["pliGdp"] / 100.0), 8)
        countries.append(rec)

    payload = {
        "source": "World Bank World Development Indicators / International Comparison Program",
        "indicators": INDICATORS,
        "lastUpdated": updated.get("pppCons") or updated.get("pppGdp"),
        "year": max(c["year"] for c in countries),
        "count": len(countries),
        "countries": countries,
    }

    out_path = Path(__file__).resolve().parents[1] / "ppp-data.js"
    js = (
        "/* Generated from World Bank WDI. Do not edit by hand; "
        "run scripts/generate-ppp-data.py */\n"
        "window.PPP_DATA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    out_path.write_text(js, encoding="utf-8")
    print(f"wrote {out_path} countries={len(countries)} bytes={out_path.stat().st_size}")


if __name__ == "__main__":
    main()
