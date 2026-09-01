#!/usr/bin/env bash
# git clone https://github.com/crazybaud/blue-os && cd blue-os && ./install.sh
# Turns this clone into a ready-to-use vault (content is gitignored).
# Installing into another folder also works: ./install.sh <folder>
set -euo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-.}"
mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"
if [ -e "$TARGET/.obsidian" ]; then echo "Refusing: $TARGET already contains an .obsidian folder — a vault is already installed here." >&2; exit 1; fi
cp -R "$SRC/sample/vault/." "$TARGET/"
if [ "$TARGET" != "$SRC" ]; then
  cp -R "$SRC/Templates" "$TARGET/Templates"
  mkdir -p "$TARGET/scripts"
  cp -R "$SRC/scripts/quickadd" "$TARGET/scripts/quickadd"
fi
cp "$SRC/VERSION" "$TARGET/.blue-os-version"
cat <<MSG
Vault ready in: $TARGET
1. Obsidian → "Open folder as vault" → this folder
2. Settings → Community plugins → "Turn off restricted mode", then reload (Cmd+R) — the bundled plugins (QuickAdd, Front Matter Title, Base Board, Colored Tags, Breadcrumbs) enable themselves
3. Cmd+Shift+A (Ctrl+Shift+A): your first action — the board lives in Actions/Actions.base
Your doctrine: README-Org.md · Sync & upgrades: INSTALL.md + CHANGELOG.md
MSG
