# Blue OS — Yet another enterprise operating system.

Everything an organization knows, decides and does, as versioned
YAML/Markdown files, co-edited by humans (through Obsidian) and LLMs
(through git).

This repository contains **the framework**: the logic, templates, scripts, a
complete Obsidian configuration and a sample vault. **The content** (your
real actions, decisions, journal) is not versioned here: it lives in the
installed vault, in the language of your choice and syncs with the tool of
your choice (Obsidian paid plan, iCloud, Git, Syncthing, …).

## Why

**1. The Human-AI Sync & The File-First Bet**

At its core, Blue OS tackles a specific problem: getting humans and multiple
LLM agents to collaborate fluidly on the exact same organizational state.

Our conviction is that we must run on local file access to reach the lowest
possible latency and to collaborate with LLMs. To be noted, as Anthropic's
[Boris Cherny](https://x.com/bcherny/status/2017824286489383315) put it,
“we found pretty quickly that agentic search generally works better” — it
bypasses the staleness, privacy headaches, and reliability issues of
standard RAG. Feeding agents with plain, structured files is simply a
first-class way to hand them massive, accurate context.

**2. The Data Model: Strategy Meets Distributed Systems**

To make this work, the system separates the organizational load into three
fundamental objects: **Information** (what we know), **Decision** (what we
chose), and **Action** (what we do). We didn't invent this split — it's
hardwired into strategic frameworks, from
[Herbert Simon's decision-making stages](https://en.wikipedia.org/wiki/Decision-making#Herbert_Simon's_stages)
to [John Boyd's OODA loop](https://en.wikipedia.org/wiki/OODA_loop) for
operating under uncertainty.

But we turn this theory into a functioning OS by adding a raw event stream
(**Journal**) and autonomous nodes (**People**). People is basically
applying distributed architecture principles (like
[Hewitt's Actor Model](https://en.wikipedia.org/wiki/Actor_model)) to human
and LLM management. Every object gets its own autonomous, asynchronous, and
trackable mutation regime.

**3. Pragmatic Execution**

Theory is great, but a system is only as good as its field execution.
Drawing from years of building products and scaling teams from scratch, the
OS defines the exact, minimalist structured fields actually required to
drive an action, frame a decision, or log a journal entry.

To keep objects lean, safety and traceability properties are deliberately
left out of the data model and delegated to the sync tool.

## Install

```bash
git clone https://github.com/crazybaud/blue-os && cd blue-os
./install.sh
# then, in Obsidian: "Open folder as vault" → this folder, and enable community plugins
```

Everything is bundled and the clone *is* your vault.
**[INSTALL.md](INSTALL.md)** walks you through the sync options (Obsidian
Sync, GitHub or Syncthing), the multi-machine setup, the upgrade path, and
the onboarding of a newcomer.

## Principles

**Files are the source of truth.**
Review goes through pull requests (or your sync tool's equivalent); a
protected main line is what is *enacted*. No tool layered on top may bypass
that.

**The refinery model.**
`Journal/` is the immutable raw stream; the other folders are the refined
stock. Each folder has its own mutation regime — that is the real reason
they are separate folders:

| Folder | Nature | Mutation regime |
|---|---|---|
| `Journal/` | What happened / was said | Write-once, never edited |
| `Information/` | What we know, qualified | Living, edited when the world changes |
| `Decisions/` | What is enacted | Append-only: superseded, never rewritten |
| `Actions/` | What we do | Living while open, frozen at Done/Cancelled |
| `People/` | Who acts: humans, LLMs, providers | Living directory |

**Fractal actions.**
No project/task distinction. One object, one schema; an “epic” is simply an
action with children (the `Parent` field). Views do the sorting, not types.
An action always has a parent: the tree has a single root, the company's
mission — walking up any `Parent` chain must end there.

**One grammar for humans and LLMs.**
Every word has exactly one meaning (e.g. `Journal/` is the organizational
stream; the dated thread inside an action is called `## History`).

## Conventions

### Naming

- **Files**: capitalized kebab-case slugs. Actions start with a verb
  (`Turn-off-the-legacy-wiki.md`); Journal entries with the date
  (`2026-08-22-topic.md`); People with the capitalized name (`Alice.md` —
  and never a bare first name when a last name or qualifier exists:
  `Alice-Doe.md`, `Sam-Vendorco.md`). The slug is a practical identifier,
  not a display: humans see the `Title` property everywhere (Front Matter
  Title plugin), and a title can evolve without renaming as long as the
  slug does not become misleading. The identity for any external reference
  is the `Id`, never the path (a setup decision recorded in the setup
  action's History).
- **Properties**: leading capital (`Status`, `Effort`, `Due`…).
- **Ids**: stable machine identifier (`act-0001`, `dec-0002`, `info-0003`,
  `ppl-0004`), unique across the whole repo, survives any rename.

### Links and renames

- **Links**: relative markdown links in bodies; wikilinks (`"[[…]]"`) only
  in relation properties (`Parent`, `Owner`, `Reviewers`, `Decided by`,
  `Participants`, `Journal`) — the only format Obsidian treats as a
  relation.
- **STRICT RULE — property wikilinks**: bare name, never a path.
  `"[[Alice]]"`, never `"[[../People/Alice]]"` nor `"[[People/Alice]]"`.
  Slugs being unique in the repo, the bare name always resolves. Beware:
  when re-entering a relation field in the UI, Obsidian's autocomplete
  offers the relative form (`[[../People/Bob|Bob]]`) — a consequence of the
  `newLinkFormat: relative` setting, kept because it keeps body links
  correct on GitHub. The wizards always produce the correct form, `⌘⇧B`
  repairs every pathed property link across the whole vault in one stroke,
  and CI will flag whatever remains.
- **Renames**: safe inside Obsidian (links update automatically). Outside
  Obsidian (LLM, CLI), whoever renames must update the links (grep); CI
  fails on dead links.

### Tags — three families, one registry

Tags are transversal reading keys — they cross all five objects where
`Parent` only structures actions. A tag is only allowed to exist for one of
three reasons:

1. **Project** (> 2 months): follow a program across every object it
   touches, and give it a board.
2. **Collection**: grab a homogeneous set in one gesture at any point in
   time (e.g. all call minutes).
3. **Domain**: separate the company's main territories.

A **default registry** ships with the install (`README-Org.md`) — every new
tag must join a family there before use:

| Family | Tags | Meaning |
|---|---|---|
| Domains | `Orga` | Internal: company organization, tooling, this vault, work infrastructure |
| | `Growth` | Marketing, communication, sales — everything acquisition/revenue |
| | `Operations` | Operations of the service you deliver |
| | `Product` | The digital product |
| | `Partnership` | Partnerships (institutions, key suppliers…) |
| | `Finance` | Business plan, P&L, pricing, invoicing |
| | `Legal` | Corporate, contracts, NDAs, licenses |
| Projects | `Launch` | Example: the flagship launch program |
| | `Mission` | The mission lineage (marker of the root epic) |
| Collections | `Call` | Call minutes |
| | `Founder` · `Agent` · `Partner` · `Investor` · `Advisor` · `Supplier` · `Prospect` | Actor families in People |
| | `Insight` | A structural lesson worth re-reading before it is forgotten |

Rules: same tags for all five objects (one grammar); **anti-stuffing** — one
domain, plus at most a project or a collection, rarely more: whatever the
title or the `Parent` lineage already says needs no tag. Add your sector
domain if you need one (a health company might add `Medical`). **Tags also
filter views and boards**: `Actions.base` ships a “Board · Orga” view
filtered by `file.hasTag("Orga")` — duplicate it to get one board per
project, per domain, or per collection.

## Schemas

One template per object in `Templates/` (Obsidian's core Templates plugin):
Action, Decision, Journal, Information, People. One creation wizard per
object — see Tooling.

### Action

**Why this object.** The single vector of change: everything the company
does, from the 10-minute fix to the 6-month program, is an action — same
schema, same lifecycle, dispatchable indifferently to a human or an LLM.
The fractal `Parent` field replaces the project/task/epic zoo; the `Status`
cycle carries the review lock (`In Review` → `Done`) that makes work
auditable.

**Is one ✓**: “Turn off the legacy wiki” · “Contract with the pilot
partner” · “Rework the header design” — a verb, a verifiable done.
**Is not one ✗**: meeting minutes → Journal · “the export runs nightly at
3am” → Information · “think about pricing” with no done criterion →
Reflexion in the Journal (or reframe with a deliverable: “Draft a pricing
grid”).

| Field | Type | Values / meaning |
|---|---|---|
| `Id` | string | `act-NNNN`, stable |
| `Title` | string | Verb + complement, very short |
| `Status` | enum | `Draft` (captured idea, spec to write — the triage column) · `Backlog` (specified, not scheduled) · `Ready` (startable now) · `In progress` · `Blocked` (see `Blocked reason`) · `In Review` (awaiting the `Reviewers`) · `Done` · `Cancelled` |
| `Owner` | link | A `People/` entry (human or LLM), accountable |
| `Parent` | link | Parent action — mandatory; the only action without one is the mission, the single root of the tree. An action with children is an “epic” |
| `Effort` | enum | Anticipated load, in human time: `XS` <1 h · `S` <½ day · `M` <2 days · `L` <1 week · `XL` way bigger |
| `Due` | date | Deadline, optional |
| `Blocked by` | links | Blocking actions |
| `Blocked reason` | text | Free operational text — why it is stuck |
| `Reviewers` | links | `People/` entries for formal validation (LLMs and/or humans) |
| `Tags` | list | Free classification |
| `kanban_order` | number | Manual order on the Board (“I handle this before that”) — written by Base Board on drag; absent until the card has been ordered once |

Body sections:

- **Description** — product-style definition: context, stakes, scope,
  out-of-scope. Everything needed to pick the task up cold. Always filled at
  creation (LLMs included).
- **Actions** — right under the Description: embedded base listing the
  sub-actions (delete it on a leaf).
- **References** — the key Information and the Decisions useful for
  executing the action: link them anywhere in the file, the embedded base
  lists them with their freshness and status.
- **Misc** — assorted notes, including implementation suggestions: a
  possible lead, explicitly a suggestion and never a decision nor an order;
  the executor keeps the “how”. Optional.
- **Critères d'acceptation** — the done criterion as an observable
  checklist. Always filled at creation (LLMs included).
- **History** — dated entries, the action's logbook. This is where
  decisions whose scope does not outlive the action go (see the guardrail in
  the Decision section) and the work discussions on the action (links
  included) — no Journal entry for that.

Views: `Actions/Actions.base` — **Board** (kanban: columns by `Status`, drag
across columns = status change written into the frontmatter, vertical drag =
manual priority via `kanban_order`), Operational, Blocked, In review, Epics,
All — plus the tag-filtered “Board · Orga” example. Every parent action
lists its children inline; the backlinks pane gives the same for free.

### Decision (ADR)

**Why this object.** The memory of enacted choices. It kills the re-debate
of old discussions (rejected options are recorded with their reasons), gives
every rule a traceable origin, and — being append-only — makes silent
rewriting of the past impossible: a decision gets superseded (`Supersedes`),
never edited.

**Is one ✓**: the Obsidian + GitHub stack · “Start with a single morning
slot” (commits three organizations) — scope beyond one action.
**Is not one ✗**: the choice of a plugin or a setting → the relevant
action's History · a conviction not yet enacted → Reflexion in the
Journal · “we'll revisit if demand exceeds 8/month” → a Consequence of an
existing decision, not one more decision.

**Guardrail — ADR or Historique?** The test is **scope**. A decision only
deserves to exist outside an action's History if its scope outlives the
current action — if it will constrain people or work that will never have
that action in front of them. The question to ask: “who will need to know
this decision without ever opening this action?” Someone → ADR. No one →
the relevant action's History, however important or costly the decision
looks (importance does not make scope; a costly one-way door local to the
action stays in its Historique). LLMs included — and especially LLMs: do
not create an ADR for every micro-choice; when in doubt, it is the
Historique.

| Field | Type | Values / meaning |
|---|---|---|
| `Id` | string | `dec-NNNN`, stable |
| `Title` | string | Short declarative name of what is decided |
| `Status` | enum | `Draft` (being written) · `Proposed` (ready to discuss) · `Accepted` (enacted, in force) · `Superseded` (replaced — see the most recent one's `Supersedes`) · `Rejected` |
| `Date` | date | When it was enacted |
| `Decided by` | links | Who holds the decision — the accountable (humans or LLMs) |
| `Supersedes` | link | The older decision this one replaces, if any |

Body sections: **Decision** (one declarative sentence), **Context** (the
problem that forced the decision — stating the door type: *one-way*,
irreversible or costly to reverse, which justifies the ADR; or *two-way*,
reversible — though rarely free), **Decision Drivers** (the forces at play:
constraints, criteria, deadlines), **Options considered** (with the why of
each rejection), **Consequences** (what it commits, what it closes, what to
watch).

Views: `Decisions/Decisions.base` — “In force” (the Accepted — the doctrine
in effect), “Pipeline” (Draft and Proposed), “All”.

### Information

**Why this object.** What we know, separated from the noise of how we
learned it. A qualified fact carries its sources, a confidence level and —
above all — an expiry date: knowledge without a freshness contract silently
becomes false. Re-verifying expired facts is a natural agent loop.

**Is one ✓**: “Partner slots: 7–8 am and 7–8 pm” (fact) · “The brand book”
pointing to the shared drive's `Marketing/` (pointer) · “Feature requests
declined” (list). **Is not one ✗**: the brand book itself — the PDF lives in
the Drive, only its reference lives here · a dated opinion → Reflexion in
the Journal · a number heard in a meeting and not yet qualified → it stays
in the minutes until qualified (sources, confidence, expiry).

The three forms of an Information:

1. **The fact** — the information itself, stated and analyzed in the body.
2. **The pointer** — the reference to a deliverable that lives elsewhere: a
   Drive document (“The brand book” → `Shared-drive/Marketing/…`, with the
   Drive link in `Sources`) or a repository document. The body says what the
   deliverable is, where it lives, and which version is authoritative;
   `Review by` becomes the pointer's freshness contract (is the document
   still there, is the version current?). This is what lets the OS
   orchestrate without storing.
3. **The list** — several items of a single topic in one entry (“Feature
   requests declined”, “Funding leads”). Legitimate as long as the list
   shares one topic and one freshness: if items diverge in source,
   confidence or expiry, they deserve their own entries.

| Field | Type | Values / meaning |
|---|---|---|
| `Id` | string | `info-NNNN`, stable |
| `Title` | string | The fact stated short — or the name of the pointed deliverable |
| `Sources` | list | External origins (URLs, “manual reading”…) — or the deliverable's location (Drive/repo path, link) |
| `Journal` | links | Journal entry/entries this information was extracted from |
| `Confidence` | enum | `high` (verified, multi-source) · `medium` (credible, partly verified) · `low` (single or weak source) |
| `Collected` | date | When the fact was gathered |
| `Review by` | date | Past this date, the fact is presumed stale and must be re-verified |
| `Tags` | list | Free classification |

Views: `Information/Information.base` — “All”, “By freshness”.

### Journal

**Why this object.** The raw chronological inbox — meetings, news,
reflections, notable emails, misc — write-once and never edited, so the
archive stays trustworthy. Its value is extracted into
Actions/Decisions/Information; the `Processed` flag turns “what is left to
triage?” into a one-filter view and a natural agent loop. `Reflexion`
entries have a special status: they are snapshots of thought (an idea, a
mini-synthesis of a topic at a point in time), tagged by theme to be re-read
in series — the “Reflexions” view exists for that.

**Is one ✓**: the minutes of the partner meeting (Meeting) · “The regulator
publishes a new guideline” (News) · “Where I stand on pricing” (Reflexion,
tagged Growth) · a received email that is an event, quoted verbatim (Email).
**Is not one ✗**: work notes on an ongoing action → its `## History` ·
durable qualified knowledge → Information · a received document → Drive
(+ Information-pointer if needed).

**Rule — Journal or action Historique?** A work discussion held within an
ongoing action is recorded in that action's History (links included), not
as a Journal entry — otherwise the Journal drowns the signal. The Journal
captures what happens outside the thread of actions: meetings, external
news, events.

| Field | Type | Values / meaning |
|---|---|---|
| `Title` | string | `YYYY-MM-DD - Short human topic` — date first, so it reads everywhere (sidebar, tabs, tables); the wizard sets it automatically |
| `Date` | date | The entry's date (also starts the file name) |
| `Kind` | enum | `Meeting` (we talked) · `News` (external event that may trigger updates) · `Reflexion` (dated idea, thought, mini-synthesis — re-read by theme) · `Email` (a sent or received email that is an event — quoted verbatim) · `Misc` (everything else worth a trace) |
| `Processed` | bool | `false` until the value has been extracted to the refined folders, then `true` |
| `Participants` | links | `People/` entries involved |
| `Tags` | list | Thematic re-reading keys — essential on `Reflexion` entries |

No `Refs` field: unmaintainable by hand. Instead, each entry's body (via the
template) contains an **Extracted** section with auto-fed tables — Actions,
Decisions, Information — listing every object that points to this entry. To
create an action from an open entry: `⌘⇧A`, the backlink is pre-filled;
same with `⌘⇧I` for an information (`Journal` field pre-filled) and `⌘⇧D`
for a decision (Source line added).

Views: `Journal/Journal.base` — “To process” (the triage inbox),
“Reflexions” (the snapshots of thought, filterable by tag) and
“Full stream”.

### People

**Why this object.** The registry of actors — humans, LLM agents, external
providers (accountant, lawyer…) — so that `Owner`, `Reviewers`,
`Participants` and `Decided by` are real links, not strings. A People file's
backlinks show everything the actor touches; an LLM's file documents how to
invoke it. People is also **the CRM trace**: every person named in a
business context gets a file, even met once — losing track of a contact in
the folds of the organization is the number-one risk. A potentially useful
contact with no documented follow-up additionally gets a `Draft` action
(“Evaluate the contact …”) for triage.

**Is one ✓**: Alice (partner contact) · Claude (LLM agent) · the accountant
(org) — anyone who can be Owner, Reviewer, Participant or Decided by, and
any named business contact. **Is not one ✗**: an anonymous mention (“a
radiologist”) → nothing · a person appearing only in confidential material →
never a file · a candidate → HR folder · the partner company *on top of* its
contact person → one file is enough (the human; `org` is reserved for the
provider engaged as a structure).

| Field | Type | Values / meaning |
|---|---|---|
| `Id` | string | `ppl-NNNN`, stable |
| `Title` | string | Display name (full name, agent name, legal name) |
| `Kind` | enum | `human` · `llm` (agent — the file documents invocation) · `org` (external provider) |
| `Role` | text | What they do for the company |
| `Contact` | text | Email, phone — or invocation mode for an LLM |
| `Work preference` | text | Preferred way of working, free text: document by email, shared Google Doc, WhatsApp, PR in the repo… |
| `Tags` | list | Free classification (actor families: Founder, Agent, Partner, Investor…) |

## The workflow

### Where things live — the five spaces

The vault is the OS: it **orchestrates**, it does not store. Deliverables
live in their space; the vault keeps only the pointer (an Information).
Golden rule inherited from the spaces: **blob → Drive, text → git.**

| Space | Nature | What lives there |
|---|---|---|
| Git workspace | Git only | The repositories: code, ontology, this framework |
| Shared drive | Team drive (default) | Every office document of the company: product, design, marketing, decks, day-to-day finance, signed legal |
| Confidential pocket | Founder-scoped drive | The not-readable-by-default: legal under negotiation, disputes, PERSONNEL folders — shared folder by folder, by name |
| Local | Never synced | The antechamber (to triage) and the off-cloud |
| Regulated systems | Certified hosting | Data under a legal regime (e.g. real patient data) — only there, never elsewhere |

### The daily routine — six gestures

1. **Capture a task**: `+` on the Board (burst of titles), then `⌘⇧B`
   normalizes the batch. For a deliberate creation: `⌘⇧A`.
2. **Coming out of a meeting or call**: `⌘⇧J` → raw notes → from the open
   entry, extract (`⌘⇧A` / `⌘⇧D` / `⌘⇧I`, backlinks pre-filled) → set
   `Processed: true`. The minutes stay raw forever; their value lives in the
   extracted objects.
3. **Set down a reflection**: `⌘⇧J`, `Kind: Reflexion`, with thematic tags —
   a dated, write-once snapshot of thought; the Journal's “Reflexions” view
   lets you re-read a theme in one pass.
4. **Work on an action**: everything goes in its `## History` — links,
   discussions, local decisions. Never a Journal entry for work on an action.
5. **Enact a decision**: its scope outlives the current action → `⌘⇧D`;
   otherwise → the action's History.
6. **Learn something durable**: `⌘⇧I` — a fact, a pointer to a deliverable,
   or a list (see the three forms in the Information schema).

### Routing an item — the decision tree

Facing something to file, one question at a time:

1. Is it an office document (docx, xlsx, pdf, deck)? → It lives in the
   Drive (shared drive by default, confidential pocket if a nameable
   constraint applies). If it must be findable from the OS → an
   Information-pointer references it.
2. Is it code or versioned text? → A repository. Durable reference →
   Information-pointer.
3. Is it something to do? → **Action** (via the Board for quick capture).
4. Is it an enacted choice? → Scope beyond the current action → **Decision**;
   otherwise → the relevant action's History.
5. Is it durable, qualified knowledge? → **Information** (fact, pointer or
   list).
6. Is it something that happened or was said — or a dated thought? →
   **Journal** (Meeting, News, Reflexion, Email, Misc).
7. Is it an actor? → **People**.
8. None of the above, or no time to decide? → the local antechamber, to be
   re-triaged — never force anything into the wrong object.

## Quick reference

### Creation wizards

Five QuickAdd commands on the same design system (a single modal, first two
fields full-width then pairs in two columns, autocomplete, fixed
Submit/Cancel footer — styled by the `quickadd-form` snippet):

| Command | macOS | Windows/Linux | What it does |
|---|---|---|---|
| **New Action** | `⌘⇧A` | `Ctrl+Shift+A` | Title, Parent and Owner with autocomplete, Reviewers and Tags multi-select, Effort, Status, optional Due. Capitalized slug, auto Id, body from `Templates/Action.md` |
| **Normalize Action** | `⌘⇧B` | `Ctrl+Shift+B` | Closes a Board capture burst: every Id-less action receives Id, Title, body and slug (batch). Also repairs, across the whole vault, pathed wikilinks slipped into properties |
| **New Decision** | `⌘⇧D` | `Ctrl+Shift+D` | Title, Supersedes with autocomplete, Status (Draft by default), Decided by multi. ADR body from `Templates/Decision.md` |
| **New Information** | `⌘⇧I` | `Ctrl+Shift+I` | Title, Sources, Confidence, Review by, Tags. Collected dated today |
| **New Journal entry** | `⌘⇧J` | `Ctrl+Shift+J` | Topic, Date (today by default), Kind, Participants multi. `date-topic.md` file, body with the Extracted tables |

Shortcuts are declared with Obsidian's “Mod” key (`⌘` on macOS, `Ctrl` on
Windows/Linux) in `.obsidian/hotkeys.json`, versioned — the same gestures
for the whole team, whatever the OS.

Invoked from an open Journal entry, New Action / Decision / Information
pre-fill the backlink to the entry — that is what feeds its Extracted
tables. Nobody ever types a file name.

A sixth command, **Sync filename to Title**, renames the active file to its
`Title`'s slug (through Obsidian's native rename: all links follow). Useful
only when the old slug has become misleading.

The four bundled plugins that power all of this (pinned versions, licenses,
policy) are detailed in [INSTALL.md](INSTALL.md).

## Human × LLM co-editing

Everything is `.md` + YAML: an LLM agent reads the index, creates conforming
objects (same templates, same link and Id rules), appends to Historique
sections, and a validation script can check frontmatter, enums, Id
uniqueness and link resolution. The `Draft` status is the airlock: the agent
proposes, the human triages on the board.

## Deferred

Topics recorded for later — prioritization, schema validation in CI, the
token-economy study — live in **[ROADMAP.md](ROADMAP.md)**.
