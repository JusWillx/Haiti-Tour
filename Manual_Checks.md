# Browser test plan — six proposed Path B checks

The assignment references page 6, which was not attached. These are a concrete plan, not a claim that these are its exact six checks. Compare with Canvas and add/adjust rows if needed. All six remain PENDING for a real browser.

| ID | Action | Expected result | Evidence to record |
|---|---|---|---|
| M1 | Run original Tour_Lab, then open modified index.html | Original first stop and globe load; modified page shows Citadelle and three numbered buttons, no warnings | Screenshots, browser/version, actual checkpoint time |
| M2 | Click Next through three stops, then Previous at stop 1; try numbered buttons | Details/count/selected button update; Next/Previous wrap correctly; camera arrives at corresponding marker | Before/after screenshot and notes |
| M3 | Expand evidence panel at every stop | Working history and coordinate links, 2026-10-05 checked date, approximate coordinate notes; park stop is labeled overview | Screenshots/link observation |
| M4 | Enable Slow Tour and click Next; disable and repeat; test reduced-motion preference | Future transitions use roughly 6 vs 2 seconds; button state updates; reduced motion uses immediate transitions | Screen recording or measured times and preference state |
| M5 | Backup places.js; blank first source; reload index.html and tests.html; restore and reload | Warning names missing source, stop excluded, final Tour test fails; after repair warning disappears and all 12 pass | Warning/test failure and repair screenshots |
| M6 | Resize to phone width, use Tab/buttons, then block Cesium.js or use a device without WebGL | Controls remain usable; missing globe is announced; history/source/navigation work in fallback; no false claim of 3D rendering | Desktop/mobile screenshots and fallback notes |

Also open tests.html and record actual 12/12 Tour, 7/7 Flight, and 9/9 feature outcomes. Node results are already attached, but do not substitute them for this observation.

## Optional practice-flight demonstration

Start paused at selected stop; start/pause; turn with heading slider and arrows; change altitude/speed; zero speed stops movement; Reset restores selected stop; hiding the tab pauses. Confirm this in a real browser. The point marker and spherical motion are simulated; no terrain collision or aircraft physics is included.

## Partner

Give only the ZIP and README to your partner. Ask them to run the original and modified pages, follow M1–M6, and record one concrete instruction/UI improvement in Partner_Review.md. Apply their feedback and update this log before submission. No partner has been claimed here.
