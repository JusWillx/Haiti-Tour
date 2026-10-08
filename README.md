# Ayiti — Haiti from Above · rebuilt V2

**Path B · Tour_Lab**, with the supplied Flight_Lab movement core for a practice-flight mode. The active app starts with real satellite imagery and offers optional 3D elevation through **CesiumJS 1.145.0**. The old grid is removed.

## View it on GitHub Pages

1. Extract the ZIP completely. Open the inner `Haiti_History_Lab` folder.
2. Replace the old repository files with these files and folders. Keep `index.html`, `app.js`, `style.css`, `places.js`, `view-core.js`, `assets/`, and **`vendor/`** at the repository root. The bundled engine will not load if vendor is omitted. Include the assignment documents and evidence too.
3. Commit the changes on `main`. Add the empty `.nojekyll` file using **Add file → Create new file** if your upload interface hides it.
4. In **Settings → Pages**, select **Deploy from a branch → main → /(root) → Save**.
5. Wait for the Pages deployment to succeed in Actions. Open the URL shown in Settings → Pages. It should display **REBUILT · V2** in the desktop header.
6. Hard-refresh the published page with Ctrl+Shift+R if the older design appears. Open `tests.html` at the same site path to run the browser rule tests.

If GitHub reports that a batch contains too many files, upload the project files and the vendor folder in separate commits, or use GitHub Desktop to commit the extracted folder. Do not upload only the ZIP: Pages needs its extracted contents. This ZIP replaces the prior project; it does not directly modify an existing GitHub repository or publish a site.

## Run locally

Open a terminal in the folder containing index.html:

```sh
# Windows
py -m http.server 8000
# macOS / Linux
python3 -m http.server 8000
```

Keep the terminal open and visit `http://localhost:8000/index.html`, then `http://localhost:8000/tests.html`. Stop with Ctrl+C. Use another port in both command and URL if 8000 is busy. No npm install, ion token, or API key is required for the configured public services. Internet access and WebGL are required for the interactive view; fonts use the operating system, and the Cesium engine is bundled locally.

## What changed

- Satellite imagery replaces GridImageryProvider. `UrlTemplateImageryProvider` loads cached Esri satellite tiles directly, starting at a close-up level in a small geographic rectangle around the selected stop. Wider-area `ArcGisMapServerImageryProvider` tiles load only when you drag, zoom out, or enter Flight mode. This avoids making the first landmark view wait for the whole background tile pyramid.
- **3D terrain** is off initially for a quicker landmark view. Turn it on to stream elevation through `ArcGISTiledElevationTerrainProvider`. Stop elevations are sampled at a bounded level before recentering. A satellite preview stays available while terrain detail streams; turning it off returns to the flat satellite view.
- The camera starts above the Citadelle. **Tilt view**, **From above**, **Recenter**, zoom, and optional lighter graphics controls are provided.
- Stop text and selection update immediately. Normal camera transitions are 0.8 seconds. The assignment’s useful feature, **Slow Tour**, deliberately changes future transitions to 6 seconds. Reduced-motion preferences skip transitions.
- `requestRenderMode` and `maximumRenderTimeChange: Infinity` reduce unnecessary idle GPU rendering. Target rate is 30 FPS; lighter graphics uses 24 FPS and 70% resolution. Shadows, animated sky effects, and unused widgets are disabled.
- No flight RAF loop runs while paused or in the history tour. Flight coordinates/aircraft update only during active flight; the text HUD updates at most roughly every 150 ms. Sliders are not rewritten each frame.
- The desktop map uses the available viewport beside a scrollable sidebar. On screens under 700px, the map appears above the controls. Touch turn/climb/descend controls supplement the keyboard.
- A satellite image preview and explicit error message remain available when the engine, imagery service, or WebGL fails. Failed 3D rendering is never presented as a successful 3D demonstration.

## What the map represents

Satellite imagery shows actual roofs, vegetation, and land at the stop coordinates; elevation can give the landscape a 3D shape. These layers **do not contain detailed, photorealistic monument meshes**. No downloaded 3D scans of the Citadelle or Sans-Souci are included. Imagery resolution/date and elevation accuracy depend on the upstream services. The flight is spherical camera movement, not aircraft physics, travel advice, or collision simulation. Heights are above the ellipsoid, not guaranteed clearance above local terrain.

The third stop is a **National History Park overview**, using UNESCO’s property reference point. It is not a fabricated Ramiers coordinate. The historical records and their 2026-10-05 source checks are retained. The rebuilt services were checked on 2026-10-08 UTC. Follow each stop’s source links before sharing.

## Pitch

“I want to help cybersecurity students and people interested in Haitian heritage explore Haiti’s historical landmarks and evaluate source reliability using cited historical and geographic data.” Before sharing, I will verify source provenance, coordinate limitations, incomplete-record behavior, and the real browser result.

## Files and tests

| Files | Purpose |
|---|---|
| index.html, style.css, app.js | Responsive UI and Cesium integration |
| places.js, descriptions/ | Three sourced records and matching description files |
| tour-core.js, flight-core.js, view-core.js | Testable navigation, movement, camera and imagery helpers |
| vendor/cesium/, assets/ | Pinned Cesium runtime resources, Apache license, aircraft icon |
| tests.html, tests.js, flight-tests.js, feature-tests.js, view-tests.js | Browser rule checks |
| ui-logic-tests.js | Node DOM/Cesium doubles for integration logic, not rendering evidence |
| run-tests.js, break-and-repair.js | Node suite and required missing-data exercise |
| originals/ | Untouched supplied starters |
| Test_Log.csv, evidence/ | Actual results and limits |
| Sources.md, AI_Excerpts.md, Reflection.md, Partner_Review.md | Assignment documentation |

With Node 18+ installed, run `node run-tests.js`. The site itself does not require Node. The 12 Tour and 7 Flight checks are retained; added tests cover the rebuild. Review Test_Log.csv for the current counts, browser evidence, and pending items.

## First checkpoint and break/repair

Original starter checks and the original fallback checkpoint are recorded in `evidence/original-tests.txt`. The untouched starter can be opened at `originals/Tour_Lab/index.html`. Earlier Node-double evidence was not a successful original WebGL demonstration.

Run `node break-and-repair.js`. A disposable copy blanks the first historical source. Validation warns `missing source`, the final Tour data test fails, and restoring identical original bytes returns all 12 tests to PASS. The production data is not left broken. Browser break-and-repair evidence, when performed, is listed separately in the log.

## Assignment items the student must complete

Read the actual Canvas page 4 warm-up and page 6 manual checklist; neither was supplied. Compare the six proposed checks in Manual_Checks.md with your instructor’s exact list. Have a **real partner** follow this README and record one improvement. Review the AI excerpts and reflection draft for your own contribution and understanding. Check the Canvas deadline and whether your instructor requires publishing. No partner participation or unperformed checks are claimed.

## Attribution

Imagery and elevation credits remain visible inside the Cesium view. External service endpoints, verification notes, and API documentation are in Sources.md. CesiumJS is Apache-2.0 licensed; its license and notices are preserved in vendor/cesium/LICENSE.md and the runtime files. The bundled resource subset supports this application’s configured terrain and imagery; it is not a full general-purpose Cesium distribution.

## Browser-test reproduction (optional developer step)

The main site needs no npm packages. To reproduce the browser verification script, install Playwright separately (`npm install --no-save playwright`, then `npx playwright install chromium`) and run `node verification/browser-tests.js`. Python 3 is required only if you deliberately enable its container network relay. The verification script creates a local test server and does not publish the site.
