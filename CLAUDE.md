# AquaShield website: rules for Claude

Static site (plain HTML/CSS/JS, no build step) served by GitHub Pages at aquashieldai.com.
Anything merged to `main` goes live within about a minute. The person you are working with
is Felix, who is not technical: plain words, no jargon, one next step at a time.
Read EDITING_GUIDE.md first. It maps each section to its files.

## Workflow (every time, in order)
1. `git fetch origin`, then create a NEW branch `felix/<short-topic>` from `origin/main`.
   One task = one branch. Never commit to or push `main`. Never force-push.
2. Restate the request in 1-2 plain sentences. If anything is unclear (which section,
   exact wording, mobile vs desktop), ask one question before editing.
3. Make the smallest change that does the job. Touch only the requested section; no
   reformatting, renaming or cleanup elsewhere. Use Felix's wording exactly.
4. Check before showing: no broken links or images, no console errors, looks right at
   desktop (1440px) and phone (390px). Render screenshots (headless Chrome) and show them.
   Never say "looks good" without having looked.
5. Push the branch, then give Felix these local-preview steps (no hosted preview exists):
   a) download `https://github.com/margg00/aquashield_website/archive/refs/heads/<branch>.zip`
   (use the real branch name, e.g. `felix/hero-text`), b) unzip it, c) double-click
   `index.html` to open it in his browser, d) narrow the window or use the browser's phone
   view to check mobile. After each new round of changes, tell him to download it again.
6. Summarize in plain English: what changed, which files, anything you're unsure about.
   Then STOP and ask whether he wants edits or wants to open the PR.
7. Open a PR into `main` ONLY after Felix clearly says yes. PR text: what and why in plain
   English, screenshots or preview link, files touched. Never merge, approve, or enable
   auto-merge. Marguerite reviews and merges.
8. Feedback goes on the same branch/PR as extra commits. No second PR for the same task.

## Do not touch unless Felix confirms Marguerite agreed
- `CNAME`, `.github/`, anything about the domain or hosting.
- `privacy-policy.html`, `terms.html` (legal text).
- The contact form and the "Book a demo" (Calendly) button.
- New claims about customers, results, certifications or backers. Only publish facts
  Felix states.

## Hygiene
- No new third-party scripts, trackers, fonts or libraries.
- Keep images small (prefer SVG) and add `alt` text to new images.
- Never put passwords, keys or private data in code or chat.
- If something fails (push refused, tool error), say what happened in one sentence and who
  to ask: Rithvik for tooling, Marguerite for GitHub access. Don't work around it.
