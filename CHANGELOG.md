# Changelog & upgrade guide

Blue OS follows semantic versioning. Each release below lists **Changes**
(what moved in the framework) and **Migrate your vault** (the concrete
actions to apply to an already-installed vault — your content is yours, no
release will ever touch it for you).

**How to upgrade an installed vault**

1. In your clone: `git pull` (or `git fetch upstream && git merge
   upstream/main` if you sync your content through your own repository).
2. Read every entry below that is newer than the version in your vault's
   `.blue-os-version` file (written by `install.sh`).
3. Apply their “Migrate your vault” checklists, oldest first.
4. Update `.blue-os-version` to the new version.

Rule of thumb: **patch** = safe to skip the checklist (docs, cosmetics),
**minor** = additive migrations (new fields, new views — old content stays
valid), **major** = breaking schema changes, always with an explicit
migration path.

---

## 2.0.0 — 2026-08-29

**Breaking change: `Blocked` is no longer a Status.**
Blocking is a **field**, orthogonal to the stage: an action stays in its
real column (`Backlog`, `In progress`…) and is flagged blocked by filling
`Blocked by` (multi-entry links) and/or `Blocked reason`. The board shows a
⛔ on the card wherever it stands (new `Blocked` formula in `Actions.base`),
the kanban loses its `Blocked` column, and the “Blocked” table view now
filters on the fields instead of the status.

**Changes**
- `Status` enum: `Draft · Backlog · Ready · In progress · In Review · Done ·
  Cancelled` (template, README, sample board).
- `Actions.base`: `Blocked` formula
  (`if(!note["Blocked by"].isEmpty() || note["Blocked reason"] != "", "⛔", "")`)
  displayed on every kanban card; `Blocked` column removed; “Blocked” view
  refiltered.

**Migrate your vault**
- Re-status your blocked actions to their real stage, keeping the fields:
  for each file with `Status: Blocked`, set the underlying status (usually
  `Backlog` or `In progress`) and make sure `Blocked by` or
  `Blocked reason` is filled.
- Update your `Actions/Actions.base` from the sample (formula, columns,
  view), or re-copy it if you had not customized it.

## 1.1.1 — 2026-08-29

**Changes**
- The Action template's `# References` section now renders **three separate
  tables** — Information, Decisions, Related actions — instead of one base
  with tabbed views. Related actions (dependencies, `Blocked by` targets…)
  exclude the children (which belong to the `# Actions` table) and the
  parent (which would leak in through the `Parent` property link).
- README “Why”, block 3: the kanban board as the arbitration surface for
  the order of execution (dragging writes `Status` and `kanban_order`
  straight into the files).

**Migrate your vault**
- Only if you had already copied the 1.1.0 `# References` block into
  actions: replace it with the new three-table version from
  `Templates/Action.md`.

## 1.1.0 — 2026-08-29

**Changes**
- **`# Historique` → `# History`**: the action/decision logbook section is
  now named in English, across templates, sample, wizards and docs.
- **New `# References` section** in the Action template: an embedded base
  listing the key Information (with freshness) and the useful Decisions
  (with status) that the action links to — link a file anywhere in the
  action and it appears there.
- **Parent is mandatory**: every action attaches to the tree; the single
  root is the company mission (the sample now ships a
  `Fulfill the company mission` root, and both hello-world actions attach
  to it).
- README reworked: new opening and "Why" section (the file-first bet, the
  information/decision/action lineage, pragmatic execution), workflow moved
  after the schemas, "Tooling" renamed "Quick reference", plugin details
  moved to `INSTALL.md`, deferred topics moved to `ROADMAP.md` (which gains
  the LLM plug-in manual, the permission review process, and the
  token-saving work).

**Migrate your vault**
- Rename the section in your existing content:
  `grep -rl '^# Historique' --include='*.md' . | xargs sed -i '' 's/^# Historique$/# History/'`
  (drop the `''` after `-i` on Linux).
- Optionally add the `# References` base to actions where it helps (new
  actions get it from the template).
- Create your mission action if you do not have one, and re-parent your
  root epics to it.

## 1.0.0 — 2026-08-29

Initial public release.

**Changes**
- The five objects (Journal, Actions, Decisions, Information, People) with
  their schemas, templates and doctrine (refinery model, routing tree,
  ADR-vs-History guardrail, three forms of Information, People as CRM
  trace).
- Kanban board on `Actions.base` (Base Board), including a tag-filtered
  board example (“Board · Orga”); `⌘⇧B` (Normalize) adds the children table
  to any action that becomes a parent.
- Five QuickAdd wizards (`⌘⇧A/J/I/D` + `⌘⇧B` Normalize) and
  Sync-filename-to-Title.
- Bundled, pinned plugins: QuickAdd 2.22.0 (MIT), Front Matter Title 4.1.1
  (GPL-3.0), Colored Tags 6.1.3 (MIT), Base Board 2.5.1 (MIT) — licenses in
  `THIRD-PARTY-LICENSES.md`.
- Default tag registry (`README-Org.md`), hello-world sample vault, and a
  three-line install: the clone *is* the vault (`install.sh`, in place by
  default, stamps `.blue-os-version`).
- `INSTALL.md`: sync options (Obsidian Sync · GitHub · Syncthing), the full
  GitHub walkthrough (first machine, other machines, end-of-session
  routine), the upgrade path, and the newcomer walkthrough.

**Migrate your vault**
- Fresh start — nothing to migrate.
