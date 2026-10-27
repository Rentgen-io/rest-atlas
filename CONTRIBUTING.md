# Contributing to REST Atlas

**Add a tool by editing one file: [`tools.json`](./tools.json).** The map, directory, tool details, search, filters, and comparisons read from that same file. You do not need to change HTML, CSS, or JavaScript.

## Scope

Include tools that help people test **REST APIs**: request clients, functional automation, test generation/fuzzing, contracts/schemas, security, performance, mocking, or API monitoring. Multi-protocol tools are welcome; describe their REST capabilities here. Pure WebSocket, GraphQL, or gRPC tools are outside this catalogue.

Use short, factual descriptions. Avoid rankings, superlatives, affiliate links, tracking parameters, unsupported claims, and invented features. Free tools, commercial tools, and source-available projects are all welcome. A free plan is not an open-source license. A pricing page does not prove revenue.

## Add a tool in five steps

1. Open [`tools.json` on GitHub](https://github.com/Rentgen-io/rest-atlas/edit/main/tools.json). GitHub can create a fork for you.
2. Add **one object inside the existing `tools` array**. Keep the tools alphabetized by name. Do not replace the entire file with your entry.
3. Use existing category IDs. Provide at least one official source and the date you actually checked it.
4. Validate the file if possible: `node validate-tools.mjs`. Node.js 20 or newer is sufficient; there is nothing to install.
5. Open a PR. Explain the tool’s REST testing use case and disclose whether you are its creator, employee, or affiliate.

For updates, edit the existing object and keep its `id`. That ID is used in saved collections and shared links.

### Minimum entry

```json
{
  "id": "example-tool",
  "name": "Example Tool",
  "description": "A factual description of how the tool helps test REST APIs.",
  "website": "https://example.com",
  "categories": ["functional"],
  "sources": ["https://example.com/docs"],
  "lastVerified": "2026-10-27"
}
```

Replace the example values and date. Add a comma between neighboring objects. JSON requires double quotes and does **not** allow comments or trailing commas.

### Full entry

```json
{
  "id": "example-tool",
  "name": "Example Tool",
  "description": "A local REST API test runner with scripted assertions and reusable request collections.",
  "website": "https://example.com",
  "repository": "https://github.com/example/example-tool",
  "documentation": "https://example.com/docs",
  "categories": ["clients", "functional"],
  "licenseModel": "open-source",
  "license": "Apache-2.0",
  "pricing": "free",
  "interfaces": ["desktop", "cli"],
  "execution": ["local"],
  "testCreation": ["manual", "scripted"],
  "ci": true,
  "features": ["Reusable request collections", "Response assertions", "CLI test execution"],
  "tags": ["JavaScript", "regression"],
  "notes": "Some capabilities require additional configuration.",
  "status": "active",
  "sources": ["https://example.com/docs", "https://github.com/example/example-tool/blob/main/LICENSE"],
  "lastVerified": "2026-10-27"
}
```

## Tool fields

Names and values are case-sensitive. Unknown fields are rejected to catch typos. All text is plain text; HTML and Markdown are not rendered inside tool descriptions.

| Field | Required | Type and format | What to provide |
| --- | --- | --- | --- |
| `id` | Yes | Unique slug, 1–60 characters; `^[a-z0-9]+(?:-[a-z0-9]+)*$` | Stable lowercase identifier, e.g. `rest-assured`. No spaces or underscores. |
| `name` | Yes | String, 1–60 characters | Product’s public name. Names must be unique, ignoring case. |
| `description` | Yes | String, 20–300 characters | One or two factual sentences focused on REST testing. Searchable. |
| `website` | Yes | Absolute HTTP(S) URL | Official product website. Use its public repository if that is its main homepage. |
| `categories` | Yes | Nonempty array of category IDs | One or more categories from the table below. No duplicates. |
| `sources` | Yes | Array of 1–8 absolute HTTP(S) URLs | Official documentation, product pages, repository, license, or pricing evidence. No duplicates. |
| `lastVerified` | Yes | Real date, `YYYY-MM-DD` | Date a human checked the entry. Future dates are rejected. This is not the tool’s release date. |
| `repository` | No | Absolute HTTP(S) URL | Public source repository. Omit if unavailable. |
| `documentation` | No | Absolute HTTP(S) URL | Official docs. Used as a secondary detail link when there is no repository. |
| `licenseModel` | No | Enum below | License model of the listed tool/core. Defaults to `unknown`. |
| `license` | No | String, 1–120 characters | Exact license, preferably SPDX notation. Qualify the edition where appropriate: `MIT (open-source core)`. |
| `pricing` | No | Enum below | Access/pricing model. Defaults to `unknown`. Do not infer revenue. |
| `interfaces` | No | Nonempty array of enums below | How users interact with the tool. |
| `execution` | No | Nonempty array of enums below | Where tests/checks execute, not where a collection is stored. |
| `testCreation` | No | Nonempty array of enums below | How test cases or inputs are created. |
| `ci` | No | `true`, `false`, or `null` | `true` if a documented runner/library/CLI supports unattended CI execution. Omitted or `null` means unverified. |
| `features` | No | Array, up to 10 unique strings; 3–160 characters each | Concrete REST-related capabilities, shown in details and comparisons. |
| `tags` | No | Array, up to 15 unique strings; 1–40 characters each | Additional search terms, e.g. language or workflow. |
| `notes` | No | String, up to 700 characters | Edition restrictions, setup requirements, limitations, or relevant context. |
| `status` | No | `active`, `maintenance`, `archived`, `unknown` | Project maintenance state. Defaults to `unknown`. |

URLs must not contain embedded usernames, passwords, API keys, or other secrets. Use HTTPS when available. Optional URL fields should be omitted rather than set to an empty string or `null`.

## Categories

| ID | Category | Typical use |
| --- | --- | --- |
| `clients` | API clients | Compose requests, inspect responses, explore endpoints. |
| `functional` | Functional testing | Assert REST behavior, orchestrate scenarios, run regression tests. |
| `generation` | Test generation | Generate inputs/test cases; mutation, property-based testing, fuzzing. |
| `contract` | Contract & schema | Verify consumer/provider agreements or OpenAPI conformance. |
| `security` | Security testing | Assess API security controls, authentication behavior, or vulnerabilities. |
| `performance` | Performance | Measure response behavior, throughput, or controlled load. Describe whether this is basic insight or load testing. |
| `mocking` | Mocking | Simulate HTTP dependencies, record/replay, service virtualization. |
| `monitoring` | Monitoring | Scheduled REST checks, synthetic monitoring, failure alerting. |

A tool can have multiple categories. Category counts count matching entries; they do not add up to the unique tool total. Map regions show up to three matches alphabetically; **View all** opens the complete filtered directory. Lines mean categories share at least one matching tool, not that the tools integrate.

## Supported values

### `licenseModel`

| Value | Meaning |
| --- | --- |
| `open-source` | The listed tool/core has an open-source license. State any separate proprietary editions in `notes`. |
| `source-available` | Source can be read but its license includes restrictions inconsistent with open-source licensing. |
| `proprietary` | Proprietary software or hosted service. |
| `unknown` | Not verified. |

### `pricing`

| Value | Meaning |
| --- | --- |
| `free` | The offering covered by this entry is free. |
| `freemium` | Free offering plus paid plans/editions related to this entry. |
| `paid` | Paid offering; a limited trial does not count as a free plan. |
| `unknown` | Not verified. |

Do not record a price amount here. Prices change frequently; link the official pricing source instead. If a free core and paid service share an entry, use `freemium` and clarify the distinction in `notes`.

### `interfaces` (array)

- `desktop`: desktop application.
- `cli`: command-line runner/application.
- `web`: browser interface.
- `library`: code library or test framework.
- `ide`: editor/IDE extension.
- `unknown`: unverified.

### `execution` (array)

- `local`: tests run on a user’s machine or a CI worker the user controls.
- `cloud`: vendor-hosted remote execution.
- `self-hosted`: deployable server or agent infrastructure the user controls.
- `unknown`: unverified.

Local storage alone does not imply local execution. Use several values only when each is documented.

### `testCreation` (array)

- `manual`: users compose requests/checks through an interface.
- `scripted`: users author assertions/scenarios in code or a DSL.
- `generated`: the tool generates test cases or input variations from a request, schema, model, or other context.
- `recorded`: captures traffic/interactions to create replayable tests or stubs.
- `unknown`: unverified.

Request generation alone is not test generation. Do not combine `unknown` with known values in the same array. Use omitted optional fields or `unknown` rather than guessing. Missing information appears as **Unknown**, not **No**.

## Categories and project settings also live in tools.json

Most PRs only add or edit a tool. A justified new category can be added to the root `categories` array without changing application code:

```json
{
  "id": "new-category",
  "name": "New category",
  "description": "The REST testing task this category represents.",
  "color": "#668c68",
  "icon": "layers",
  "shortLabel": "A SHORT DESCRIPTOR"
}
```

`id`, `name`, `description`, and `color` are required. Category names allow 1–28 characters; descriptions 10–250; `color` must be a six-digit hex color. `shortLabel` is optional, up to 28 characters. `icon` is optional and supports: `terminal`, `check-circle`, `sparkles`, `file`, `shield`, `activity`, `layers`, `monitor`, `globe`, `map`, `list`, `git-branch`, `columns`. Missing icons use `layers`. Coordinate placement is automatic.

The root `project` object contains `name`, `repository` (a GitHub repository URL without a trailing slash), and `branch`. `repository` and `branch` configure the contribution links. Keep the existing identity unless intentionally forking/rebranding. `schemaVersion` must stay `1`; `$schema` points editors at `./tools.schema.json` for completion and validation.

## Validation and preview

```sh
node validate-tools.mjs
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Test the tool’s search terms, category filters, detail panel, and external links. At a narrow viewport, check the directory and navigation drawer as well. The validator catches types, formats, enums, unknown fields, invalid dates, duplicate IDs/names, unknown categories, and contradictory unknown values. It cannot verify marketing claims or whether a website is truthful.

All site files stay in the repository root. No dependencies, build step, backend, API token, or account is required to run the app. The optional validator requires Node, but visitors do not.

## Review policy

Keep one tool or focused correction per PR. Review is about scope and verifiable information, not whether a tool is commercial, a competitor, or created by the contributor. Listing is not an endorsement. Maintain a neutral description and use the same criteria for Rentgen as every other entry. Please respect maintainer time; submit facts and evidence rather than promotional copy.
