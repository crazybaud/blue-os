/**
 * QuickAdd user script: "Normalize Action" (batch).
 * Rapid-capture flow: type bare titles on the kanban ("+"), then run this
 * once — every action lacking a valid Id (the signature of quick capture)
 * gets: the next Id, Title from filename, missing schema fields, template
 * body sections, and a rename to the capitalized kebab slug (links update
 * automatically). Actions that already have an Id are left untouched.
 */
const slugify = (title) => {
  let slug = title
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

const CANONICAL_KEYS = ["Id", "Title", "Status", "Owner", "Parent", "Effort",
  "Due", "Blocked by", "Blocked reason", "Reviewers", "Tags", "kanban_order"];

// Adapt to your organization (the Board's newItemProperties usually sets Owner
// at capture time, so this default rarely fires).
const DEFAULT_OWNER = "";

const DEFAULTS = {
  Status: "Backlog", Owner: DEFAULT_OWNER, Parent: "", Effort: "L", Due: "",
  "Blocked by": [], "Blocked reason": "", Reviewers: [], Tags: [],
};

const yamlValue = (key, v) => {
  if (Array.isArray(v)) return `[${v.map((x) => `"${x}"`).join(", ")}]`;
  if (typeof v === "string" && v.startsWith("[[")) return `"${v}"`;
  if (v === "" || v === null || v === undefined) return '""';
  return `${v}`;
};

module.exports = async (params) => {
  const { app, obsidian } = params;
  const notice = (msg) => new obsidian.Notice(msg);
  const today = window.moment().format("YYYY-MM-DD");

  // Pass 1 — vault-wide property hygiene. Obsidian's property suggester
  // writes path-wikilinks ("[[../People/X|X]]"); the rule is bare names.
  // Rewrite them inside frontmatter blocks only (bodies keep their links).
  let fixedLinks = 0;
  const PATH_LINK = /\[\[(?:[^\]|\n]*\/)([^\]|\n\/]+?)(?:\.md)?(?:\|[^\]\n]*)?\]\]/g;
  const FOLDERS = ["Actions/", "Decisions/", "Journal/", "Information/", "People/"];
  for (const f of app.vault.getMarkdownFiles().filter((x) => FOLDERS.some((d) => x.path.startsWith(d)))) {
    const raw = await app.vault.read(f);
    const m = /^---\n[\s\S]*?\n---/.exec(raw);
    if (!m) continue;
    const fixed = m[0].replace(PATH_LINK, "[[$1]]");
    if (fixed !== m[0]) {
      await app.vault.modify(f, fixed + raw.slice(m[0].length));
      fixedLinks++;
    }
  }

  const actionFiles = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith("Actions/"));

  // Pass 2 — children table. Any action that has at least one direct child
  // (some action's Parent points to it) gets the embedded "# Actions" base
  // right under its Description, so humans can navigate the tree. Additive
  // only: never removed from leaves by this script.
  const CHILD_BASE = [
    "# Actions", "", "```base", "filters:", "  and:",
    '    - file.inFolder("Actions")', "    - Parent.contains(this.file.name)",
    "formulas:", '  Open: link(file.name, "↗")', "views:", "  - type: table",
    "    name: Actions", "    order:", "      - Title", "      - formula.Open",
    "      - Status", "      - Owner", "      - Effort", "      - Due", "```", ""
  ].join("\n");
  const parentNames = new Set();
  for (const f of actionFiles) {
    const par = app.metadataCache.getFileCache(f)?.frontmatter?.Parent;
    const m = typeof par === "string" && /\[\[([^\]]+)\]\]/.exec(par);
    if (m) parentNames.add(m[1]);
  }
  let tablesAdded = 0;
  for (const f of actionFiles) {
    if (!parentNames.has(f.basename)) continue;
    const raw = await app.vault.read(f);
    if (/^# Actions\b/m.test(raw)) continue;
    let out;
    const desc = /^# Description\b[\s\S]*?(?=^# )/m.exec(raw);
    if (desc) out = raw.slice(0, desc.index + desc[0].length) + CHILD_BASE + "\n" + raw.slice(desc.index + desc[0].length);
    else out = raw.replace(/\s*$/, "\n\n") + CHILD_BASE;
    await app.vault.modify(f, out);
    tablesAdded++;
  }

  let max = 0;
  const toFix = [];
  for (const f of actionFiles) {
    const fm = app.metadataCache.getFileCache(f)?.frontmatter ?? {};
    const m = /^act-(\d+)$/.exec(fm.Id ?? "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
    else toFix.push(f);
  }
  if (toFix.length === 0) {
    notice([fixedLinks && `property links fixed in ${fixedLinks} file(s)`,
            tablesAdded && `children table added to ${tablesAdded} parent(s)`]
            .filter(Boolean).join(" — ") || "Nothing to normalize — every action has an Id.");
    return;
  }

  // Template body, fetched once
  let tplBody = `# Description\n\n# Misc\n\n# Critères d'acceptation\n\n- [ ] …\n\n# History\n\n- ${today} — Normalized.\n`;
  const tpl = app.vault.getAbstractFileByPath("Templates/Action.md");
  if (tpl) {
    tplBody = (await app.vault.cachedRead(tpl))
      .replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^\n+/, "")
      .replace(/- (\{\{date\}\}|\d{4}-\d{2}-\d{2}) — ….*/, `- ${today} — Normalized.`);
  }

  const ids = [];
  for (const file of toFix) {
    const fm = { ...(app.metadataCache.getFileCache(file)?.frontmatter ?? {}) };
    delete fm.position;
    fm.Id = `act-${String(++max).padStart(4, "0")}`;
    if (!fm.Title) fm.Title = file.basename;
    for (const [k, v] of Object.entries(DEFAULTS)) if (fm[k] === undefined) fm[k] = v;

    const keys = [...CANONICAL_KEYS.filter((k) => fm[k] !== undefined),
      ...Object.keys(fm).filter((k) => !CANONICAL_KEYS.includes(k))];
    const frontmatter = "---\n" + keys.map((k) => `${k}: ${yamlValue(k, fm[k])}`).join("\n") + "\n---";

    const raw = await app.vault.read(file);
    let body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^\n+/, "");
    if (!/^# /m.test(body)) body = body.trim() ? `${tplBody}\n${body.trim()}\n` : tplBody;

    await app.vault.modify(file, `${frontmatter}\n${body}`);

    const slug = slugify(fm.Title);
    const dir = file.parent && file.parent.path !== "/" ? `${file.parent.path}/` : "";
    const newPath = `${dir}${slug}.md`;
    if (slug && newPath !== file.path && !app.vault.getAbstractFileByPath(newPath)) {
      await app.fileManager.renameFile(file, newPath);
    }
    ids.push(fm.Id);
  }
  notice(`${ids.length} action(s) normalized: ${ids.join(", ")}`
    + (fixedLinks ? ` — property links fixed in ${fixedLinks} file(s)` : "")
    + (tablesAdded ? ` — children table added to ${tablesAdded} parent(s)` : ""));
};
