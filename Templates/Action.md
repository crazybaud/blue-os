---
Id: act-XXXX
Title: Verb + complement, very short
Status: Backlog      # Draft | Backlog | Ready | In progress | In Review | Done | Cancelled
Owner: ""
Parent: ""           # mandatory — every action attaches to the tree; the single root is the company mission
Effort: L            # XS <1h | S <½day | M <2days | L <1week | XL way bigger
Due: ""
Blocked by: []       # blocking is a field, not a status: fill this (and/or Blocked reason) and the board shows ⛔
Blocked reason: ""
Reviewers: []
Tags: []
---
# Description

Product-style definition: context, stakes, scope, out of scope.
Everything the executor (human or LLM) needs to resume this task later
without asking anyone.

# Actions

<!-- Direct sub-actions. Delete this section on a leaf action (⌘⇧B re-adds it if the action becomes a parent). -->

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

# References

<!-- Key Information, useful Decisions and related Actions for executing
this action: link them anywhere in this file (body or properties) and they
appear below. -->

**Information**

```base
filters:
  and:
    - this.file.hasLink(file)
    - file.inFolder("Information")
views:
  - type: table
    name: Information
    order:
      - Title
      - Confidence
      - Review by
```

**Decisions**

```base
filters:
  and:
    - this.file.hasLink(file)
    - file.inFolder("Decisions")
views:
  - type: table
    name: Decisions
    order:
      - Title
      - Status
      - Date
```

**Related actions**

<!-- Linked actions (dependencies, Blocked by…) — children and the parent
are excluded: children live in the "# Actions" table above. -->

```base
filters:
  and:
    - this.file.hasLink(file)
    - file.inFolder("Actions")
    - '!Parent.contains(this.file.name)'
    - '!this.note.Parent.contains(file.name)'
views:
  - type: table
    name: Related actions
    order:
      - Title
      - Status
      - Owner
```

# Misc

Assorted notes — notably the **implementation suggestions**: a possible
direction, explicitly a suggestion, never a decision nor an order. The
executor keeps control of the "how".

# Critères d'acceptation

- [ ] Observable result 1
- [ ] The result is visible/usable by …
- [ ] Follow-up recorded in the History, links up to date
- [ ] …

# History
<!-- The action's logbook, as dated entries. Decisions whose scope stays
inside this action are recorded here — not as an ADR.
Description and Critères d'acceptation are ALWAYS filled at creation. -->

- {{date}} — …
