/**
 * QuickAdd user script: "New Journal entry".
 * Same design system as New Action. Creates Journal/<YYYY-MM-DD-slug>.md
 * (lowercase slug — journal files are date-first); the body comes from
 * Templates/Journal.md, which includes the "Extracted" auto-tables.
 */
const slugify = (title) => title
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

module.exports = async (params) => {
  const { app, quickAddApi, obsidian } = params;
  const notice = (msg) => new obsidian.Notice(msg);

  const people = app.vault.getMarkdownFiles()
    .filter((f) => f.path.startsWith("People/")).map((f) => f.basename).sort();
  const knownTags = [...new Set(app.vault.getMarkdownFiles().flatMap((f) => {
    const x = app.metadataCache.getFileCache(f)?.frontmatter?.Tags;
    return Array.isArray(x) ? x : [];
  }))].sort();

  let r;
  try {
    r = await quickAddApi.requestInputs([
      { id: "Topic", label: "Topic", type: "text",
        placeholder: "Short subject — becomes the Title and the filename" },
      { id: "Date", label: "Date", type: "date", dateFormat: "YYYY-MM-DD", defaultValue: "today",
        description: "t today · yd yesterday" },
      { id: "Kind", label: "Kind", type: "dropdown",
        options: ["Meeting", "News", "Reflexion", "Email", "Misc"], defaultValue: "Meeting",
        description: "Meeting: we talked · News: outside event · Reflexion: idea or mini-synthesis · Email: an email that is an event · Misc: anything else" },
      { id: "Participants", label: "Participants", type: "suggester", options: people, optional: true,
        suggesterConfig: { multiSelect: true }, placeholder: "Type to add one or more…" },
      { id: "Tags", label: "Tags", type: "suggester", options: knownTags, optional: true,
        suggesterConfig: { multiSelect: true }, placeholder: "Thématiques — clés de relecture" },
    ]);
  } catch (e) {
    return; // cancelled
  }

  const topic = (r.Topic ?? "").trim();
  if (!topic) { notice("Topic is required."); return; }
  const slug = slugify(topic);
  if (!slug) { notice("Topic must contain letters or digits."); return; }

  const date = r.Date || window.moment().format("YYYY-MM-DD");
  const participants = (r.Participants ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);
  const tags = (r.Tags ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);

  let body = "\nNotes brutes.\n";
  const tpl = app.vault.getAbstractFileByPath("Templates/Journal.md");
  if (tpl) {
    const raw = await app.vault.cachedRead(tpl);
    body = "\n" + raw.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^\n+/, "");
  }

  const frontmatter = `---
Title: ${date} - ${topic}
Date: ${date}
Kind: ${r.Kind || "Misc"}
Processed: false
Participants: [${participants.map((x) => `"[[${x}]]"`).join(", ")}]
Tags: [${tags.join(", ")}]
---`;

  const path = `Journal/${date}-${slug}.md`;
  if (app.vault.getAbstractFileByPath(path)) { notice(`Already exists: ${path}`); return; }
  const file = await app.vault.create(path, frontmatter + body);
  await app.workspace.getLeaf(false).openFile(file);
  notice(`Journal entry created`);
};
