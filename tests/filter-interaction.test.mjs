import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const catalogue = JSON.parse(readFileSync(new URL("../tools.json", import.meta.url)));

// Run the unmodified app: initialization, real event handlers, and all renderers.
// The DOM adapter records output without requiring a browser dependency.
async function startApp() {
  const nodes = new Map();
  class Element extends EventTarget {
    constructor() {
      super();
      this.value = "";
      this.innerHTML = "";
      this.textContent = "";
      this.dataset = {};
      this.style = { setProperty() {} };
      this.clientWidth = 1200;
      this.clientHeight = 800;
      this.classList = { toggle() {}, add() {}, remove() {}, contains() { return false; } };
    }
    setAttribute() {}
    hasAttribute() { return false; }
    removeAttribute() {}
    querySelectorAll() { return []; }
    matches() { return false; }
    closest() { return this; }
    contains() { return false; }
  }
  const document = new Element();
  document.baseURI = "https://example.com/";
  document.body = new Element();
  document.querySelector = selector => {
    if (!nodes.has(selector)) nodes.set(selector, new Element());
    return nodes.get(selector);
  };
  const startInputs = [...html.matchAll(/data-start="([^"]+)"/g)].map((match) => {
    const element = new Element();
    element.dataset.start = match[1];
    nodes.set(`[data-start="${match[1]}"]`, element);
    return element;
  });
  document.querySelectorAll = selector => selector === "[data-start]" ? startInputs : [];
  const errors = [];
  const context = vm.createContext({
    document, window: new Element(), URL, URLSearchParams, setTimeout, clearTimeout,
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    location: { search: "", pathname: "/", hash: "" },
    history: { replaceState(_s, _t, url) { context.sharedURL = url; } },
    localStorage: { getItem() { return null; } },
    fetch: async () => ({ ok: true, json: async () => catalogue }),
    console: { error(...args) { errors.push(args.join(" ")); } },
  });
  vm.runInContext(script, context);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(errors, [], "Application initialization/rendering must succeed");
  return { nodes, context, document };
}

test("changing the actual purpose select updates directory, map, counts, chips and URL", async () => {
  const { nodes, context } = await startApp();
  assert.equal(nodes.get("#result-count").textContent, "166 tools to explore");
  const select = nodes.get("#purpose-filter");
  for (const [purpose, expected] of [["discovery", 25], ["verification", 152], ["", 166]]) {
    select.value = purpose;
    select.dispatchEvent(new Event("change"));
    assert.equal(nodes.get("#result-count").textContent, `${expected} tools ${purpose ? "found" : "to explore"}`);
    const directory = nodes.get("#tools-table-body");
    assert.ok(directory, "Actual directory renderer must run");
    if (purpose === "discovery") {
      assert.match(directory.innerHTML, /Schemathesis/);
      assert.match(nodes.get("#map-clusters").innerHTML, /data-map-tool="cats"/);
      assert.doesNotMatch(nodes.get("#map-clusters").innerHTML, /data-map-tool="advanced-rest-client"/);
      assert.doesNotMatch(directory.innerHTML, /data-tool="postman"/);
    }
    if (purpose === "verification") {
      assert.match(directory.innerHTML, /data-tool="postman"/);
      assert.doesNotMatch(nodes.get("#map-clusters").innerHTML, /data-map-tool="cats"/);
      assert.doesNotMatch(directory.innerHTML, /data-tool="schemathesis"/);
    }
    assert.equal(new URL(context.sharedURL, "https://example.com").searchParams.get("purpose"), purpose || null);
    assert.equal(nodes.get("#active-filters").hidden, !purpose);
  }
});

test("HTML references the current script content so cached older scripts are not reused", () => {
  const version = createHash("sha256").update(script).digest("hex").slice(0, 12);
  assert.ok(html.includes(`./app.js?v=${version}`));
});


test("start-point checkboxes apply OR matching and combine with purpose and URL", async () => {
  const { nodes, context, document } = await startApp();
  const curl = nodes.get('[data-start="curl"]');
  const openapi = nodes.get('[data-start="openapi"]');
  const table = nodes.get("#tools-table-body");
  const selectPoint = (input, checked) => {
    input.checked = checked;
    input.dispatchEvent(new Event("change"));
  };
  selectPoint(curl, true);
  assert.match(table.innerHTML, /data-tool="rentgen"/);
  assert.doesNotMatch(table.innerHTML, /data-tool="schemathesis"/);
  assert.equal(new URL(context.sharedURL, "https://example.com").searchParams.get("start"), "curl");
  selectPoint(openapi, true);
  assert.match(table.innerHTML, /data-tool="schemathesis"/);
  assert.match(table.innerHTML, /data-tool="rentgen"/);
  assert.equal(nodes.get("#start-filter-count").textContent, " · 2 selected");
  const params = new URL(context.sharedURL, "https://example.com").searchParams;
  assert.deepEqual(params.get("start").split(",").sort(), ["curl", "openapi"]);
  const purpose = nodes.get("#purpose-filter");
  purpose.value = "discovery";
  purpose.dispatchEvent(new Event("change"));
  assert.match(table.innerHTML, /data-tool="schemathesis"/);
  assert.doesNotMatch(table.innerHTML, /data-tool="postman"/);
  assert.match(nodes.get("#active-filters").innerHTML, /data-remove-filter="start:curl"/);
  // Exercise the real delegated reset-button handler, too.
  const reset = nodes.get("#reset-filters");
  reset.dataset.action = "reset";
  const click = new Event("click");
  Object.defineProperty(click, "target", { value: reset });
  document.dispatchEvent(click);
  assert.equal(nodes.get("#result-count").textContent, "166 tools to explore");
  assert.equal(curl.checked, false);
  assert.equal(openapi.checked, false);
  assert.equal(new URL(context.sharedURL, "https://example.com").searchParams.get("start"), null);
});
