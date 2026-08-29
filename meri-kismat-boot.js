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
  const MISS_KEY = "mk-boot-v1";
  const MISS_TTL_MS = 6 * 60 * 60 * 1000;
  const ABSOLUTE = /^(?:[a-z]+:|\/\/|#|\/)/i;

  function defaultBases() {
    return [
      "https://cdn.jsdelivr.net/gh/" + REPO + "@main/",
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

  function setBootFlag(value) {
    if (typeof document === "undefined" || !document.documentElement) return;
    document.documentElement.setAttribute("data-mk-boot", value);
  }

  function swapDocument(html) {
    const go = function () {
      // document.write() from an async fetch is ignored or interpolates
      // into the parser. Cover the local page with a same-origin srcdoc
      // frame so scripts run on monezy.in and localStorage still works.
      let frame = document.getElementById("mk-github-frame");
      if (!frame) {
        frame = document.createElement("iframe");
        frame.id = "mk-github-frame";
        frame.title = "MeriKismat";
        frame.setAttribute(
          "style",
          "position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483647;background:#07051C"
        );
        (document.body || document.documentElement).appendChild(frame);
      }
      frame.srcdoc = html;
      setBootFlag("github");
    };
    if (typeof document === "undefined") return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", go);
    } else {
      go();
    }
  }

  function rememberMiss() {
    try {
      localStorage.setItem(MISS_KEY, JSON.stringify({ miss: true, at: Date.now() }));
    } catch (e) {}
  }

  function clearMiss() {
    try {
      localStorage.removeItem(MISS_KEY);
    } catch (e) {}
  }

  function recentMiss() {
    try {
      const j = JSON.parse(localStorage.getItem(MISS_KEY) || "null");
      return !!(j && j.miss && Date.now() - j.at < MISS_TTL_MS);
    } catch (e) {
      return false;
    }
  }

  function fetchFirstHtmlSync(urls) {
    if (typeof XMLHttpRequest === "undefined") return null;
    for (let i = 0; i < urls.length; i++) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", urls[i], false);
        xhr.send(null);
        if (xhr.status >= 200 && xhr.status < 300 && looksLikeHtml(xhr.responseText)) {
          return { url: urls[i], html: xhr.responseText };
        }
      } catch (e) {
        /* next candidate */
      }
    }
    return null;
  }

  function start(opts) {
    opts = opts || {};
    const loc = opts.location || (typeof location !== "undefined" ? location : { search: "" });
    setBootFlag("pending");
    if (queryParam(loc.search, "mk_local")) {
      setBootFlag("forced-local");
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
    const write = opts.write || (typeof document !== "undefined" ? swapDocument : function () {});
    const canSync =
      opts.sync !== false &&
      !opts.fetch &&
      !!queryParam(loc.search, "mk_from") &&
      typeof XMLHttpRequest !== "undefined" &&
      typeof document !== "undefined";
    if (canSync) {
      const hit = fetchFirstHtmlSync(urls);
      if (!hit) {
        setBootFlag("local");
        markLocalSource();
        return Promise.resolve({ source: "local" });
      }
      write(rewriteRelativeAssets(hit.html, hit.url));
      setBootFlag("github");
      return Promise.resolve({ source: "github", url: hit.url });
    }
    if (!queryParam(loc.search, "mk_from") && recentMiss()) {
      setBootFlag("local");
      markLocalSource();
      return Promise.resolve({ source: "local" });
    }
    const fetchFn = opts.fetch || (typeof fetch === "function" ? fetch.bind(root) : null);
    if (!fetchFn) {
      setBootFlag("local");
      markLocalSource();
      return Promise.resolve({ source: "local" });
    }
    return fetchFirstHtml(fetchFn, urls, opts.timeoutMs)
      .then(function (hit) {
        if (!hit) {
          rememberMiss();
          setBootFlag("local");
          markLocalSource();
          return { source: "local" };
        }
        clearMiss();
        write(rewriteRelativeAssets(hit.html, hit.url));
        setBootFlag("github");
        return { source: "github", url: hit.url };
      })
      .catch(function () {
        rememberMiss();
        setBootFlag("local");
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
    fetchFirstHtmlSync: fetchFirstHtmlSync,
    start: start,
  };
});
