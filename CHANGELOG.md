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
