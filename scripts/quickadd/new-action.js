/**
 * QuickAdd user script: "New Action".
 * One single form (requestInputs) collecting every field, then creates
 * Actions/<Capitalized-slug>.md. Frontmatter is built here; the body comes
 * from Templates/Action.md, so editing the template updates future actions
 * without touching this script. The user never types a filename.
 */
const slugify = (title) => {
  let slug = title
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

const FALLBACK_BODY = `
# Description

# Misc

# Critères d'acceptation

- [ ] …

# History
`;

module.exports = async (params) => {
  const { app, quickAddApi, obsidian } = params;
  const notice = (msg) => new obsidian.Notice(msg);

  // Invoked from an open journal entry? The new action links back to it,
  // which makes it appear in that entry's "Extracted > Actions" table.
  const activeFile = app.workspace.getActiveFile();
  const fromJournal = activeFile?.path.startsWith("Journal/") ? activeFile : null;

  const actionFiles = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith("Actions/"));
  const actionNames = actionFiles.map((f) => f.basename).sort();
  const people = app.vault.getMarkdownFiles()
    .filter((f) => f.path.startsWith("People/")).map((f) => f.basename).sort();
  const knownTags = [...new Set(actionFiles.flatMap((f) => {
    const t = app.metadataCache.getFileCache(f)?.frontmatter?.Tags;
    return Array.isArray(t) ? t : [];
  }))].sort();
  const STATUSES = ["Draft", "Backlog", "Ready", "In progress", "Blocked", "In Review", "Done", "Cancelled"];

  let r;
  try {
    r = await quickAddApi.requestInputs([
      { id: "Title", label: "Title", type: "text", placeholder: "Verb + complement, very short" },
      { id: "Parent", label: "Parent", type: "suggester", options: actionNames, optional: true,
        placeholder: "Type to search — empty for a root action" },
      { id: "Owner", label: "Owner", type: "suggester", options: people, defaultValue: "Antoine" },
      { id: "Reviewers", label: "Reviewers", type: "suggester", options: people, optional: true,
        suggesterConfig: { multiSelect: true }, placeholder: "Type to add one or more…" },
      { id: "Effort", label: "Effort", type: "dropdown", options: ["XS", "S", "M", "L", "XL"], defaultValue: "L",
        description: "XS <1h · S <½ day · M <2 days · L <1 week · XL way bigger" },
      { id: "Due", label: "Due", type: "date", dateFormat: "YYYY-MM-DD", optional: true,
        placeholder: "2026-09-30…", description: "t today · tm tomorrow · nw next week · nm next month" },
      { id: "Status", label: "Status", type: "dropdown", options: STATUSES, defaultValue: "Backlog" },
      { id: "Tags", label: "Tags", type: "suggester", options: knownTags, optional: true,
        suggesterConfig: { multiSelect: true }, placeholder: "Type to add one or more…" },
    ]);
  } catch (e) {
    return; // cancelled
  }

  const title = (r.Title ?? "").trim();
  if (!title) { notice("Title is required."); return; }
  const slug = slugify(title);
  if (!slug) { notice("Title must contain letters or digits."); return; }

  const parent = (r.Parent ?? "").trim();
  if (parent && !actionNames.includes(parent)) {
    notice(`Unknown parent action: "${parent}" — nothing created.`);
    return;
  }

  const reviewers = (r.Reviewers ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);
  const tags = (r.Tags ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);

  // Next Id: scan Actions/ frontmatter for act-NNNN
  let max = 0;
  for (const f of actionFiles) {
    const fm = app.metadataCache.getFileCache(f)?.frontmatter;
    const m = /^act-(\d+)$/.exec(fm?.Id ?? "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  const id = `act-${String(max + 1).padStart(4, "0")}`;

  // Body: taken from the Action template (everything after its frontmatter)
  const today = window.moment().format("YYYY-MM-DD");
  let body = FALLBACK_BODY;
  const tpl = app.vault.getAbstractFileByPath("Templates/Action.md");
  if (tpl) {
    const raw = await app.vault.cachedRead(tpl);
    body = "\n" + raw.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^\n+/, "");
  }
  const createdLine = fromJournal
    ? `- ${today} — Created from [${fromJournal.basename}](../Journal/${fromJournal.name}).`
    : `- ${today} — Created.`;
  body = body.replace(/- (\{\{date\}\}|\d{4}-\d{2}-\d{2}) — ….*/, createdLine);

  const alias = `${id} · ${title} · ${r.Status || "Backlog"}`;
  const frontmatter = `---
Id: ${id}
aliases: ["${alias.replace(/\"/g, "'")}"]
Title: ${title}
Status: ${r.Status || "Backlog"}
Owner: "[[${r.Owner}]]"
Parent: ${parent ? `"[[${parent}]]"` : '""'}
Effort: ${r.Effort}
Due: ${r.Due ? `${r.Due}` : '""'}
Blocked by: []
Blocked reason: ""
Reviewers: [${reviewers.map((x) => `"[[${x}]]"`).join(", ")}]
Tags: [${tags.join(", ")}]
---`;

  const path = `Actions/${id}-${slug}.md`;
  if (app.vault.getAbstractFileByPath(path)) {
    notice(`Already exists: ${path}`);
    return;
  }
  const file = await app.vault.create(path, frontmatter + body);
  await app.workspace.getLeaf(false).openFile(file);
  notice(`${id} created`);
};
