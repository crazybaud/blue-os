# Installing Blue OS

## Install

```bash
git clone https://github.com/crazybaud/blue-os && cd blue-os
./install.sh
# then, in Obsidian: "Open folder as vault" → this folder, and enable community plugins
```

Everything is bundled — 4 pinned plugins, templates, forms, kanban board,
default tag registry (`README-Org.md`), hello-world content — and the clone
*is* your vault. Content is not versioned by default: pick a sync option
below.

## Syncing your content

Three options, by trade-off:

| Option | Sync | Traceability |
|---|---|---|
| **Obsidian Sync** (paid) | Real-time, end-to-end encrypted, mobile included | Partial: per-file version history, but no diffs, no review, no PR flow |
| **GitHub** (recommended) | Commit/push at the end of each work session | Full: history, diffs, review through pull requests, protected main |
| **Syncthing** (free, P2P) | Real-time between your machines, no cloud | None: no history semantics (conflict copies are gitignored here) |

For Obsidian Sync and Syncthing, just point the tool at the vault folder and
exclude `.git`. If your content falls under a legal regime, pick a tool that
matches it. With git, note that real-time it is not: the vault is
single-writer between two pushes — fine for a founder or a small team with
session discipline.

**GitHub — on the first machine** (once, from your installed clone):

```bash
git remote rename origin upstream
git remote add origin git@github.com:you/your-private-vault.git   # a PRIVATE repo
# open .gitignore and delete everything between the >>> SYNC and <<< SYNC markers
git add -A && git commit -m "Vault content" && git push -u origin main
```

Then, at the end of each work session:

```bash
git add -A && git commit -m "Session $(date +%F)" && git push
```

**GitHub — on the other machines**: nothing to install, the vault travels
whole (content, plugins, config):

```bash
git clone git@github.com:you/your-private-vault.git my-vault
# open my-vault in Obsidian ("Open folder as vault"), turn off restricted mode
```

Start a session with `git pull`, end it with the commit/push above.

**Upgrading to a new official Blue OS version** (from any machine):

```bash
git fetch upstream
git merge upstream/main
```

then apply the “Migrate your vault” checklist of every new entry in
`CHANGELOG.md`, and push.

## Versions & upgrades

The framework is versioned (`VERSION`, semver). `install.sh` stamps every
new vault with a `.blue-os-version` file. To upgrade an existing vault:
`git pull` the framework, then follow `CHANGELOG.md` — each release lists
its changes **and the concrete migration actions for your vault's content
and config**, additive whenever possible. Your content is yours: no release
ever touches it for you.

## Getting started

**New organization**: clone + `./install.sh` + open in Obsidian (see
Install), then write your doctrine in `README-Org.md` (tag registry, spaces,
root epics) and create the founders' files in `People/`.

**Newcomer joining an existing vault** (human; an LLM reads this README and
writes conforming files directly through git):

1. Install Obsidian (≥ 1.13).
2. Get the vault (clone or sync), then in Obsidian: “Open folder as vault”.
3. Leave restricted mode: Settings → Community plugins → “Turn off
   restricted mode”. That is the only trust gesture asked — the approved
   plugins are versioned with their configuration and activate on their
   own. Reload the vault (`⌘R`).
4. Check: notes display their `Title` (not the slug); `⌘⇧A` opens the New
   Action form; the `scripts` folder is invisible in the explorer.
5. Create your own file in `People/` (People template), with your
   `Work preference`.
6. Edit: on a branch, then pull request (or your sync tool's review
   equivalent). The main line is protected — what lands there is enacted.
