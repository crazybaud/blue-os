/**
 * QuickAdd user script: "New Information".
 * Same design system as New Action. Creates Information/<Capitalized-slug>.md
 * with auto Id; `Collected` is stamped today. Invoked from an open journal
 * entry, the `Journal` property is pre-filled with the link back (shows up
 * in its "Extracted > Information" table).
 */
const slugify = (title) => {
  let slug = title
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

module.exports = async (params) => {
  const { app, quickAddApi, obsidian } = params;
  const notice = (msg) => new obsidian.Notice(msg);

  const activeFile = app.workspace.getActiveFile();
  const fromJournal = activeFile?.path.startsWith("Journal/") ? activeFile : null;

  const infoFiles = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith("Information/"));
  const knownTags = [...new Set(infoFiles.flatMap((f) => {
    const t = app.metadataCache.getFileCache(f)?.frontmatter?.Tags;
    return Array.isArray(t) ? t : [];
  }))].sort();

  let r;
  try {
    r = await quickAddApi.requestInputs([
      { id: "Title", label: "Title", type: "text", placeholder: "The fact, stated short" },
      { id: "Sources", label: "Sources", type: "text", optional: true,
        placeholder: "URLs or documents, comma-separated" },
      { id: "Confidence", label: "Confidence", type: "dropdown",
        options: ["high", "medium", "low"], defaultValue: "medium",
        description: "high: verified, multi-source · medium: partially checked · low: single or weak source" },
      { id: "ReviewBy", label: "Review by", type: "date", dateFormat: "YYYY-MM-DD", optional: true,
        placeholder: "nm, ny, 2027-02-01…", description: "Presumed stale past this date" },
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

  const sources = (r.Sources ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);
  const tags = (r.Tags ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);

  let max = 0;
  for (const f of infoFiles) {
    const fm = app.metadataCache.getFileCache(f)?.frontmatter;
    const m = /^info-(\d+)$/.exec(fm?.Id ?? "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  const id = `info-${String(max + 1).padStart(4, "0")}`;

  const today = window.moment().format("YYYY-MM-DD");
  const frontmatter = `---
Id: ${id}
Title: ${title}
Sources: [${sources.map((x) => `"${x}"`).join(", ")}]
Journal: [${fromJournal ? `"[[${fromJournal.basename}]]"` : ""}]
Confidence: ${r.Confidence || "medium"}
Collected: ${today}
Review by: ${r.ReviewBy ? `${r.ReviewBy}` : '""'}
Tags: [${tags.join(", ")}]
---

`;

  const path = `Information/${id}-${slug}.md`;
  if (app.vault.getAbstractFileByPath(path)) { notice(`Already exists: ${path}`); return; }
  const file = await app.vault.create(path, frontmatter);
  await app.workspace.getLeaf(false).openFile(file);
  notice(`${id} created`);
};
