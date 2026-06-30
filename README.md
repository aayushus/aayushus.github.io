# aayushus.github.io — AI-First SDLC Playbook

A static, no-build documentation site describing an AI-first software development
lifecycle: seven named Devin agents (Builder, Reviewer, Tester, Fixer, Shipper,
Maintainer, InfoSec) running headlessly across Jira, GitHub, Microsoft Teams, and
Confluence. Published with GitHub Pages at https://aayushus.github.io/.

## Structure

```
index.html        Chapter 01 · Overview (landing page)
pipeline.html     Chapter 02 · The Pipeline (Mermaid diagrams)
workflow.html     Chapter 03 · The Workflow (today vs. AI-first, per phase)
devin.html        Chapter 04 · Devin Playbook (features per phase)
agents.html       Chapter 05 · Agent Roster
sop.html          Chapter 06 · Operating Procedure
setup.html        Chapter 07 · Setup Guide (standalone, hand-written)
assets/
  book.css        Shared design system / all styles
  nav.js          Shared nav, section renderers, scroll-spy, localStorage state
  data.js         Site content as JS objects (phases, agents, SOP, stats)
sdlc/             Redirect stubs from the old /sdlc/ URL path → repo root
```

## How to edit content

Most content lives in **`assets/data.js`** as plain JS objects, and every page
(except `index.html` and `setup.html`) renders from it:

- `phases` — the SDLC phases shown in `workflow.html` and `devin.html`
- `agents` — the agent roster shown in `agents.html` (and the SOP quick reference)
- `sopSections` — the chapters rendered in `sop.html`
- `statsData` — the stat strips on several pages

Edit `data.js` and the change shows up everywhere that reads it — no build step.

Two pages carry their own content inline: `index.html` (the hero + hardcoded agent
cards) and `setup.html` (the full standalone setup guide). Keep these in sync with
`data.js` by hand when agent names, schedules, or labels change.

Chapters and the sidebar order are defined by the `CHAPTERS` array in
**`assets/nav.js`**; every page calls `mountBook()` as its last script step to wire
up the nav, prev/next, and scroll-spy.

## Running locally

It's pure static HTML/CSS/JS — open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deployment

Served by GitHub Pages from this repo (the `aayushus.github.io` user site). Pushing
to the default branch publishes automatically; there is no build pipeline. The
`pipeline.html` diagrams and the pan/zoom controls load `mermaid` and `svg-pan-zoom`
from the jsDelivr CDN at runtime. Visitor counts use GoatCounter
(`GOATCOUNTER_CODE` in `assets/nav.js`).
