---
Title: "2026-01-01 - Hello world: first entry of this vault"
Date: 2026-01-01
Kind: Misc
Processed: true
Participants: ["[[ppl-0001-Alice]]"]
Tags: [Orga]
---
Welcome to Blue OS. This entry shows the full cycle: a dated raw note
(write-once), whose value gets extracted into the other objects — one
[Information](../Information/info-0001-The-vault-is-installed.md), one
[Decision](../Decisions/dec-0001-Adopt-blue-os.md) and two Actions. Every object
created from this entry shows up automatically in the Extracted table below
(backlinks).

# Extracted

```base
filters:
  and:
    - file.hasLink(this.file)
views:
  - type: table
    name: Extracted objects
    order:
      - Title
      - Status
```
