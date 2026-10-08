# Ayiti — History from Above

A Haiti history tour with an educational practice-flight mode, adapted from the supplied **Tour_Lab (Path B)**. The supplied Flight_Lab movement core powers the optional simulation. No build tools, npm packages, ion token, or API key are needed to use the site.

## Pitch

“I want to help cybersecurity students and people interested in Haitian heritage explore Haiti’s historical landmarks and practice evaluating source reliability using cited historical and geographic data.” Before sharing, I will verify the historical claims, coordinate provenance, and missing-data behavior, and complete browser checks with a partner.

## Exact run steps

1. Extract `Haiti_History_Lab.zip` completely.
2. Open a terminal inside the extracted `Haiti_History_Lab` folder (the folder containing `index.html`). On Windows, open that folder in File Explorer, type `powershell` in the address bar, and press Enter.
3. Run `py -m http.server 8000` on Windows, or `python3 -m http.server 8000` on macOS/Linux. Install Python 3 from python.org if that command is unavailable. Keep the terminal open.
4. Open **http://localhost:8000/index.html** in Chrome, Edge, or Firefox.
5. Open **http://localhost:8000/tests.html** for the 12 Tour checks, 7 Flight checks, and 9 added checks. These tests do not require Cesium to load.
6. Stop the server with Ctrl+C when finished. If port 8000 is busy, use 8001 in both the command and URL.

The Cesium JavaScript and widget CSS are pinned to **CesiumJS 1.145**, matching the supplied starters. Internet access and WebGL are required for the globe. Fonts also load from Google Fonts, with local font fallbacks. If the CDN or WebGL fails, the stop descriptions, controls, source links, and coordinate plot remain available. This does not count as a successful WebGL demonstration. Do not double-click index.html as the official run method.

## First original-starter checkpoint

The untouched supplied files are in `originals/Tour_Lab` and `originals/Flight_Lab`. Run the server from the project root and open **http://localhost:8000/originals/Tour_Lab/index.html** before examining the modified page.

On 2026-10-05, the original Tour rules passed 12/12 checks in Node. A Node DOM-double check executed the original app without Cesium and confirmed that “Example Stop 1 — Welcome” and the CDN-failure message appeared in its text state. Evidence: `evidence/original-tests.txt` and the first row of `evidence/ui-logic-tests.txt`. This is a code-level fallback checkpoint, **not a browser or WebGL checkpoint**. The browser preview was blocked and a local browser executable could not be installed. Student/partner must record the first successful browser checkpoint in `Test_Log.csv`.

## How to use it

- History tour: Previous/Next or numbered stop buttons select a stop and fly the camera.
- **Small observable improvement:** Slow Tour changes future camera transitions from **2 to 6 seconds**. Toggle it, then choose the next stop. If the OS requests reduced motion, the transition is immediate regardless of this setting.
- Check the evidence: expand the source panel for history and coordinate links, date checked, and coordinate limitations.
- Practice flight: begins paused at the selected stop. Use the heading, speed, and altitude sliders; Start/Pause and Reset control movement. Arrow keys turn/change altitude, and Space pauses when focus is outside form controls. Switching back to History Tour or hiding the tab pauses movement.
- Flight movement uses distance = speed × elapsed seconds. The frame interval is capped at 0.1 seconds to prevent jumps after a stalled frame; simulated time can run slower than real time on a slow device.

The UI uses Haitian flag blue `#00209f`, red `#d21034`, and white. The globe is the starter’s grid globe. It does not show roads, terrain, buildings, or satellite imagery. The simulated aircraft is a point marker, not a 3D aircraft model. The fallback is a coordinate plot, not a map with surveyed boundaries.

## Stops and geographic care

1. Citadelle Laferrière — UNESCO historical account; GeoNames approximate coordinate.
2. Palais Sans-Souci — UNESCO historical account; Wikidata coordinate imported from German Wikipedia, openly labeled as approximate.
3. National History Park — UNESCO historical account and property reference coordinate. This is a park overview, **not a claimed Ramiers coordinate**.

All records were checked on **2026-10-05**. `places.js` is the runtime data source. Three Markdown files in `descriptions/` mirror its descriptions for submission. `Sources.md` records exact URLs, coordinate conversions, and limitations. A bounding box catches many swapped coordinates; it is not a Haiti boundary or an independent proof of accuracy.

## Code and checks

| File | Purpose |
|---|---|
| index.html / style.css | Responsive blue/red/white interface |
| places.js | Three sourced stop records |
| tour-core.js | Starter navigation/validation, Haiti bounds, Slow Tour duration |
| flight-core.js | Supplied spherical movement, Haiti starting point |
| app.js | UI, Cesium globe, flight controls, safe text rendering, fallback |
| tests.html / tests.js | Original Tour suite adapted to Haiti, 12 checks |
| flight-tests.js | Original Flight suite, 7 checks |
| feature-tests.js | 9 added data/feature checks |
| ui-logic-tests.js | 10 Node DOM/Cesium-double integration checks; no actual browser |
| break-and-repair.js | Missing-source exercise on a disposable copy |
| Test_Log.csv / evidence/ | Actual outcomes and honest pending items |
| AI_Excerpts.md / Reflection.md | AI collaboration record and reflection draft |
| Partner_Review.md | Uncompleted partner reproduction form |

Optional Node 18+ command-line checks (no npm install):

```sh
node run-tests.js
```

Completed: **38 checks passed** (12 Tour + 7 Flight + 9 feature + 10 UI logic), plus the original 12-check baseline and required missing-data break/repair. Node execution is not evidence that tests.html has been opened in a browser. See `Manual_Checks.md` for six proposed Tour demonstrations and browser evidence to add. The assignment’s page 4 and page 6 were not provided; reconcile this checklist with those pages in Canvas. No claim is made that their exact warm-up or manual checks were completed.

## Required missing-data break and repair

Run `node break-and-repair.js` to reproduce the safe automated exercise: a temporary copy removes the first historical `source`, the warning is `missing source`, and “Every record in places.js is usable” fails. Restore the original bytes and all 12 tests pass. Evidence: `evidence/break-and-repair.txt`. The UI-double check also confirms that the incomplete stop is excluded.

For the browser exercise, back up places.js, temporarily set the first `source` to `""`, reload index.html and tests.html, and capture the visible warning and failed test. Restore the original source, reload, and capture the clean result. Do not leave broken data in the submitted ZIP.

## Before submission

Review `Submission_Checklist.md`. The student must complete the Canvas warm-up, successful original browser checkpoint, six actual browser checks, tests.html observation, browser break/repair screenshots, and real partner review. Fill in actual outcomes and evidence; do not replace pending results with assumed passes. The reflection is a 150–250 word draft, and the AI excerpts report this actual session rather than invented exchanges.

Publishing is optional in the supplied assignment; no hosted site is included. This project is designed to run locally and can be uploaded to a static host later. Confirm your instructor’s Canvas due date yourself.

## Limitation and major connection

This is not a real flight trainer or travel guide. It omits terrain, weather, aircraft physics, current access conditions, and collision detection. Historical source checks and input validation model cybersecurity habits, but a complete record or HTTPS URL does not establish truth or trustworthiness. Student review and partner/browser verification remain necessary.
