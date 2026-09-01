/**
 * QuickAdd user script: "New Decision".
 * Same design system as New Action: one single form, full-width fields on
 * top, paired columns below. Creates Decisions/<Capitalized-slug>.md with
 * auto Id; the body comes from Templates/Decision.md. Invoked from an open
 * journal entry, the decision links back to it (shows up in its
 * "Extracted > Decisions" table).
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

  const decisionFiles = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith("Decisions/"));
  const decisionNames = decisionFiles.map((f) => f.basename).sort();
  const people = app.vault.getMarkdownFiles()
    .filter((f) => f.path.startsWith("People/")).map((f) => f.basename).sort();

  let r;
  try {
    r = await quickAddApi.requestInputs([
      { id: "Title", label: "Title", type: "text", placeholder: "Short declarative name of what is decided" },
      { id: "Supersedes", label: "Supersedes", type: "suggester", options: decisionNames, optional: true,
        placeholder: "Type to search — empty if this replaces nothing" },
      { id: "Status", label: "Status", type: "dropdown",
        options: ["Draft", "Proposed", "Accepted"], defaultValue: "Draft",
        description: "Draft: being written · Proposed: ready to discuss · Accepted: settled" },
      { id: "DecidedBy", label: "Decided by", type: "suggester", options: people,
        suggesterConfig: { multiSelect: true }, defaultValue: "Antoine" },
    ]);
  } catch (e) {
    return; // cancelled
  }

  const title = (r.Title ?? "").trim();
  if (!title) { notice("Title is required."); return; }
  const slug = slugify(title);
  if (!slug) { notice("Title must contain letters or digits."); return; }

  const supersedes = (r.Supersedes ?? "").trim();
  if (supersedes && !decisionNames.includes(supersedes)) {
    notice(`Unknown decision: "${supersedes}" — nothing created.`);
    return;
  }
  const deciders = (r.DecidedBy ?? "").split(/,\s*/).map((x) => x.trim()).filter(Boolean);

  let max = 0;
  for (const f of decisionFiles) {
    const fm = app.metadataCache.getFileCache(f)?.frontmatter;
    const m = /^dec-(\d+)$/.exec(fm?.Id ?? "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  const id = `dec-${String(max + 1).padStart(4, "0")}`;

  const today = window.moment().format("YYYY-MM-DD");
  let body = "\n# Decision\n\n# Context\n\n# Decision Drivers\n\n# Options considered\n\n# Consequences\n";
  const tpl = app.vault.getAbstractFileByPath("Templates/Decision.md");
  if (tpl) {
    const raw = await app.vault.cachedRead(tpl);
    body = "\n" + raw.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^\n+/, "");
  }
  if (fromJournal) {
    body += `\n> Source : [${fromJournal.basename}](../Journal/${fromJournal.name})\n`;
  }

  const frontmatter = `---
Id: ${id}
Title: ${title}
Status: ${r.Status || "Draft"}
Date: ${today}
Decided by: [${deciders.map((x) => `"[[${x}]]"`).join(", ")}]
Supersedes: ${supersedes ? `"[[${supersedes}]]"` : '""'}
---`;

  const path = `Decisions/${id}-${slug}.md`;
  if (app.vault.getAbstractFileByPath(path)) { notice(`Already exists: ${path}`); return; }
  const file = await app.vault.create(path, frontmatter + body);
  await app.workspace.getLeaf(false).openFile(file);
  notice(`${id} created`);
};
