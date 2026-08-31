# Roadmap

Deferred topics — recorded so they are not lost, deliberately not
implemented yet. Anything here is open for discussion through an issue or a
pull request.

- **Prioritization.** Intuition: `Priority ≈ Impact × Urgency / Effort`,
  without making it a rigid formula. Impact = value if done (Critical, High,
  Medium, Low); Urgency = cost of waiting; Priority = the managerial call on
  execution order (Low, Normal, High, Critical). To be added when the volume
  of actions demands it.
- **Schema validation in CI.** Lint frontmatter, enums, Id uniqueness, link
  resolution, tag-registry membership — so that LLM- and human-written
  objects are checked the same way before landing on main.
- **Save tokens.** The README claims local files are a first-class way to
  hand an agent large context; measure what this costs compared to a
  retrieval layer, then build the patterns that actually save tokens:
  compact indexes, windowed reads, self-contained mission files, batched
  tool calls.
- **LLM plug-in manual.** The missing manual for connecting an LLM agent to
  a vault: the context to load (README, the org's doctrine file), the
  invocation contract (a `People/` file with `Kind: llm`), the rules the
  agent must follow, and a checklist for producing its first conforming
  objects.
- **Permission review process.** A review process verifying that a People —
  human or LLM — only did what it was allowed to do: define per-People
  permissions (which objects, which mutation regimes), and a diff-review
  step that checks every modification against them before it lands on main.
