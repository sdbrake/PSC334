# Chartroom Course Library

A reusable, plain-HTML lecture review website. Navy lecture sidebar, paper-colored viewer, Previous/Next controls, slide counter, and fullscreen. There is no framework, build step, database, CDN, Google Apps Script, or account system.

## Open it

Double-click **index.html** to open in Chrome or Edge. Keep the folder together: index.html needs the other files beside it. The website also works on an ordinary static web host such as GitHub Pages. This copy has not been published.

The initial demo uses POLI 433 / International Political Economy, with the existing **Three Schools of IPE** chartroom lecture and 13 clearly unnamed Coming soon slots. Their order and names are placeholders, not a proposed syllabus. Change the course code if needed.

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

4. Add its path to course.js.
5. Open the library, click that lecture, try the controls, then select it again to confirm it starts at slide one.

The supported deck structure is a fixed-size `#canvas` containing slides with class `.s`; the active slide uses `.on`. The player reads the canvas dimensions, scales it to fit, and centers it. Standard chartroom bullet reveals (`.rail .f` and `.rail .conseq`) are shown immediately for review. Different slide frameworks require their own adapter; simply linking an arbitrary HTML URL is not enough to connect navigation.

All lecture files should live in this website folder / on the same web origin. Cross-origin embeds are intentionally not accepted by the control bridge. Use only trusted, professor-authored HTML; this is not an untrusted-file upload service.

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

The demo lecture's author content and CSS are copied from:

`Lecture Slides/Three Schools of IPE/Three Schools of IPE - chartroom.html`

Only its old navigation script was replaced in the review copy. The source teaching deck was left untouched. The shared review player changes active-slide state, bullet reveal state, scaling, accessibility attributes, and transitions at runtime; it does not rewrite lecture wording.

## Development checks (optional)

Node and Playwright are only needed to run the tests, not to use the website. The included tests launch locally installed Chrome on Windows. Change the executable path in tests if needed.

From this folder:

```bash
node tests/library.test.cjs
node tests/visual-audit.cjs
```

For HTTP and alternate-course checks, start a local server:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Then in another terminal:

```bash
LIBRARY_URL=http://127.0.0.1:8765/ node tests/library.test.cjs
node tests/reuse.test.cjs
```

The reuse tests override course.js **in the test browser only**, using explicitly synthetic course labels. They do not change the real course file. The visual audit checks all 16 source slides for text crossing the canvas boundary and saves screenshots under tests/screenshots/.
