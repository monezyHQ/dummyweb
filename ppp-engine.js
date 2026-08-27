/**
 * Purchasing-power-parity helpers used by ppp-calculator.html.
 * Formulas follow World Bank ICP / WDI conventions (US dollar numeraire).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PPPEngine = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function requireNum(n, label) {
    var v = Number(n);
    if (!Number.isFinite(v) || v <= 0) {
      throw new Error(label + " must be a positive number");
    }
    return v;
  }

  function flagEmoji(iso2) {
    if (!iso2 || iso2.length !== 2) return "";
    return iso2
      .toUpperCase()
      .replace(/./g, function (c) {
        return String.fromCodePoint(127397 + c.charCodeAt(0));
      });
  }

  function pppRate(country, series) {
    var key = series === "gdp" ? "pppGdp" : "pppCons";
    var rate = country && country[key];
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Missing PPP conversion factor");
    }
    return rate;
  }

  function priceLevel(country, series) {
    var key = series === "gdp" ? "pliGdp" : "pliCons";
    if (country && Number.isFinite(country[key])) return country[key];
    var xr = country && country.xr;
    var ppp = pppRate(country, series);
    if (!Number.isFinite(xr) || xr <= 0) return null;
    return (ppp / xr) * 100;
  }

  function toIntl(amount, country, series) {
    return requireNum(amount, "Amount") / pppRate(country, series);
  }

  function fromIntl(intlAmount, country, series) {
    return requireNum(intlAmount, "Amount") * pppRate(country, series);
  }

  /**
   * Local-currency amount in `to` that buys the same ICP basket as `amount` in `from`.
   * equivalent_B = amount_A × (PPP_B / PPP_A)
   */
  function equivalent(amount, from, to, series) {
    return fromIntl(toIntl(amount, from, series), to, series);
  }

  function marketConvert(amount, from, to) {
    var a = requireNum(amount, "Amount");
    if (!from || !to || !(from.xr > 0) || !(to.xr > 0)) {
      throw new Error("Missing market exchange rate");
    }
    return (a / from.xr) * to.xr;
  }

  /**
   * Share of market FX explained by the PPP (local currency vs USD).
   * Positive => undervalued (cheaper than the US after converting at market FX).
   */
  function undervaluationVsUsd(country, series) {
    var key = series === "gdp" ? "pppGdp" : "pppCons";
    var ppp = country && country[key];
    var xr = country && country.xr;
    if (!(ppp > 0) || !(xr > 0)) return null;
    return (1 - ppp / xr) * 100;
  }

  function impliedFxPerUsd(country, series) {
    return pppRate(country, series);
  }

  /**
   * Bilateral market rate in to-currency per 1 from-currency unit.
   */
  function marketPairRate(from, to) {
    if (!from || !to || !(from.xr > 0) || !(to.xr > 0)) return null;
    return to.xr / from.xr;
  }

  /**
   * Bilateral PPP rate in to-currency per 1 from-currency unit.
   */
  function pppPairRate(from, to, series) {
    return pppRate(to, series) / pppRate(from, series);
  }

  /**
   * Jevons elementary PPP: geometric mean of price relatives (to/from).
   * Matches ICP basic-heading practice when every item is priced in both places.
   */
  function jevonsPpp(fromPrices, toPrices) {
    if (!fromPrices || !toPrices || fromPrices.length !== toPrices.length || !fromPrices.length) {
      throw new Error("Need matching positive prices in both places");
    }
    var logSum = 0;
    var n = fromPrices.length;
    for (var i = 0; i < n; i++) {
      var a = Number(fromPrices[i]);
      var b = Number(toPrices[i]);
      if (!(a > 0) || !(b > 0)) {
        throw new Error("Each matched price must be positive");
      }
      logSum += Math.log(b / a);
    }
    return Math.exp(logSum / n);
  }

  function indianGroup(intPart) {
    var s = String(intPart);
    if (s.length <= 3) return s;
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3);
    var grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return grouped + "," + last3;
  }

  function formatNumber(value, opts) {
    opts = opts || {};
    var abs = Math.abs(value);
    var digits = opts.digits;
    if (digits == null) {
      if (abs >= 1000) digits = 0;
      else if (abs >= 100) digits = 1;
      else if (abs >= 1) digits = 2;
      else digits = 4;
    }
    var n = Number(value.toFixed(digits));
    var parts = Math.abs(n).toFixed(digits).split(".");
    var grouped =
      opts.indian && Math.abs(n) >= 1000
        ? indianGroup(parts[0])
        : parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var out = (n < 0 ? "-" : "") + grouped + (parts[1] != null ? "." + parts[1] : "");
    return out;
  }

  function formatMoney(value, country, opts) {
    opts = opts || {};
    var symbol = (country && (country.symbol || country.currency)) || "";
    var num = formatNumber(value, opts);
    if (!symbol) return num;
    if (/^[A-Za-z]/.test(symbol) && symbol.length >= 3) return symbol + " " + num;
    return symbol + num;
  }

  function lakhCrore(inr) {
    var abs = Math.abs(inr);
    if (abs >= 1e7) return (inr / 1e7).toFixed(2) + " crore";
    if (abs >= 1e5) return (inr / 1e5).toFixed(2) + " lakh";
    return null;
  }

  function compare(amount, from, to, series) {
    var intl = toIntl(amount, from, series);
    var pppTo = equivalent(amount, from, to, series);
    var fxTo = null;
    var fxGap = null;
    try {
      fxTo = marketConvert(amount, from, to);
      fxGap = pppTo - fxTo;
    } catch (e) {
      fxTo = null;
    }
    var fromPli = priceLevel(from, series);
    var toPli = priceLevel(to, series);
    var livingRatio = fromPli && toPli ? toPli / fromPli : pppPairRate(from, to, series) / (marketPairRate(from, to) || pppPairRate(from, to, series));
    return {
      intl: intl,
      pppTo: pppTo,
      fxTo: fxTo,
      fxGap: fxGap,
      fromPli: fromPli,
      toPli: toPli,
      livingRatio: livingRatio,
      pppPair: pppPairRate(from, to, series),
      marketPair: marketPairRate(from, to),
      fromUndervalued: undervaluationVsUsd(from, series),
      toUndervalued: undervaluationVsUsd(to, series),
    };
  }

  return {
    flagEmoji: flagEmoji,
    pppRate: pppRate,
    priceLevel: priceLevel,
    toIntl: toIntl,
    fromIntl: fromIntl,
    equivalent: equivalent,
    marketConvert: marketConvert,
    undervaluationVsUsd: undervaluationVsUsd,
    impliedFxPerUsd: impliedFxPerUsd,
    marketPairRate: marketPairRate,
    pppPairRate: pppPairRate,
    jevonsPpp: jevonsPpp,
    formatNumber: formatNumber,
    formatMoney: formatMoney,
    lakhCrore: lakhCrore,
    compare: compare,
  };
});
