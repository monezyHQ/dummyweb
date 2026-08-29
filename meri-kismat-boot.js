"use strict";
/**
 * Live-load MeriKismat from github.com/Bharat-Bagrodia/merikismat when that
 * repo is published. Falls back to the files already on monezy.in.
 *
 * Override the remote base with ?mk_from=https://host/path/
 * Skip remote fetch with ?mk_local=1
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MeriKismatBoot = api;
  if (typeof document !== "undefined" && !root.MK_BOOT_MANUAL) {
    api.start();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const REPO = "Bharat-Bagrodia/merikismat";
  const ENTRIES = ["index.html", "meri-kismat.html"];
  const TIMEOUT_MS = 1800;
  const ABSOLUTE = /^(?:[a-z]+:|\/\/|#|\/)/i;

  function defaultBases() {
    return [
      "https://cdn.jsdelivr.net/gh/" + REPO + "@main/",
      "https://cdn.jsdelivr.net/gh/" + REPO + "@master/",
      "https://bharat-bagrodia.github.io/merikismat/",
    ];
  }

  function queryParam(search, name) {
    const q = String(search || "").replace(/^\?/, "");
    if (!q) return "";
    const parts = q.split("&");
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const eq = p.indexOf("=");
      const k = decodeURIComponent(eq === -1 ? p : p.slice(0, eq));
      if (k === name) {
        return eq === -1 ? "1" : decodeURIComponent(p.slice(eq + 1).replace(/\+/g, " "));
      }
    }
    return "";
  }

  function ensureSlash(url) {
    if (!url) return url;
    return url.endsWith("/") ? url : url + "/";
  }

  function basesFromSearch(search) {
    const from = queryParam(search, "mk_from").trim();
    if (from) return [ensureSlash(from)];
    return defaultBases();
  }

  function candidateUrls(bases) {
    const out = [];
    (bases || defaultBases()).forEach(function (base) {
      const b = ensureSlash(base);
      ENTRIES.forEach(function (file) {
        out.push(b + file);
      });
    });
    return out;
  }

  function rewriteRelativeAssets(html, pageUrl) {
    const base = pageUrl.replace(/[^/]+$/, "");
    function resolve(url) {
      const u = String(url).trim();
      if (!u || ABSOLUTE.test(u) || u.charAt(0) === "?") return u;
      try {
        return new URL(u, base).href;
      } catch (e) {
        return base + u.replace(/^\.\//, "");
      }
    }
    return String(html)
      .replace(/(<script\b[^>]*\bsrc\s*=\s*["'])([^"']+)(["'])/gi, function (_, a, url, c) {
        return a + resolve(url) + c;
      })
      .replace(/(<link\b[^>]*\bhref\s*=\s*["'])([^"']+)(["'])/gi, function (_, a, url, c) {
        return a + resolve(url) + c;
      })
      .replace(/(<(?:img|source|video|audio|iframe)\b[^>]*\bsrc\s*=\s*["'])([^"']+)(["'])/gi, function (_, a, url, c) {
        return a + resolve(url) + c;
      });
  }

  function looksLikeHtml(text) {
    const s = String(text || "").slice(0, 4000).toLowerCase();
    return s.indexOf("<html") !== -1 || s.indexOf("<!doctype") !== -1;
  }

  async function fetchFirstHtml(fetchFn, urls, timeoutMs) {
    const ms = timeoutMs == null ? TIMEOUT_MS : timeoutMs;
    const ctrl = typeof AbortController === "function" ? new AbortController() : null;
    let timer = null;
    const timeout = new Promise(function (_, reject) {
      timer = setTimeout(function () {
        if (ctrl) ctrl.abort();
        reject(new Error("timeout"));
      }, ms);
    });
    const run = (async function () {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
          const res = await fetchFn(url, ctrl ? { signal: ctrl.signal, cache: "no-cache" } : { cache: "no-cache" });
          if (!res || !res.ok) continue;
          const text = await res.text();
          if (!looksLikeHtml(text)) continue;
          return { url: url, html: text };
        } catch (e) {
          if (e && e.name === "AbortError") throw e;
        }
      }
      return null;
    })();
    try {
      return await Promise.race([run, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function markLocalSource() {
    if (typeof document === "undefined") return;
    const apply = function () {
      const el = document.getElementById("mk-source");
      if (!el) return;
      el.hidden = false;
      el.textContent = "Local copy · live fetch from github.com/" + REPO + " missed";
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply);
    } else {
      apply();
    }
  }

  function swapDocument(html) {
    document.open();
    document.write(html);
    document.close();
  }

  function start(opts) {
    opts = opts || {};
    const loc = opts.location || (typeof location !== "undefined" ? location : { search: "" });
    if (queryParam(loc.search, "mk_local")) {
      if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", markLocalSource);
        } else {
          markLocalSource();
        }
      }
      return Promise.resolve({ source: "forced-local" });
    }
    const urls = candidateUrls(basesFromSearch(loc.search));
    const fetchFn = opts.fetch || (typeof fetch === "function" ? fetch.bind(root) : null);
    const write = opts.write || (typeof document !== "undefined" ? swapDocument : function () {});
    if (!fetchFn) {
      markLocalSource();
      return Promise.resolve({ source: "local" });
    }
    return fetchFirstHtml(fetchFn, urls, opts.timeoutMs)
      .then(function (hit) {
        if (!hit) {
          markLocalSource();
          return { source: "local" };
        }
        write(rewriteRelativeAssets(hit.html, hit.url));
        return { source: "github", url: hit.url };
      })
      .catch(function () {
        markLocalSource();
        return { source: "local" };
      });
  }

  return {
    REPO: REPO,
    ENTRIES: ENTRIES,
    TIMEOUT_MS: TIMEOUT_MS,
    defaultBases: defaultBases,
    queryParam: queryParam,
    basesFromSearch: basesFromSearch,
    candidateUrls: candidateUrls,
    rewriteRelativeAssets: rewriteRelativeAssets,
    looksLikeHtml: looksLikeHtml,
    fetchFirstHtml: fetchFirstHtml,
    start: start,
  };
});
