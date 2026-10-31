import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { validateCatalogue } from "../validate-tools.mjs";

const catalogue = JSON.parse(readFileSync(new URL("../tools.json", import.meta.url)));
const schema = JSON.parse(readFileSync(new URL("../tools.schema.json", import.meta.url)));
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../app.js", import.meta.url), "utf8");

// Exercise the application's own filtering/URL logic without starting DOM rendering.
function app(query = "") {
  const nodes = new Map();
  const context = vm.createContext({
    URL, URLSearchParams, setTimeout, clearTimeout,
    matchMedia: () => ({ matches: false }),
    location: { search: query, pathname: "/", hash: "" },
    history: { replaceState(_state, _title, url) { context.sharedURL = url; } },
    document: { querySelector(id) {
      if (!nodes.has(id)) nodes.set(id, {});
      return nodes.get(id);
    } },
  });
  const source = script
    .replace("function render({ fit = false } = {}) {", "function unusedRender({ fit = false } = {}) {")
    .replace("  init();", `
      const render = () => {};
      globalThis.app = {
        state, matches, readURL, writeURL, resetFilters, activeFilterCount, renderFilterChips,
        configure(catalogue) {
          data = catalogue; tools = catalogue.tools; categories = catalogue.categories;
          byId = new Map(tools.map(t => [t.id, t]));
          categoryById = new Map(categories.map(c => [c.id, c]));
        }
      };
    `);
  vm.runInContext(source, context);
  context.app.configure(catalogue);
  context.app.readURL();
  return { api: context.app, context, nodes };
}

test("every tool has a reviewed purpose explanation and valid metadata", () => {
  assert.deepEqual(validateCatalogue(catalogue, schema), []);
  for (const tool of catalogue.tools) {
    assert.ok(tool.purposeNotes?.length >= 20, tool.id);
    assert.ok(!Object.hasOwn(tool, "workflows"), tool.id);
    assert.ok(!tool.features?.some(f => f.startsWith("ABA:")), tool.id);
  }
  const purposes = id => catalogue.tools.find(t => t.id === id).testingPurposes;
  assert.deepEqual(purposes("rentgen"), ["discovery", "verification"]);
  assert.deepEqual(purposes("postman"), ["verification"]);
  assert.deepEqual(purposes("schemathesis"), ["discovery"]);
  assert.deepEqual(purposes("evomaster"), ["discovery", "verification"]);
  assert.deepEqual(purposes("wiremock"), ["verification"]);
  assert.equal(purposes("apitally"), undefined);
});

for (const purpose of ["discovery", "verification"]) {
  test(`${purpose} filter combines with categories and survives share URLs`, () => {
    const { api, context } = app(`?purpose=${purpose}&category=security&ci=1`);
    const matches = catalogue.tools.filter(t => api.matches(t));
    assert.ok(matches.length > 0);
    assert.ok(matches.every(t => t.testingPurposes?.includes(purpose) && t.categories.includes("security") && t.ci === true));
    api.writeURL();
    const url = new URL(context.sharedURL, "https://example.com");
    assert.equal(url.searchParams.get("purpose"), purpose);
    assert.equal(url.searchParams.get("category"), "security");
    assert.equal(url.searchParams.get("ci"), "1");
    api.resetFilters();
    assert.equal(api.state.purpose, "");
    assert.equal(api.activeFilterCount(), 0);
    assert.equal(catalogue.tools.filter(t => api.matches(t)).length, catalogue.tools.length);
  });
}

test("both-purpose tools appear in both results and unclassified tools in neither", () => {
  const discovery = app("?purpose=discovery").api;
  const verification = app("?purpose=verification").api;
  const tool = id => catalogue.tools.find(t => t.id === id);
  assert.ok(discovery.matches(tool("rentgen")) && verification.matches(tool("rentgen")));
  assert.ok(!discovery.matches(tool("postman")) && verification.matches(tool("postman")));
  assert.ok(discovery.matches(tool("schemathesis")) && !verification.matches(tool("schemathesis")));
  assert.ok(!discovery.matches(tool("apitally")) && !verification.matches(tool("apitally")));
});

test("purpose is searchable and removable through the standard filter chip", () => {
  const { api, nodes } = app("?purpose=discovery");
  api.renderFilterChips();
  assert.match(nodes.get("#active-filters").innerHTML, /data-remove-filter="purpose"/);
  assert.equal(api.activeFilterCount(), 1);
  api.state.purpose = "";
  api.state.q = "verification";
  assert.ok(catalogue.tools.filter(t => api.matches(t)).length > 0);
  assert.match(html, /id="purpose-filter"/);
  assert.match(html, /id="purpose-explanation"/);
  assert.match(html, /value="discovery"/);
  assert.match(html, /value="verification"/);
  assert.doesNotMatch(script, /includes\("aba"\)|workflow-filter|Supports ABA/);
});

test("obsolete or unsupported purpose values are ignored and rejected in catalogue data", () => {
  assert.equal(app("?purpose=unsupported").api.state.purpose, "");
  assert.equal(app("?workflow=aba").api.state.purpose, "");
  for (const value of ["aba", "unsupported"]) {
    const invalid = structuredClone(catalogue);
    invalid.tools[0].testingPurposes = [value];
    assert.ok(validateCatalogue(invalid, schema).some(e => e.includes("testingPurposes")));
  }
});
