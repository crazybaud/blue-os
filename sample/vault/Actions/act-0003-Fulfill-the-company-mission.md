---
Id: act-0003
aliases: ["act-0003 · Fulfill the company mission · In progress"]
Title: Fulfill the company mission
Status: In progress
Owner: "[[ppl-0001-Alice]]"
Parent: ""
Effort: XL
Due: ""
Blocked by: []
Blocked reason: ""
Reviewers: []
Tags: [Mission]
---
# Description

The root of the action tree — the only action allowed to have no `Parent`.
Every other action attaches, directly or through its ancestors, to this one:
walking up any action's `Parent` chain must always end here. Replace this
text with your actual mission statement.

# Actions

```base
filters:
  and:
    - file.inFolder("Actions")
    - Parent.contains(this.file.name)
formulas:
  Open: link(file.name, "↗")
views:
  - type: table
    name: Actions
    order:
      - Title
      - formula.Open
      - Status
      - Owner
      - Effort
      - Due
```

```breadcrumbs
type: tree
fields: [Children]
```

# Critères d'acceptation

- [ ] The mission is stated in one sentence
- [ ] Every root epic has this action as Parent

# History

- 2026-01-01 — Created at install time (example).
