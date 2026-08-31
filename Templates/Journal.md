---
Title: "{{date}} - Short human topic"
Date: {{date}}
Kind: Meeting        # Meeting | News | Reflexion | Email | Misc
Processed: false
Participants: []
Tags: []
---
Raw notes. Write-once: an entry is never edited afterwards — its value is
extracted to Actions/, Decisions/ or Information/, then `Processed: true`.

<!-- Rule: a work discussion held within an ongoing action is recorded in
that action's History (links included), NOT here — otherwise the Journal
drowns the signal. The Journal captures what happens outside the thread of
actions: meetings, news, events. -->

# Extracted

What was produced from this entry — listed automatically: every object that
*points to* this entry appears here (actions created with `⌘⇧A` from the
open entry, informations with the `Journal` field, decisions linking the
entry in their body).

```base
filters:
  and:
    - file.hasLink(this.file)
views:
  - type: table
    name: Actions
    filters:
      and:
        - file.inFolder("Actions")
    order:
      - Title
      - Status
      - Owner
  - type: table
    name: Decisions
    filters:
      and:
        - file.inFolder("Decisions")
    order:
      - Title
      - Status
      - Decided by
  - type: table
    name: Information
    filters:
      and:
        - file.inFolder("Information")
    order:
      - Title
      - Confidence
      - Review by
```
