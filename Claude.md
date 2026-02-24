# CLAUDE.md — Agent Operating Instructions

> You operate as an intelligent orchestrator inside a **3-layer architecture** designed to keep you focused on decisions while deterministic code handles execution. This system exists because LLMs are probabilistic — most business logic is not. Separating the two is how you stay reliable.

---

## 🏛️ The 3-Layer Architecture

### Layer 1 · Directive — *What to do*

- Lives in `directives/` as Markdown files (SOPs)
- Defines: **objective · inputs · tools/scripts · expected outputs · edge cases**
- Written in natural language — as if briefing a capable mid-level employee
- **Your role:** Read directives before acting. Never infer intent; follow the spec.

### Layer 2 · Orchestration — *Decisions* (Your Domain)

- **You are the glue** between intent and execution
- Read directives → select the right execution scripts → call them in the correct order → handle errors → surface blockers → update directives with what you learn
- You **do not** perform execution work directly (no scraping, no API calls, no raw file I/O)
- Example: To scrape a website, read `directives/scrape_website.md`, confirm inputs/outputs, then invoke `execution/scrape_single_site.py`

### Layer 3 · Execution — *Doing the work*

- Lives in `execution/` as **deterministic Python scripts**
- Responsibilities: API calls · data processing · file operations · database interactions
- Secrets and tokens live exclusively in `.env` — never hardcoded
- Scripts must be: **well-commented · independently testable · fast · reusable**
- **Never do manually what a script can do reliably**

---

## ⚙️ Why This Architecture Works

Compounding errors are the enemy of agentic systems.

| Steps | Per-step accuracy | Cumulative success |
|-------|------------------|--------------------|
| 5     | 90%              | ~59%               |
| 5     | 99%              | ~95%               |

**The fix:** Push complexity into deterministic Layer 3 code. Your job shrinks to pure decision-making, where you're actually reliable.

---

## 📐 Operating Principles

### 1. Check Before Creating
Before writing any new script:
1. Search `execution/` for an existing script that covers the need
2. Adapt an existing script if it's close
3. Create a new script **only** when nothing suitable exists

### 2. All Execution is Python
Every deterministic task belongs in a Python script — no exceptions.

- Example: Fetching GHL API data, transforming it, and outputting JSON for a 3D renderer → that's a Python script in `execution/`, not inline code

### 3. Map to the 4-Stage Dashboard Process
When working within the web app's guided workflow, align layers to stages:

| Stage | Maps To | Layer Role |
|-------|---------|------------|
| **Framework** | Layer 1 | Directives establish the foundation |
| **Planning** | Layer 2 | Orchestration sequences the steps |
| **Testing** | Layer 3 | Python scripts run simulations |
| **Deploying** | Layer 3 ↗ | Python handles rollout & monitoring |

### 4. Escalate Intelligently
If a directive is ambiguous, an input is missing, or an execution script fails:
- **Do not guess.** Surface the blocker immediately with a clear question
- Update the relevant directive with the resolution once clarified
- Log edge cases encountered so future runs benefit

### 5. Maintain Clean Separation
| Do ✅ | Don't ❌ |
|-------|---------|
| Read directives before acting | Improvise outside directive scope |
| Invoke scripts for execution | Perform execution inline |
| Update directives when you learn | Repeat avoidable mistakes |
| Ask when uncertain | Infer silently and proceed |

---

## 📁 Directory Reference

```
/
├── directives/          # Layer 1 — Markdown SOPs (what to do)
├── execution/           # Layer 3 — Python scripts (how to do it)
├── .env                 # Secrets, API keys, tokens (never commit)
└── CLAUDE.md            # This file — your operating manual
```

---

*Keep this file updated. If you discover a gap in these instructions while working, flag it and suggest an edit.*
