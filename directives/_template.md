# Directive: [Directive Name]

> **Layer 1 — Directive**
> This file describes *what* to do. The orchestrator (Claude) reads this and invokes the appropriate Layer 3 scripts.

---

## 📌 Objective

_One-sentence summary of what this directive accomplishes._

---

## 📥 Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param_1` | string | ✅ | Description of param_1 |
| `param_2` | string | ❌ | Description of param_2 (optional) |

---

## 🛠️ Scripts to Invoke

> Check `execution/` before creating new scripts.

| Order | Script | Purpose |
|-------|--------|---------|
| 1 | `execution/script_name.py` | What it does |
| 2 | `execution/another_script.py` | What it does |

### Invocation Example

```bash
python execution/script_name.py --input "value" --output outputs/result.json
```

---

## 📤 Expected Outputs

| Output | Location | Format | Description |
|--------|----------|--------|-------------|
| Result file | `outputs/result.json` | JSON | Description of the output |

---

## ⚠️ Edge Cases & Error Handling

- **Case 1:** What happens if X is missing → expected behaviour / fallback
- **Case 2:** What happens if the script fails → escalate, do not guess
- **Case 3:** Rate limits / timeouts → retry logic in the script, not here

---

## 📝 Notes & Learnings

_Update this section after each run with anything that improves future executions._

- [ ] _(empty — add learnings here)_
