# REST Atlas

**A map, not a leaderboard.** An interactive, community-maintained guide to the REST API testing ecosystem.

Explore tools by capability, compare them side by side, and build a personal shortlist. Everything runs in the browser. No framework, build process, backend, analytics, or third-party runtime dependencies.

## What’s inside

- **Interactive landscape** — category regions, shared-capability connections, drag/pan, pinch zoom, zoom controls, keyboard navigation, and fit-to-screen.
- **Directory** — searchable, sortable tool table; mobile cards at narrow widths.
- **Filters** — category, license model, execution, pricing, test creation, and CI/CD support.
- **Tool details** — capabilities, licensing, sources, verification date, and correction links.
- **Saved tools** — a browser-local shortlist, retained across visits when local storage is available.
- **Compare** — up to three tools, including unknown values rather than assumed capabilities.
- **Shareable views** — searches, filters, selected detail, and comparison selections encoded in the URL.
- **Easy contribution** — add one JSON object to `tools.json`; the UI needs no code changes.

The starter catalogue contains 12 tools in eight categories. It is deliberately small and is not an exhaustive market survey. Map regions preview three tools alphabetically; the directory contains every matching tool. No placement or order implies a ranking.

## Files — all in the root

| File | Purpose |
| --- | --- |
| `index.html` | Application shell, dialogs, semantic navigation. |
| `styles.css` | Responsive desktop/mobile layout and visual design. |
| `app.js` | Rendering, search, filters, map interactions, details, saved tools, comparison. |
| `tools.json` | Single source for all tools, category definitions, and contribution settings. |
| `tools.schema.json` | Data contract and editor hints. |
| `validate-tools.mjs` | Dependency-free data validation for contributors. |
| `favicon.svg` | Local vector app icon. |
| `.nojekyll` | Tell GitHub Pages to serve the project as static files. |
| `CONTRIBUTING.md` | Field reference, formats, enums, and PR instructions. |
| `LICENSE` | MIT license for this project. Listed tools retain their own licenses. |

## Run locally

Serve the root with any static HTTP server, for example:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Opening `index.html` directly with a `file://` URL will not load JSON because of browser security rules.

Node.js is only needed for the optional validator:

```sh
node validate-tools.mjs
```

No `npm install` is needed.

## Publish on GitHub Pages

After merging the project files into `main`:

1. Open repository **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then save.
4. Wait for GitHub Pages to finish deployment.

For `Rentgen-io/rest-atlas`, the configured project URL is `https://rentgen-io.github.io/rest-atlas/`. This is the expected deployment address, not a claim that deployment is already complete. All application assets and the dataset use relative paths, so project-subdirectory hosting works without a build.

No custom domain is needed. No GitHub Actions deployment workflow is required for this branch-based setup.

## Add or update a tool

Read [CONTRIBUTING.md](./CONTRIBUTING.md), add an object to the `tools` array in [tools.json](./tools.json), and open a PR. The application’s **Add a tool** dialog includes a minimal copyable entry and a direct edit link.

Optional fields are not required to get started. Unknown is an explicit state, not a failed capability check. Category definitions are also data-driven.

## Keyboard and touch

| Action | Control |
| --- | --- |
| Focus search | `/` outside a text field or dialog |
| Navigate controls | `Tab` / `Shift+Tab` |
| Close a dialog or mobile drawer | `Escape` |
| Pan the map | Drag; or arrow keys when the canvas is focused |
| Zoom the map | `+` / `-` when the canvas is focused; zoom buttons; pinch; Ctrl/Cmd + scroll |
| Fit the map | Fit button; or `0` when the canvas is focused |
| Scroll the page | Normal wheel or touch outside the map; normal wheel also works over the map |

The mobile map starts at a readable zoom. Pan to explore or use Fit for an overview. The directory is an alternative for browsing every tool without navigating the canvas. Native dialogs trap focus; motion is reduced when requested by the OS.

## Data and privacy

`tools.json` is fetched once from the same site. Searching, filtering, and comparing are entirely client-side. Saved tool IDs are stored under `rest-atlas.saved.v1` in local storage. They are not uploaded. If local storage is blocked, saving works only for the current visit. Sharing a link shares filters and comparison IDs, not the contents of a personal saved collection.

The app uses local CSS, JavaScript, SVG icons, and system fonts. It makes no requests for external fonts, logo services, analytics, or tracking. Outbound links open the relevant third-party website.

## Governance and disclosure

Maintained by the Rentgen.io team as a community research project. Rentgen is included under the same criteria as other tools. Entries link to primary sources and verification dates. Listing is not certification, endorsement, or a guarantee of capabilities. Features and pricing can vary by edition.

Code is MIT licensed; see [LICENSE](./LICENSE).
