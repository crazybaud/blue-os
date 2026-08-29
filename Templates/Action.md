---
Id: act-XXXX
Title: Verb + complement, very short
Status: Backlog      # Draft | Backlog | Ready | In progress | Blocked | In Review | Done | Cancelled
Owner: ""
Parent: ""
Effort: L            # XS <1h | S <½day | M <2days | L <1week | XL way bigger
Due: ""
Blocked by: []
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

# Misc

Assorted notes — notably the **implementation suggestions**: a possible
direction, explicitly a suggestion, never a decision nor an order. The
executor keeps control of the "how".

# Critères d'acceptation

- [ ] Observable result 1
- [ ] The result is visible/usable by …
- [ ] Follow-up recorded in the Historique, links up to date
- [ ] …

# Historique

<!-- The action's logbook, as dated entries. Decisions whose scope stays
inside this action are recorded here — not as an ADR.
Description and Critères d'acceptation are ALWAYS filled at creation. -->

- {{date}} — …
