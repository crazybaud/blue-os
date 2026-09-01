/**
 * QuickAdd user script: "Sync filename to Title".
 * Renames the active file to the capitalized kebab slug of its Title
 * property, via app.fileManager.renameFile — which triggers Obsidian's
 * native link update, exactly like a manual rename. Use it after editing
 * a Title, when the old slug has become misleading.
 */
module.exports = async (params) => {
  const { app, obsidian } = params;
  const notice = (msg) => new obsidian.Notice(msg);

  const file = app.workspace.getActiveFile();
  if (!file) { notice("No active file."); return; }

  const title = app.metadataCache.getFileCache(file)?.frontmatter?.Title;
  if (!title || typeof title !== "string") { notice("This file has no Title property."); return; }

  let slug = title
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  slug = slug.charAt(0).toUpperCase() + slug.slice(1);
  if (!slug) { notice("Title must contain letters or digits."); return; }

  const dir = file.parent && file.parent.path !== "/" ? `${file.parent.path}/` : "";
  const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  const prefix = typeof fm.Id === "string" && /^(act|dec|info|ppl)-\d{4}$/.test(fm.Id) ? `${fm.Id}-` : "";
  const newPath = `${dir}${prefix}${slug}.md`;
  if (newPath === file.path) { notice("Filename already in sync."); return; }
  if (app.vault.getAbstractFileByPath(newPath)) { notice(`Already exists: ${newPath}`); return; }

  await app.fileManager.renameFile(file, newPath);
  notice(`Renamed to ${slug}.md — links updated.`);
};
