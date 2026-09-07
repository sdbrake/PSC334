# PSC 334 — Chartroom Course Library

A reusable, plain-HTML lecture review website. Navy lecture sidebar, paper-colored viewer, Previous/Next controls, slide counter, and fullscreen. There is no framework, build step, database, CDN, Google Apps Script, or account system.

## START HERE — the important distinction

**Teach from the originals. Give students the separate review copies. Do not replace the navigation script in a teaching original.**

This folder is the **PSC 334 student review website**, not the master copy of your teaching lectures.

| Location (under `HermesAssistant/`) | What it is | What to do with it |
| --- | --- | --- |
| `Lecture Slides/` | Original teaching lectures — the source of truth | Teach from these; make your lecture revisions here. |
| `IPE Course Library/` | The current five-lecture student review website | Open its `index.html` to browse the library. |
| `IPE Course Library/lectures/` | Separate review copies and images | Prepare copies here for students, never move the originals here. |
| `Course Library/` | Earlier one-lecture design prototype | Reference only; use `IPE Course Library/` for this course. |
| `IPE Course Library - portable.zip` | A packaged snapshot of the review website | Extract the whole ZIP before opening `index.html`; it is not a live/synced copy. |

### What is different about review copies?

- Teaching originals keep their existing classroom behavior, including stepwise reveals and saved position where implemented.
- Review copies show every bullet immediately, do not restore saved teaching positions, and work with the website's Previous/Next buttons.
- Selecting a lecture in the website always starts at the beginning.
- **The two copies do not automatically sync.** Editing a teaching deck does not update the review copy or a previously downloaded ZIP.

### Quick answers for future you

- **I want to teach:** open the original HTML in `Lecture Slides/`.
- **I want to preview the student website:** open `IPE Course Library/index.html`.
- **I want to change the course number, a sidebar title, or lecture order:** edit `course.js`, not `library.js`.
- **I want to add a lecture:** copy its HTML and images into `lectures/`, replace the copied navigation script as described below, then add its path to `course.js`.
- **I want to correct lecture content:** revise the original first, then refresh its review copy using the checklist below.
- **I want to use this for another class:** duplicate the whole website folder, then edit `course.js`; keep each class's copy separate.

## Open it

Double-click **index.html** to open in Chrome or Edge. Keep the folder together: index.html needs the other files beside it. The website also works on an ordinary static web host such as GitHub Pages. This copy has not been published.

This is the five-lecture **PSC 334 / International Political Economy** edition. The approved one-lecture prototype remains in the separate `Course Library` folder.

| Order | Sidebar title | Slides | Source deck |
| --- | --- | --- | --- |
| 01 | What is IPE? | 11 | What is IPE - chartroom.html |
| 02 | Three Schools of IPE | 16 | Three Schools of IPE - chartroom.html |
| 03 | WTO System | 26 | The Rise of the WTO System - slides.html |
| 04 | Corn Laws | 31 | Examining the Corn Laws - slides.html |
| 05 | Global Growth and Inequality | 42 | Global Growth and Inequality - slides.html |

Slots 06–14 remain Coming soon. **126 slides total.** Sidebar titles follow the requested list; the original titles inside the decks are preserved.

## What you normally edit

| File | Purpose |
| --- | --- |
| **course.js** | Course name, course code, subtitle, ordered lecture titles, and paths. This is the main editing file. |
| **library.css** | Website appearance. The first block holds the color, type, and sidebar-width settings. |
| **lectures/** | One folder per lecture, including its HTML and any images. |
| index.html | Semantic page layout; normally leave alone. |
| library.js | Sidebar, loading, external controls, fullscreen, and mobile menu; normally leave alone. |
| deck-player.js | Shared review player for chartroom decks; normally leave alone. |
| tests/ | Development tests and screenshots. Not required for viewing or publishing. |

## Reuse for another class

1. Duplicate this website folder (you can omit tests/).
2. Edit **course.js** with a text editor: change `title`, `code`, and `subtitle`.
3. Replace the entries in `lectures` with that class's lecture list.
4. Put the class's prepared lecture folders inside `lectures/`.
5. Open index.html and test the links. There is no fixed lecture limit.

Example of an available lecture:

```js
{ title: "Three Schools of IPE", file: "lectures/three-schools/index.html" },
```

Example of a lecture not yet ready:

```js
{ title: "Your lecture title", file: null },
```

`null` means **Coming soon**. Those entries remain visible but cannot be selected. To reorder lectures, reorder the lines. Use forward slashes in paths and keep the trailing commas as shown. Paths and filenames are case-sensitive on many web hosts. Relative paths make the whole folder movable to a different class or website address.

## Add an existing chartroom lecture

The shell is reusable across classes. Its bundled player specifically understands your **chartroom markup**, not every HTML presentation framework.

1. **Copy**, do not move, the lecture into a new folder such as `lectures/trade-theory/`. Copy its `images/` folder too, keeping the same relative layout. Do not edit the teaching original.
2. Name the copied HTML `index.html` (or use its actual filename in course.js).
3. In this **review copy**, replace the old final navigation `<script> ... </script>` block with this single line:

   ```html
   <script src="../../deck-player.js"></script>
   ```

   Replace the old navigation code; don't leave both players running. Keep unrelated content scripts only if you know they don't control slides. The test lecture is a working example of the exact replacement.

4. Edit `course.js`. For example, replace a future slot:

   ```js
   { title: "Lecture 06", file: null },
   ```

   with the path to your prepared review copy:

   ```js
   { title: "Your lecture title", file: "lectures/trade-theory/index.html" },
   ```

   Use `null` until it is ready. Numbering comes from the list order; do not type the number into the title.
5. Open the library, click that lecture, try the controls, then select it again to confirm it starts at slide one.

The supported deck structure is a fixed-size `#canvas` containing slides with class `.s`; the active slide uses `.on`. The player reads the canvas dimensions, scales it to fit, and centers it. Standard chartroom bullet reveals (`.rail .f` and `.rail .conseq`) are shown immediately for review. Different slide frameworks require their own adapter; simply linking an arbitrary HTML URL is not enough to connect navigation.

All lecture files should live in this website folder / on the same web origin. Cross-origin embeds are intentionally not accepted by the control bridge. Use only trusted, professor-authored HTML; this is not an untrusted-file upload service.

## Updating a lecture after you have revised it

1. Make and save the revision in the **teaching original** under `Lecture Slides/`.
2. Keep a backup of its current review folder before replacing anything.
3. Copy the revised HTML and any changed/new images into the matching `IPE Course Library/lectures/` folder. Keep the destination filename/path the same so `course.js` still points to it.
4. **Replace the old navigation script again in the new review copy.** Copying a fresh teaching HTML file also copies its teaching player back in. Use the single `../../deck-player.js` script line shown above, in place of the old navigation block.
5. Check for review-only layout adjustments before discarding the backup. In the included Global Growth and Inequality deck, `review-compact` is a spacing fix for **Convergence is uncommon**. Preserve/reapply it if still needed; do not copy it back into the original automatically.
6. Open the library. Check changed slides, images, Previous/Next, and that reselecting the lecture returns to slide one.
7. If publishing, upload/push the revised review HTML and any changed assets to the same website location. The professor handles publishing. No Apps Script redeployment is involved.
8. If sharing a ZIP, make a new ZIP from the current website files. **An old ZIP will still contain old content.**

### Quick troubleshooting

| Symptom | First thing to check |
| --- | --- |
| Lecture says Coming soon | Its `course.js` entry still has `file: null`. |
| Lecture will not load | The configured path and capitalization match the actual HTML file; the review copy links to `deck-player.js`. |
| Buttons do nothing or each press only reveals one bullet | The old teaching navigation script may still be present. Replace it in the review copy only. |
| Images are missing | Their files were copied too, with the same relative locations and exact filenames. |
| Website still shows old text | Update the review copy, not just the original; if hosted, publish it and refresh the browser. |
| ZIP still shows old text | Repackage the current website; ZIP files do not update themselves. |
| Live site has the wrong course number | This course is **PSC 334**. Check the published `course.js`, not an old prototype or ZIP. |

## Student behavior

- The first available lecture opens automatically, at slide one.
- Every lecture click reloads from the beginning, even if it was already selected.
- Previous/Next means one whole slide, never one bullet.
- Keyboard: Left/Right, Page Up/Page Down, Home/End; Space advances unless a button or link is focused.
- Navigation stops at each end. It never jumps to another lecture.
- The player does not read or write teaching-mode saved positions.
- Full screen keeps the controls visible. Exit using Escape or **Exit full screen**. If the browser denies native fullscreen, a page-filling focus view is used instead.
- On narrow screens the lecture list becomes a collapsible menu. Landscape/fullscreen is best for reading dense slides on a phone: fixed-layout slides scale down, rather than being rewritten or reflowed.
- An unavailable or incorrectly prepared lecture produces an error message rather than an endless spinner.

## Publishing (professor handles this)

Copy these into the destination site folder:

- index.html
- course.js
- library.css
- library.js
- deck-player.js
- lectures/ and its assets

README.md is optional. Do **not** publish `tests/`, `node_modules/`, or npm caches. No Apps Script setup or new-version deployment is needed. Nothing has been pushed or deployed by the assistant.

A public GitHub Pages site is public: only publish material intended for public access. The library itself does not add a login.

## Original lecture preservation

All five decks were copied from their matching folders under `Lecture Slides/`. Their original files and images were left untouched. Each review copy uses the shared navigation script instead of the old teaching script; lecture wording is preserved exactly.

One review-only spacing repair was needed: slide 8, **Convergence is uncommon**, in Global Growth and Inequality has tighter vertical spacing to keep its last sentence within the canvas. This is clearly marked `review-compact` in that copied HTML file. No words were changed or removed.

The fallback fullscreen view keeps Tab focus within the presentation and temporarily makes covered page controls inert. On exit it restores the page controls and returns focus to Full screen.

## Development verification (optional)

The website needs no development dependencies. `tests/` is excluded from the portable ZIP.

The focused browser script `tests/course.test.cjs` checks the five-lecture order, every slide, local images, bullet reveals, restart-on-selection, mobile menu and fallback fullscreen focus. It runs installed Chrome on Windows. The source manifest records original-file hashes for preservation checks.

These are **ad-hoc verification scripts**, not a canonical build or test suite.

If you want to run them in a copied development folder:

```bash
npm install --prefix tests playwright
node tests/course.test.cjs
```

On this machine the script can also use the prototype's existing Playwright installation. To check HTTP hosting, start a server:

```bash
python -m http.server 8766 --bind 127.0.0.1
```

Then, in another terminal:

```bash
LIBRARY_URL=http://127.0.0.1:8766/ node tests/course.test.cjs
```
