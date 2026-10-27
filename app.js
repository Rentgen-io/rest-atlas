/* REST Atlas. All catalogue content comes from tools.json. No libraries or build step. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const paths = {
    map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2z"/><path d="M9 3v16M15 5v16"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',
    bookmark: '<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4z"/>',
    github:
      '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.3 4a5 5 0 0 0-.1-4S18 0 15 1.5a14 14 0 0 0-7 0C5 0 3.8 0 3.8 0a5 5 0 0 0-.1 4A5.4 5.4 0 0 0 2.2 8c0 5.4 3.5 6.6 6.8 7a3.5 3.5 0 0 0-1 3v4" transform="translate(1 1) scale(.91)"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    "arrow-right": '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    sliders:
      '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    link: '<path d="m10 13 4-4m-5 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)"/>',
    "git-pull-request":
      '<circle cx="6" cy="5" r="2"/><path d="M6 7v14m9-18v4a3 3 0 0 0 3 3h0v7"/><circle cx="18" cy="19" r="2"/><path d="m12 6 3-3 3 3"/>',
    "git-branch":
      '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><path d="M6 7v10m12-10v2a10 10 0 0 1-10 10"/>',
    hand: '<path d="M8 13V6a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9c0 4-3 6-6 6h-2c-2 0-3-1-4-3l-4-6a2 2 0 0 1 3-2l1 2z"/>',
    maximize: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    columns:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4"/>',
    terminal:
      '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    sparkles:
      '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
    shield:
      '<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
    file: '<path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h8"/>',
    activity: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    layers: '<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
    monitor:
      '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4m-6-10h3l2-4 3 7 2-3h2"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18"/>',
  };
  const icon = (name) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.layers}</svg>`;
  const hydrateIcons = (root) =>
    $$("[data-icon]", root).forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
  const labels = {
    licenseModel: {
      "open-source": "Open source",
      "source-available": "Source available",
      proprietary: "Proprietary",
      unknown: "Unknown",
    },
    execution: {
      local: "Local",
      cloud: "Cloud",
      "self-hosted": "Self-hosted",
      unknown: "Unknown",
    },
    interfaces: {
      desktop: "Desktop",
      cli: "CLI",
      web: "Web app",
      library: "Library",
      ide: "IDE extension",
      unknown: "Unknown",
    },
    testCreation: {
      manual: "Manual",
      scripted: "Scripted",
      generated: "Generated",
      recorded: "Recorded",
      unknown: "Unknown",
    },
    pricing: {
      free: "Free",
      freemium: "Free + paid",
      paid: "Paid",
      unknown: "Unknown",
    },
    status: {
      active: "Active",
      maintenance: "Maintenance",
      archived: "Archived",
      unknown: "Unknown",
    },
  };
  const label = (type, value) => labels[type][value] || "Unknown";
  const joined = (type, values) =>
    Array.isArray(values) && values.length
      ? values.map((v) => label(type, v)).join(" · ")
      : "Unknown";
  const safeURL = (value) => {
    try {
      const u = new URL(value);
      return ["https:", "http:"].includes(u.protocol) &&
        !u.username &&
        !u.password
        ? u.href
        : "";
    } catch {
      return "";
    }
  };
  let data,
    categories = [],
    tools = [],
    byId = new Map(),
    categoryById = new Map();
  const state = {
    q: "",
    category: "",
    license: "",
    execution: "",
    pricing: "",
    creation: "",
    ci: false,
    view: "map",
    saved: false,
    sort: "name",
    tool: "",
  };
  let selected = [],
    saved = new Set(),
    storageAvailable = true,
    toastTimer;
  let groups = [],
    world = { width: 1, height: 1 },
    camera = { x: 0, y: 0, scale: 1 },
    drawFrame;
  const compareLimit = 3;
  // A 36px map control remains larger than 24px after this transform.
  const minMapScale = 0.55;
  const collator = new Intl.Collator("en", { sensitivity: "base" });
  const viewport = $("#map-viewport");
  const pointers = new Map();
  let gesture = null,
    blockClickUntil = 0,
    initialMap = true,
    lastMobile = matchMedia("(max-width:760px)").matches;
  let showConnections = true;

  function notify(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").hidden = false;
    toastTimer = setTimeout(() => {
      $("#toast").hidden = true;
    }, 3600);
  }
  function readSaved() {
    try {
      const value = JSON.parse(
        localStorage.getItem("rest-atlas.saved.v1") || "[]",
      );
      return new Set(
        Array.isArray(value)
          ? value.filter((id) => typeof id === "string" && byId.has(id))
          : [],
      );
    } catch {
      storageAvailable = false;
      return new Set();
    }
  }
  function saveTool(id) {
    if (!byId.has(id)) return;
    const wasSaved = saved.has(id);
    if (wasSaved) saved.delete(id);
    else saved.add(id);
    try {
      localStorage.setItem("rest-atlas.saved.v1", JSON.stringify([...saved]));
    } catch {
      storageAvailable = false;
    }
    render({ fit: state.saved });
    updateDetailButtons();
    if (!storageAvailable)
      notify(
        "Saved for this visit. Your browser is blocking persistent storage.",
      );
    else
      notify(
        `${byId.get(id).name} ${wasSaved ? "removed from" : "added to"} saved tools.`,
      );
  }
  function avatar(tool, large = false) {
    const palette = [
      ["#e8eee3", "#425b32"],
      ["#fff0e6", "#87491f"],
      ["#eae9f6", "#594880"],
      ["#e5f0f1", "#35616a"],
      ["#f5e9eb", "#854653"],
      ["#e7f1e9", "#365e44"],
    ];
    const hash = [...tool.id].reduce((n, c) => n + c.charCodeAt(0), 0);
    const [bg, fg] = palette[hash % palette.length];
    const initials =
      tool.name
        .replace(/[^a-z0-9 ]/gi, "")
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2) || tool.name.slice(0, 2);
    return `<span class="tool-avatar${large ? " large" : ""}" style="--tool-bg:${bg};--tool-color:${fg}" aria-hidden="true">${escape(initials)}</span>`;
  }
  function categoryTag(id) {
    const category = categoryById.get(id);
    if (!category) return "";
    return `<span class="category-tag" style="--category-color:${category.color};--category-bg:${category.color}10"><span class="category-dot"></span>${escape(category.name)}</span>`;
  }
  function savedButton(tool) {
    const active = saved.has(tool.id);
    return `<button class="icon-button save-button${active ? " is-saved" : ""}" data-save="${escape(tool.id)}" aria-pressed="${active}" aria-label="${active ? "Unsave" : "Save"} ${escape(tool.name)}" title="${active ? "Remove from saved" : "Save tool"}">${icon("bookmark")}</button>`;
  }
  function matches(tool, ignoreCategory = false) {
    if (state.saved && !saved.has(tool.id)) return false;
    if (
      !ignoreCategory &&
      state.category &&
      !tool.categories.includes(state.category)
    )
      return false;
    if (state.license && (tool.licenseModel || "unknown") !== state.license)
      return false;
    if (state.pricing && (tool.pricing || "unknown") !== state.pricing)
      return false;
    for (const [key, field] of [
      ["execution", "execution"],
      ["creation", "testCreation"],
    ]) {
      if (
        state[key] &&
        !(tool[field]?.length ? tool[field] : ["unknown"]).includes(state[key])
      )
        return false;
    }
    if (state.ci && tool.ci !== true) return false;
    if (state.q) {
      const haystack = [
        tool.name,
        tool.description,
        ...(tool.features || []),
        ...(tool.tags || []),
        ...tool.categories.map((id) => categoryById.get(id)?.name || ""),
        tool.license || "",
      ]
        .join(" ")
        .toLowerCase();
      if (
        !state.q
          .toLowerCase()
          .split(/\s+/)
          .every((word) => haystack.includes(word))
      )
        return false;
    }
    return true;
  }
  function sorted(list) {
    return [...list].sort((a, b) => {
      if (state.sort === "verified")
        return (
          b.lastVerified.localeCompare(a.lastVerified) ||
          collator.compare(a.name, b.name)
        );
      if (state.sort === "category")
        return (
          collator.compare(
            categoryById.get(a.categories[0]).name,
            categoryById.get(b.categories[0]).name,
          ) || collator.compare(a.name, b.name)
        );
      return collator.compare(a.name, b.name);
    });
  }
  function readURL() {
    const p = new URLSearchParams(location.search);
    state.q = (p.get("q") || "").slice(0, 200);
    state.category = categoryById.has(p.get("category"))
      ? p.get("category")
      : "";
    for (const [key, type] of [
      ["license", "licenseModel"],
      ["execution", "execution"],
      ["pricing", "pricing"],
      ["creation", "testCreation"],
    ]) {
      state[key] = Object.hasOwn(labels[type], p.get(key)) ? p.get(key) : "";
    }
    state.ci = p.get("ci") === "1";
    state.saved = p.get("saved") === "1";
    state.view = p.get("view") === "list" ? "list" : "map";
    state.tool = byId.has(p.get("tool")) ? p.get("tool") : "";
    selected = [
      ...new Set(
        (p.get("compare") || "").split(",").filter((id) => byId.has(id)),
      ),
    ].slice(0, compareLimit);
  }
  function writeURL() {
    const p = new URLSearchParams();
    for (const key of [
      "q",
      "category",
      "license",
      "execution",
      "pricing",
      "creation",
    ])
      if (state[key]) p.set(key, state[key]);
    if (state.view !== "map") p.set("view", state.view);
    if (state.ci) p.set("ci", "1");
    if (state.saved) p.set("saved", "1");
    if (state.tool) p.set("tool", state.tool);
    if (selected.length) p.set("compare", selected.join(","));
    const query = p.toString();
    try {
      history.replaceState(
        null,
        "",
        location.pathname + (query ? "?" + query : "") + location.hash,
      );
    } catch {
      /* Sandboxed previews may disable history. */
    }
  }
  function activeFilterCount() {
    return [
      "q",
      "category",
      "license",
      "execution",
      "pricing",
      "creation",
      "ci",
    ].filter((key) => state[key]).length;
  }
  function renderFilterChips() {
    const chips = [];
    if (state.category)
      chips.push(["category", categoryById.get(state.category).name]);
    if (state.saved) chips.push(["saved", "Saved tools"]);
    if (state.q) chips.push(["q", `Search: ${state.q}`]);
    for (const [key, type] of [
      ["license", "licenseModel"],
      ["execution", "execution"],
      ["pricing", "pricing"],
      ["creation", "testCreation"],
    ])
      if (state[key]) chips.push([key, label(type, state[key])]);
    if (state.ci) chips.push(["ci", "CI/CD ready"]);
    $("#active-filters").hidden = !chips.length;
    $("#active-filters").innerHTML = chips
      .map(
        ([key, value]) =>
          `<button class="filter-chip" data-remove-filter="${key}" aria-label="Remove filter: ${escape(value)}">${escape(value)}${icon("close")}</button>`,
      )
      .join("");
    $("#reset-filters").hidden = !activeFilterCount();
  }
  function renderNavigation() {
    const withoutCategory = tools.filter((tool) => matches(tool, true));
    $("#category-nav").innerHTML =
      `<button class="category-item${!state.category ? " active" : ""}" data-category="" aria-pressed="${!state.category}" style="--category-bg:#f2f5ef"><span class="category-dot" style="--category-color:#8a9e80"></span><span>All categories</span><span class="count">${withoutCategory.length}</span></button>` +
      categories
        .map((c) => {
          const count = withoutCategory.filter((t) =>
            t.categories.includes(c.id),
          ).length;
          return `<button class="category-item${state.category === c.id ? " active" : ""}" data-category="${escape(c.id)}" aria-pressed="${state.category === c.id}" style="--category-color:${c.color};--category-bg:${c.color}10"><span class="category-dot"></span><span>${escape(c.name)}</span><span class="count">${count}</span></button>`;
        })
        .join("");
    $("#all-count").textContent = tools.length;
    $("#saved-count").textContent = saved.size;
    $$("[data-workspace]").forEach((button) => {
      const active = state.saved
        ? button.dataset.workspace === "saved"
        : button.dataset.workspace === state.view;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }
  function render({ fit = false } = {}) {
    if (!data) return;
    const result = sorted(tools.filter((tool) => matches(tool)));
    if (
      document.activeElement !== $("#search") ||
      $("#search").value.trim() !== state.q
    )
      $("#search").value = state.q;
    for (const key of ["license", "execution", "pricing", "creation"]) {
      const el = $(`#${key}-filter`);
      el.value = state[key];
      el.classList.toggle("is-active", !!state[key]);
    }
    $("#ci-filter").checked = state.ci;
    $("#sort").value = state.sort;
    $$("[data-view]").forEach((button) => {
      const active = button.dataset.view === state.view;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", active);
    });
    $("#result-count").textContent =
      `${result.length} ${result.length === 1 ? "tool" : "tools"}${activeFilterCount() || state.saved ? " found" : " to explore"}`;
    $("#result-context").textContent = state.saved
      ? "your saved collection"
      : state.category
        ? categoryById.get(state.category).name.toLowerCase()
        : "the whole ecosystem";
    $("#empty-state").hidden = !!result.length;
    $("#map-view").hidden = state.view !== "map" || !result.length;
    $("#list-view").hidden = state.view !== "list" || !result.length;
    $("#map-note").hidden = state.view !== "map" || !result.length;
    const emptySaved = state.saved && !saved.size;
    const emptyButton = $("#empty-state button");
    emptyButton.textContent = emptySaved
      ? "Explore all tools"
      : "Clear filters";
    emptyButton.dataset.action = emptySaved ? "explore" : "reset";
    $("#empty-message").textContent =
      state.saved && !saved.size
        ? "Save a tool with the bookmark button to build your own collection. Your saved tools stay in this browser."
        : "Try a broader search or clear a filter to explore more of the atlas.";
    renderNavigation();
    renderFilterChips();
    renderDirectory(result);
    renderMap(result);
    updateCompareUI();
    writeURL();
    if (result.length && state.view === "map" && (fit || initialMap))
      requestAnimationFrame(() => {
        fitMap(initialMap);
        initialMap = false;
      });
  }
  function renderDirectory(result) {
    $("#tools-table-body").innerHTML = result
      .map(
        (tool) =>
          `<tr><td class="compare-col"><input class="compare-check" type="checkbox" data-compare="${escape(tool.id)}" aria-label="Compare ${escape(tool.name)}"${selected.includes(tool.id) ? " checked" : ""}></td><td><button class="table-tool" data-tool="${escape(tool.id)}">${avatar(tool)}<span><strong>${escape(tool.name)}</strong><span class="tool-desc">${escape(tool.description)}</span></span></button></td><td><div class="capability-tags">${tool.categories.slice(0, 2).map(categoryTag).join("")}${
            tool.categories.length > 2
              ? `<span class="category-tag" title="${escape(
                  tool.categories
                    .slice(2)
                    .map((id) => categoryById.get(id).name)
                    .join(", "),
                )}">+${tool.categories.length - 2}</span>`
              : ""
          }</div></td><td><span class="license-badge">${icon(tool.licenseModel === "proprietary" ? "lock" : "file")}${escape(label("licenseModel", tool.licenseModel))}</span></td><td class="table-execution">${escape(joined("execution", tool.execution))}</td><td><span class="pricing-tag${tool.pricing === "free" ? " free" : ""}">${escape(label("pricing", tool.pricing))}</span></td><td>${savedButton(tool)}</td></tr>`,
      )
      .join("");
  }
  function renderMap(result) {
    const mobile = matchMedia("(max-width:760px)").matches;
    const columns = mobile ? 2 : 4,
      width = 270,
      gap = 34,
      padding = 34;
    const activeGroups = categories
      .map((c) => ({
        category: c,
        tools: result
          .filter((t) => t.categories.includes(c.id))
          .sort((a, b) => collator.compare(a.name, b.name)),
      }))
      .filter((g) => g.tools.length);
    const rowHeights = [];
    activeGroups.forEach((g, i) => {
      g.height =
        90 + Math.min(g.tools.length, 3) * 44 + (g.tools.length > 3 ? 36 : 0);
      const row = Math.floor(i / columns);
      rowHeights[row] = Math.max(rowHeights[row] || 0, g.height);
    });
    groups = activeGroups.map((g, i) => ({
      ...g,
      x: padding + (i % columns) * (width + gap),
      y:
        padding +
        rowHeights
          .slice(0, Math.floor(i / columns))
          .reduce((sum, h) => sum + h + gap, 0),
      width,
    }));
    const usedColumns = Math.min(columns, groups.length) || 1;
    world = {
      width: padding * 2 + usedColumns * width + (usedColumns - 1) * gap,
      height:
        padding * 2 +
        rowHeights.reduce((sum, h) => sum + h, 0) +
        Math.max(0, rowHeights.length - 1) * gap,
    };
    const scene = $("#map-scene");
    scene.style.width = world.width + "px";
    scene.style.height = world.height + "px";
    $("#map-clusters").innerHTML = groups
      .map(
        (g) =>
          `<section class="map-cluster" aria-label="${escape(g.category.name)}" style="left:${g.x}px;top:${g.y}px;--category-color:${g.category.color}"><div class="cluster-header"><span class="cluster-symbol">${icon(g.category.icon)}</span><button class="cluster-title" data-category="${escape(g.category.id)}" title="Filter by ${escape(g.category.name)}"><strong>${escape(g.category.name)}</strong><span>${escape(g.category.shortLabel || "REST API TESTING")}</span></button><span class="cluster-number">${String(g.tools.length).padStart(2, "0")}</span></div>${g.tools
            .slice(0, 3)
            .map(
              (t) =>
                `<div class="map-tool" data-map-tool="${escape(t.id)}"><button class="tool-open" data-tool="${escape(t.id)}" title="${escape(t.description)}">${avatar(t)}<span class="tool-name">${escape(t.name)}</span></button>${savedButton(t)}</div>`,
            )
            .join(
              "",
            )}${g.tools.length > 3 ? `<button class="cluster-more" data-category-list="${escape(g.category.id)}">View all ${g.tools.length} tools ${icon("arrow-right")}</button>` : ""}</section>`,
      )
      .join("");
    const edges = [];
    groups.forEach((a, i) =>
      groups.slice(i + 1).forEach((b) => {
        const shared = a.tools.filter((t) =>
          b.tools.some((o) => o.id === t.id),
        );
        if (!shared.length) return;
        let ax = a.x + a.width / 2,
          ay = a.y + a.height / 2,
          bx = b.x + b.width / 2,
          by = b.y + b.height / 2;
        if (Math.abs(ax - bx) > 100) {
          ax = a.x + (ax < bx ? a.width : 0);
          bx = b.x + (ax < bx ? 0 : b.width);
        } else {
          ay = a.y + (ay < by ? a.height : 0);
          by = b.y + (ay < by ? 0 : b.height);
        }
        const mid = (ax + bx) / 2;
        edges.push(
          `<path d="M ${ax} ${ay} C ${mid} ${ay}, ${mid} ${by}, ${bx} ${by}" data-shared="${escape(shared.map((t) => t.id).join(" "))}"/>`,
        );
      }),
    );
    const svg = $("#map-connections");
    svg.setAttribute("width", world.width);
    svg.setAttribute("height", world.height);
    svg.innerHTML = edges.join("");
    svg.style.display = showConnections ? "" : "none";
    applyCamera();
  }
  function applyCamera() {
    cancelAnimationFrame(drawFrame);
    drawFrame = requestAnimationFrame(() => {
      $("#map-scene").style.transform =
        `translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`;
      viewport.style.backgroundSize = `${19 * camera.scale}px ${19 * camera.scale}px`;
      viewport.style.backgroundPosition = `${camera.x}px ${camera.y}px`;
      $("#zoom-level").textContent = `${Math.round(camera.scale * 100)}%`;
    });
  }
  function fitMap(initial = false) {
    const rect = viewport.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const fit = Math.min(
      (rect.width - 18) / world.width,
      (rect.height - 18) / world.height,
      1.35,
    );
    camera.scale = Math.max(
      minMapScale,
      initial && rect.width < 600 ? Math.max(0.9, fit) : fit,
    );
    camera.x =
      initial && rect.width < 600
        ? 10
        : Math.max(10, (rect.width - world.width * camera.scale) / 2);
    camera.y =
      initial && rect.width < 600
        ? 10
        : Math.max(10, (rect.height - world.height * camera.scale) / 2);
    applyCamera();
  }
  function zoomMap(
    factor,
    cx = viewport.clientWidth / 2,
    cy = viewport.clientHeight / 2,
  ) {
    const next = Math.max(minMapScale, Math.min(2.4, camera.scale * factor));
    const ratio = next / camera.scale;
    camera.x = cx - (cx - camera.x) * ratio;
    camera.y = cy - (cy - camera.y) * ratio;
    camera.scale = next;
    applyCamera();
  }
  function setNavigation(open) {
    $("#sidebar").inert = matchMedia("(max-width:760px)").matches && !open;
    $("#main").inert = open;
    $(".topbar").inert = open;
    $("#sidebar").classList.toggle("is-open", open);
    $("#sidebar-backdrop").hidden = !open;
    $("#mobile-menu").setAttribute("aria-expanded", open);
    if (open) {
      $("#sidebar").setAttribute("role", "dialog");
      $("#sidebar").setAttribute("aria-modal", "true");
      $('[data-action="close-nav"]').focus();
    } else {
      $("#sidebar").removeAttribute("role");
      $("#sidebar").removeAttribute("aria-modal");
    }
  }
  function updateCompareUI() {
    selected = selected.filter((id) => byId.has(id)).slice(0, compareLimit);
    $("#compare-tray").hidden = !selected.length;
    document.body.classList.toggle("has-compare", !!selected.length);
    $("#compare-count").textContent = `${selected.length}/${compareLimit}`;
    $("#open-compare").disabled = selected.length < 2;
    $("#compare-pills").innerHTML = selected
      .map(
        (id) =>
          `<button class="compare-pill" data-remove-compare="${escape(id)}" aria-label="Remove ${escape(byId.get(id).name)} from comparison">${escape(byId.get(id).name)}${icon("close")}</button>`,
      )
      .join("");
    $$("input[data-compare]").forEach((el) => {
      el.checked = selected.includes(el.dataset.compare);
    });
    updateDetailButtons();
  }
  function toggleCompare(id, remove = false) {
    if (!byId.has(id)) return;
    const exists = selected.includes(id);
    if (exists || remove) selected = selected.filter((other) => other !== id);
    else if (selected.length < compareLimit) selected.push(id);
    else
      notify(`Compare up to ${compareLimit} tools. Remove one to add another.`);
    updateCompareUI();
    writeURL();
    if ($("#compare-dialog").open) {
      if (selected.length < 2) $("#compare-dialog").close();
      else renderComparison();
    }
  }
  function openDialog(id) {
    $$("dialog[open]").forEach((dialog) => {
      if (dialog.id !== id) dialog.close();
    });
    const dialog = $("#" + id);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("modal-open");
  }
  function updateDetailButtons() {
    const tool = byId.get(state.tool);
    if (!tool) return;
    const compareButton = $("button[data-compare]", $("#detail-content"));
    if (compareButton) {
      const active = selected.includes(tool.id);
      compareButton.setAttribute("aria-pressed", active);
      compareButton.innerHTML =
        icon("columns") +
        (active ? " Remove from comparison" : " Add to comparison");
    }
    $$("[data-save]", $("#detail-content")).forEach((button) => {
      const active = saved.has(tool.id);
      button.classList.toggle("is-saved", active);
      button.setAttribute("aria-pressed", active);
      button.setAttribute(
        "aria-label",
        `${active ? "Unsave" : "Save"} ${tool.name}`,
      );
      if (button.classList.contains("detail-save"))
        button.innerHTML =
          icon("bookmark") + (active ? " Saved" : " Save tool");
    });
  }
  function openTool(id) {
    const tool = byId.get(id);
    if (!tool) return;
    state.tool = id;
    writeURL();
    const website = safeURL(tool.website),
      repo = safeURL(tool.repository),
      docs = safeURL(tool.documentation);
    const date = new Date(tool.lastVerified + "T12:00:00Z").toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
    );
    const issueURL =
      safeURL(data.project.repository) +
      `/issues/new?title=${encodeURIComponent("Update tool: " + tool.name)}&body=${encodeURIComponent("Tool: " + tool.name + " (" + tool.id + ")\n\nSuggested correction:\n\nOfficial source:\n")}`;
    $("#detail-content").innerHTML =
      `<div class="detail-topbar"><span>TOOL OVERVIEW</span><div><button class="icon-button" data-action="share" aria-label="Copy a link to ${escape(tool.name)}">${icon("link")}</button><button class="icon-button" data-close="detail-dialog" aria-label="Close tool details">${icon("close")}</button></div></div><div class="detail-body"><div class="detail-heading">${avatar(tool, true)}<div><h2 id="detail-title">${escape(tool.name)}</h2><span class="license-badge">${icon("file")}${escape(label("licenseModel", tool.licenseModel))}</span></div></div><p class="detail-description">${escape(tool.description)}</p><div class="detail-categories">${tool.categories.map(categoryTag).join("")}</div><div class="detail-links"><a class="button button-primary" href="${escape(website)}" target="_blank" rel="noopener noreferrer">Visit website ${icon("arrow-up-right")}</a>${repo ? `<a class="button" href="${escape(repo)}" target="_blank" rel="noopener noreferrer">${icon("github")} Source code</a>` : ""}${!repo && docs ? `<a class="button" href="${escape(docs)}" target="_blank" rel="noopener noreferrer">Documentation ${icon("arrow-up-right")}</a>` : ""}</div><dl class="detail-facts"><div><dt>PRICING MODEL</dt><dd>${escape(label("pricing", tool.pricing))}</dd></div><div><dt>EXECUTION</dt><dd>${escape(joined("execution", tool.execution))}</dd></div><div><dt>INTERFACES</dt><dd>${escape(joined("interfaces", tool.interfaces))}</dd></div><div><dt>TEST CREATION</dt><dd>${escape(joined("testCreation", tool.testCreation))}</dd></div><div><dt>CI/CD SUPPORT</dt><dd>${tool.ci === true ? "Supported" : tool.ci === false ? "Not supported" : "Unknown"}</dd></div><div><dt>LICENSE</dt><dd>${escape(tool.license || "Unknown")}</dd></div></dl>${tool.features?.length ? `<section class="detail-section"><h3>What it brings to your workflow</h3><ul class="feature-list">${tool.features.map((feature) => `<li>${icon("check")}<span>${escape(feature)}</span></li>`).join("")}</ul></section>` : ""}${tool.notes ? `<section class="detail-section"><h3>Good to know</h3><p>${escape(tool.notes)}</p></section>` : ""}<section class="detail-section"><h3>Sources & verification</h3><ul class="source-list">${tool.sources
        .filter((s) => safeURL(s))
        .map(
          (source, i) =>
            `<li><a href="${escape(safeURL(source))}" target="_blank" rel="noopener noreferrer">${escape(new URL(source).hostname.replace(/^www\./, ""))}${tool.sources.filter((s) => safeURL(s)).length > 1 ? ` · source ${i + 1}` : ""} ${icon("arrow-up-right")}</a></li>`,
        )
        .join(
          "",
        )}</ul><div class="verified-note">${icon("check-circle")} Last verified ${escape(date)} · ${escape(label("status", tool.status))}</div></section></div><div class="detail-bottom"><button class="button detail-save" data-save="${escape(id)}"></button><button class="button" data-compare="${escape(id)}"></button><a class="text-button" href="${escape(issueURL)}" target="_blank" rel="noopener noreferrer">Suggest a correction ${icon("arrow-up-right")}</a></div>`;
    updateDetailButtons();
    openDialog("detail-dialog");
  }
  function renderComparison() {
    const list = selected.map((id) => byId.get(id));
    const row = (name, fn) =>
      `<tr><th scope="row">${name}</th>${list.map((tool) => `<td>${fn(tool)}</td>`).join("")}</tr>`;
    $("#comparison-content").innerHTML =
      `<table class="comparison-table"><thead><tr><th scope="col"><span class="sr-only">Capability</span></th>${list.map((tool) => `<th scope="col"><div class="comparison-tool">${avatar(tool)}<strong>${escape(tool.name)}</strong><span class="comparison-description">${escape(tool.description)}</span><button class="text-button" data-remove-compare="${escape(tool.id)}">Remove ${icon("close")}</button></div></th>`).join("")}</tr></thead><tbody>${row("Categories", (t) => t.categories.map(categoryTag).join(""))}${row("License model", (t) => escape(label("licenseModel", t.licenseModel)))}${row("License", (t) => escape(t.license || "Unknown"))}${row("Pricing", (t) => escape(label("pricing", t.pricing)))}${row("Execution", (t) => escape(joined("execution", t.execution)))}${row("Interfaces", (t) => escape(joined("interfaces", t.interfaces)))}${row("Test creation", (t) => escape(joined("testCreation", t.testCreation)))}${row("CI/CD", (t) => (t.ci === true ? "Supported" : t.ci === false ? "Not supported" : "Unknown"))}${row("Capabilities", (t) => (t.features?.length ? `<ul class="feature-list">${t.features.map((f) => `<li>${escape(f)}</li>`).join("")}</ul>` : "Unknown"))}${row("Good to know", (t) => escape(t.notes || "No additional notes."))}${row("Verified", (t) => escape(t.lastVerified))}${row("Explore", (t) => `<a class="button" href="${escape(safeURL(t.website))}" target="_blank" rel="noopener noreferrer">Website ${icon("arrow-up-right")}</a>`)}</tbody></table>`;
  }
  async function copyText(value, message) {
    let success = false;
    try {
      await navigator.clipboard.writeText(value);
      success = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      const parent = $("dialog[open]") || document.body;
      parent.append(area);
      area.select();
      try {
        success = document.execCommand("copy");
      } catch {
        /* The browser may block copying. */
      }
      area.remove();
    }
    notify(
      success
        ? message
        : "Copying is blocked by your browser. Select and copy the text manually.",
    );
  }
  function resetFilters() {
    Object.assign(state, {
      q: "",
      category: "",
      license: "",
      execution: "",
      pricing: "",
      creation: "",
      ci: false,
    });
    render({ fit: true });
  }
  function initializeEvents() {
    setNavigation(false);
    matchMedia("(max-width:760px)").addEventListener("change", () =>
      setNavigation(false),
    );
    document.addEventListener("change", (event) => {
      if (event.target.matches("input[data-compare]"))
        toggleCompare(event.target.dataset.compare);
    });
    document.addEventListener("click", (event) => {
      const target = event.target.closest("button,a");
      if (!target) return;
      if (viewport.contains(target) && performance.now() < blockClickUntil) {
        event.preventDefault();
        return;
      }
      if (target.dataset.categoryList) {
        state.category = target.dataset.categoryList;
        state.view = "list";
        render();
        return;
      }
      if (target.dataset.tool) {
        openTool(target.dataset.tool);
        return;
      }
      if (target.dataset.save) {
        saveTool(target.dataset.save);
        return;
      }
      if (target.matches("button[data-compare]")) {
        toggleCompare(target.dataset.compare);
        return;
      }
      if (target.dataset.removeCompare) {
        toggleCompare(target.dataset.removeCompare, true);
        return;
      }
      if (target.hasAttribute("data-category")) {
        state.category =
          state.category === target.dataset.category
            ? ""
            : target.dataset.category;
        setNavigation(false);
        render({ fit: true });
        return;
      }
      if (target.dataset.view) {
        state.view = target.dataset.view;
        render({ fit: true });
        return;
      }
      if (target.dataset.workspace) {
        const name = target.dataset.workspace;
        state.saved = name === "saved";
        state.view = name === "map" ? "map" : "list";
        setNavigation(false);
        render({ fit: true });
        return;
      }
      if (target.dataset.removeFilter) {
        const key = target.dataset.removeFilter;
        state[key] = ["ci", "saved"].includes(key) ? false : "";
        render({ fit: true });
        return;
      }
      if (target.dataset.close) {
        $("#" + target.dataset.close).close();
        return;
      }
      switch (target.dataset.action) {
        case "about":
          openDialog("about-dialog");
          break;
        case "contribute":
          openDialog("contribute-dialog");
          setNavigation(false);
          break;
        case "close-nav":
          setNavigation(false);
          $("#mobile-menu").focus();
          break;
        case "reset":
          resetFilters();
          break;
        case "explore":
          state.saved = false;
          resetFilters();
          break;
        case "share":
          writeURL();
          copyText(
            location.href,
            "Link copied. Filters and comparison are included.",
          );
          break;
        case "reload":
          location.reload();
          break;
      }
    });
    $("#search").addEventListener("input", (event) => {
      state.q = event.target.value.trim().slice(0, 200);
      render({ fit: true });
    });
    for (const key of ["license", "execution", "pricing", "creation"])
      $(`#${key}-filter`).addEventListener("change", (event) => {
        state[key] = event.target.value;
        render({ fit: true });
      });
    $("#ci-filter").addEventListener("change", (event) => {
      state.ci = event.target.checked;
      render({ fit: true });
    });
    $("#sort").addEventListener("change", (event) => {
      state.sort = event.target.value;
      render();
    });
    $("#mobile-menu").addEventListener("click", () =>
      setNavigation(!$("#sidebar").classList.contains("is-open")),
    );
    $("#sidebar-backdrop").addEventListener("click", () => {
      setNavigation(false);
      $("#mobile-menu").focus();
    });
    $("#clear-compare").addEventListener("click", () => {
      selected = [];
      updateCompareUI();
      writeURL();
    });
    $("#open-compare").addEventListener("click", () => {
      if (selected.length < 2) return;
      renderComparison();
      openDialog("compare-dialog");
    });
    $("#connection-toggle").addEventListener("click", () => {
      showConnections = !showConnections;
      $("#connection-toggle").classList.toggle("is-on", showConnections);
      $("#connection-toggle").setAttribute("aria-pressed", showConnections);
      $("#map-connections").style.display = showConnections ? "" : "none";
    });
    $("#zoom-in").addEventListener("click", () => zoomMap(1.2));
    $("#zoom-out").addEventListener("click", () => zoomMap(1 / 1.2));
    $("#zoom-fit").addEventListener("click", () => fitMap());
    $("#copy-template").addEventListener("click", () =>
      copyText($("#tool-template").textContent, "Starter JSON copied."),
    );
    $$("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          const r = dialog.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            dialog.close();
        }
      });
      dialog.addEventListener("close", () => {
        if (dialog.id === "detail-dialog" && !$("#detail-dialog").open) {
          state.tool = "";
          writeURL();
        }
        document.body.classList.toggle("modal-open", !!$("dialog[open]"));
      });
    });
    document.addEventListener("keydown", (event) => {
      const typing = event.target.matches(
        'input,textarea,select,[contenteditable="true"]',
      );
      if (event.key === "/" && !typing && !$("dialog[open]")) {
        event.preventDefault();
        $("#search").focus();
      }
      if (
        event.key === "Escape" &&
        $("#sidebar").classList.contains("is-open")
      ) {
        setNavigation(false);
        $("#mobile-menu").focus();
      }
      if (event.key === "Tab" && $("#sidebar").classList.contains("is-open")) {
        const focusable = $$("button,a[href]", $("#sidebar"));
        const first = focusable[0],
          last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    viewport.addEventListener("keydown", (event) => {
      if (event.target !== viewport) return;
      if (
        [
          "+",
          "=",
          "-",
          "0",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(event.key)
      )
        event.preventDefault();
      if (event.key === "+" || event.key === "=") zoomMap(1.2);
      if (event.key === "-") zoomMap(1 / 1.2);
      if (event.key === "0") fitMap();
      if (event.key === "ArrowUp") camera.y += 50;
      if (event.key === "ArrowDown") camera.y -= 50;
      if (event.key === "ArrowLeft") camera.x += 50;
      if (event.key === "ArrowRight") camera.x -= 50;
      applyCamera();
    });
    viewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1)
        gesture = {
          startX: event.clientX,
          startY: event.clientY,
          x: camera.x,
          y: camera.y,
          moved: false,
        };
      else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        gesture = {
          pinch: true,
          distance: Math.hypot(a.x - b.x, a.y - b.y),
          midX: (a.x + b.x) / 2,
          midY: (a.y + b.y) / 2,
        };
      }
      // Capture touch for reliable panning, but leave mouse buttons clickable until a drag begins.
      if (event.pointerType === "touch")
        viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener("pointermove", (event) => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2 && gesture.pinch) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const midX = (a.x + b.x) / 2,
          midY = (a.y + b.y) / 2;
        const r = viewport.getBoundingClientRect();
        if (gesture.distance > 0)
          zoomMap(
            distance / gesture.distance,
            gesture.midX - r.left,
            gesture.midY - r.top,
          );
        camera.x += midX - gesture.midX;
        camera.y += midY - gesture.midY;
        gesture = { pinch: true, distance, midX, midY };
        blockClickUntil = performance.now() + 400;
        applyCamera();
      } else if (pointers.size === 1 && !gesture.pinch) {
        const dx = event.clientX - gesture.startX,
          dy = event.clientY - gesture.startY;
        if (Math.hypot(dx, dy) > 5 || gesture.moved) {
          gesture.moved = true;
          camera.x = gesture.x + dx;
          camera.y = gesture.y + dy;
          viewport.classList.add("is-dragging");
          blockClickUntil = performance.now() + 400;
          viewport.setPointerCapture(event.pointerId);
          applyCamera();
        }
      }
    });
    const endPointer = (event) => {
      const moved = gesture?.moved || gesture?.pinch;
      // A touch tap captured by the canvas must still open its underlying button.
      if (
        event.type === "pointerup" &&
        event.pointerType === "touch" &&
        !moved
      ) {
        const target = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest(
            "button[data-tool],button[data-save],button[data-category],button[data-category-list]",
          );
        if (target) {
          target.click();
          blockClickUntil = performance.now() + 400;
        }
      }
      pointers.delete(event.pointerId);
      viewport.classList.remove("is-dragging");
      if (pointers.size === 1) {
        const a = [...pointers.values()][0];
        gesture = {
          startX: a.x,
          startY: a.y,
          x: camera.x,
          y: camera.y,
          moved: true,
        };
      } else gesture = null;
    };
    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);
    window.addEventListener("pointerup", (event) => {
      if (pointers.has(event.pointerId)) endPointer(event);
    });
    viewport.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          const r = viewport.getBoundingClientRect();
          zoomMap(
            Math.exp(-event.deltaY * 0.006),
            event.clientX - r.left,
            event.clientY - r.top,
          );
        } else if (event.shiftKey) {
          event.preventDefault();
          camera.x -= event.deltaY;
          applyCamera();
        }
        // Normal scrolling stays native so the map never traps the page.
      },
      { passive: false },
    );
    viewport.addEventListener("pointerover", (event) => {
      const row = event.target.closest("[data-map-tool]");
      if (!row) return;
      $$("[data-map-tool]").forEach((el) =>
        el.classList.toggle(
          "related",
          el.dataset.mapTool === row.dataset.mapTool,
        ),
      );
      $$("[data-shared]").forEach((el) =>
        el.classList.toggle(
          "highlight",
          el.dataset.shared.split(" ").includes(row.dataset.mapTool),
        ),
      );
    });
    viewport.addEventListener("pointerleave", () => {
      $$(".related").forEach((el) => el.classList.remove("related"));
      $$(".highlight").forEach((el) => el.classList.remove("highlight"));
    });
    let resizeTimer;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!data || $("#map-view").hidden) return;
        const mobile = matchMedia("(max-width:760px)").matches;
        if (mobile !== lastMobile) {
          lastMobile = mobile;
          renderMap(sorted(tools.filter((t) => matches(t))));
        }
        fitMap(mobile);
      }, 100);
    }).observe(viewport);
    window.addEventListener("popstate", () => {
      readURL();
      render({ fit: true });
      if (state.tool) openTool(state.tool);
      else $("#detail-dialog").close();
    });
    window.addEventListener("storage", (event) => {
      if (event.key === "rest-atlas.saved.v1") {
        saved = readSaved();
        render({ fit: state.saved });
        updateDetailButtons();
      }
    });
  }
  async function init() {
    hydrateIcons(document);
    try {
      const response = await fetch(new URL("./tools.json", document.baseURI));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
      if (
        data.schemaVersion !== 1 ||
        !Array.isArray(data.tools) ||
        !Array.isArray(data.categories) ||
        !data.categories.length
      )
        throw new Error("Unsupported catalogue format.");
      categories = data.categories.map((c) => ({
        ...c,
        color: /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : "#65835c",
        icon: Object.hasOwn(paths, c.icon) ? c.icon : "layers",
      }));
      categoryById = new Map(categories.map((c) => [c.id, c]));
      tools = data.tools;
      const seen = new Set();
      for (const tool of tools) {
        if (
          !tool.id ||
          seen.has(tool.id) ||
          !tool.name ||
          !tool.description ||
          !safeURL(tool.website) ||
          !Array.isArray(tool.categories) ||
          !tool.categories.length ||
          tool.categories.some((id) => !categoryById.has(id)) ||
          !Array.isArray(tool.sources) ||
          !tool.sources.length ||
          !/^\d{4}-\d{2}-\d{2}$/.test(tool.lastVerified)
        )
          throw new Error(
            "Invalid catalogue entry. Run node validate-tools.mjs.",
          );
        seen.add(tool.id);
      }
      byId = new Map(tools.map((t) => [t.id, t]));
      saved = readSaved();
      readURL();
      $("#total-stat").textContent = tools.length;
      $("#categories-stat").textContent = categories.length;
      $("#category-count").textContent = categories.length;
      const repo =
        safeURL(data.project?.repository) ||
        "https://github.com/Rentgen-io/rest-atlas";
      const branch = encodeURIComponent(data.project?.branch || "main");
      $$(".source-link").forEach((a) => (a.href = repo));
      $("#edit-data-link").href = `${repo}/edit/${branch}/tools.json`;
      $("#field-guide-link").href = `${repo}/blob/${branch}/CONTRIBUTING.md`;
      $("#tool-template").textContent = JSON.stringify(
        {
          id: "my-tool",
          name: "My Tool",
          description:
            "A short, factual description of its REST testing capabilities.",
          website: "https://example.com",
          categories: [categories[0].id],
          sources: ["https://example.com/docs"],
          lastVerified: new Date().toISOString().slice(0, 10),
        },
        null,
        2,
      );
      initializeEvents();
      render({ fit: true });
      if (state.tool) openTool(state.tool);
    } catch (error) {
      $("#map-view").hidden = true;
      $("#list-view").hidden = true;
      $("#map-note").hidden = true;
      $("#result-count").textContent = "Catalogue unavailable";
      $("#load-error").hidden = false;
      $("#load-error-message").textContent =
        location.protocol === "file:"
          ? "Open this project through a local HTTP server or GitHub Pages. Browsers block tools.json when index.html is opened directly from disk."
          : "Check that tools.json is present, contains valid JSON, and is served from the same folder as index.html.";
      // Bind retry even if loading failed before normal event initialization.
      $('[data-action="reload"]').onclick = () => location.reload();
      console.error("REST Atlas:", error.message);
    }
  }
  init();
})();
