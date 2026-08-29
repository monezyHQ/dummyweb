"use strict";
const assert = require("assert");
const http = require("http");
const path = require("path");
global.MK_BOOT_MANUAL = true;
const MK = require(path.join(__dirname, "..", "meri-kismat-boot.js"));

assert.strictEqual(MK.REPO, "Bharat-Bagrodia/merikismat");
assert.ok(MK.looksLikeHtml("<!DOCTYPE html><html>"));
assert.ok(!MK.looksLikeHtml('{"ok":false}'));

const urls = MK.candidateUrls(["https://cdn.example/x/"]);
assert.deepStrictEqual(urls, [
  "https://cdn.example/x/index.html",
  "https://cdn.example/x/meri-kismat.html",
]);

assert.deepStrictEqual(
  MK.basesFromSearch("?mk_from=http://127.0.0.1:9/app"),
  ["http://127.0.0.1:9/app/"]
);

const rewritten = MK.rewriteRelativeAssets(
  '<link href="app.css"><script src="./boot.js"></script><a href="index.html">home</a><img src="https://fonts.g/x.png">',
  "https://cdn.jsdelivr.net/gh/Bharat-Bagrodia/merikismat@main/index.html"
);
assert.ok(rewritten.indexOf('href="https://cdn.jsdelivr.net/gh/Bharat-Bagrodia/merikismat@main/app.css"') !== -1);
assert.ok(rewritten.indexOf('src="https://cdn.jsdelivr.net/gh/Bharat-Bagrodia/merikismat@main/boot.js"') !== -1);
assert.ok(rewritten.indexOf('<a href="index.html">') !== -1, "page links stay relative so monezy home still works");
assert.ok(rewritten.indexOf('src="https://fonts.g/x.png"') !== -1);

(async function () {
  const missing = await MK.fetchFirstHtml(
    async () => ({ ok: false, text: async () => "" }),
    ["https://example.invalid/index.html"],
    200
  );
  assert.strictEqual(missing, null);

  const hit = await MK.fetchFirstHtml(
    async (url) => {
      if (url.endsWith("meri-kismat.html")) {
        return { ok: true, text: async () => "<!DOCTYPE html><html><body>REMOTE</body></html>" };
      }
      return { ok: false, text: async () => "" };
    },
    MK.candidateUrls(["https://cdn.example/x/"]),
    500
  );
  assert.strictEqual(hit.url, "https://cdn.example/x/meri-kismat.html");
  assert.ok(hit.html.indexOf("REMOTE") !== -1);

  const forced = await MK.start({
    location: { search: "?mk_local=1" },
    fetch: async () => {
      throw new Error("should not fetch");
    },
  });
  assert.strictEqual(forced.source, "forced-local");

  const remoteDoc = [];
  const live = await MK.start({
    location: { search: "?mk_from=https://cdn.example/x" },
    timeoutMs: 500,
    fetch: async (url) => {
      if (String(url).endsWith("index.html")) {
        return {
          ok: true,
          text: async () => '<html><head><link href="skin.css"></head><body>FROM GH</body></html>',
        };
      }
      return { ok: false, text: async () => "" };
    },
    write: (html) => remoteDoc.push(html),
  });
  assert.strictEqual(live.source, "github");
  assert.ok(remoteDoc[0].indexOf("FROM GH") !== -1);
  assert.ok(remoteDoc[0].indexOf("https://cdn.example/x/skin.css") !== -1);

  const server = http.createServer((req, res) => {
    if (req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end('<!DOCTYPE html><html><head><script src="remote.js"></script></head><body><h1 id="r">Live MeriKismat from GitHub</h1></body></html>');
      return;
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const httpHit = await MK.start({
    location: { search: "?mk_from=http://127.0.0.1:" + port + "/" },
    timeoutMs: 1000,
    fetch: global.fetch,
    write: (html) => remoteDoc.push(html),
  });
  assert.strictEqual(httpHit.source, "github");
  assert.ok(remoteDoc[1].indexOf("Live MeriKismat from GitHub") !== -1);
  assert.ok(remoteDoc[1].indexOf("http://127.0.0.1:" + port + "/remote.js") !== -1);
  server.close();

  console.log("ok merikismat-boot " + [
    "rewrite",
    "candidates",
    "fallback-miss",
    "forced-local",
    "mock-github",
    "http-github",
  ].join(" "));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
