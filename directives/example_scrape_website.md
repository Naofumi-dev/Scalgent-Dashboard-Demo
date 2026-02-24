# Directive: Scrape a Single Website

> **Layer 1 — Directive**
> This file describes *what* to do. The orchestrator (Claude) reads this and invokes the appropriate Layer 3 scripts.

---

## 📌 Objective

Fetch a single URL, extract the page title and main body text, and save the result as a structured JSON file in `outputs/`.

---

## 📥 Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | ✅ | The full URL to scrape (e.g. `https://example.com`) |
| `output_filename` | string | ❌ | Custom output filename. Defaults to `scraped_<timestamp>.json` |

---

## 🛠️ Scripts to Invoke

| Order | Script | Purpose |
|-------|--------|---------|
| 1 | `execution/scrape_single_site.py` | Fetch the URL, extract content, write JSON output |

### Invocation Example

```bash
python execution/scrape_single_site.py --url "https://example.com" --output outputs/result.json
```

---

## 📤 Expected Outputs

| Output | Location | Format | Description |
|--------|----------|--------|-------------|
| Scraped data | `outputs/scraped_<timestamp>.json` | JSON | Contains `url`, `title`, `body_text`, `scraped_at` |

### Output Schema

```json
{
  "url": "https://example.com",
  "title": "Page Title",
  "body_text": "Extracted plain text from the page...",
  "scraped_at": "2026-02-23T21:57:30+08:00"
}
```

---

## ⚠️ Edge Cases & Error Handling

- **URL unreachable:** Script returns a JSON error object with `status: "failed"` and the HTTP status code. Do not retry more than 2 times.
- **No `<body>` tag found:** Return whatever text was extractable; log a warning.
- **Rate limiting (429):** Surface the blocker — ask the user whether to wait and retry or abort.
- **Missing `--url` argument:** Script will exit with a usage error; re-invoke with correct args.

---

## 📝 Notes & Learnings

_Update this section after each run with anything that improves future executions._

- [ ] _(empty — add learnings here)_
