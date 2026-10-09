# Six proposed Path B manual checks — V2

Canvas page 6 was not attached. Compare these checks with your instructor’s actual list. Browser automation is documented separately; a student/partner must perform the required manual demonstrations and record actual observations.

| ID | Action | Expected result | Evidence |
|---|---|---|---|
| M1 | Open untouched originals/Tour_Lab/index.html, then the rebuilt index.html | Original starter checkpoint recorded; V2 shows actual satellite imagery in Cesium, no grid; elevation success/failure is labeled | Screenshot, browser/version, checkpoint time |
| M2 | Visit all three stops, wrap with Next/Previous, and click numbered stops | Immediate detail updates, correct active state, camera frames selected place | Before/after screenshot and timing notes |
| M3 | Expand all source panels | History and coordinate links, checked date, approximate-position notes; Each of seven stops has a source, checked date, and approximate coordinate note | Source-panel screenshots and link observations |
| M4 | Compare normal and Slow Tour, then enable reduced motion | Normal transitions about 0.8 seconds; Slow Tour 6 seconds; reduced motion skips transitions | Recording/timing notes and preference setting |
| M5 | On a backup copy, blank first source and reload index.html/tests.html; restore it | Warning, incomplete stop excluded, final Tour data test fails; restoration clears warning and repairs tests | Warning, failure, and restoration screenshots |
| M6 | Try phone width, keyboard navigation, touch controls, lighter graphics, and engine failure | No horizontal overflow; map above controls on mobile; usable navigation; failed 3D is honestly labeled | Desktop/mobile/fallback screenshots and notes |

Also observe tests.html: 12 Tour + 7 Flight + 9 feature + 12 view rules = **40 checks**. Node results are not the same as this browser observation.

Optional flight checks: begins paused at selected stop; Start moves coordinates; Pause stops movement; touch buttons/sliders work; Reset restores selected stop; History Tour and hiding the tab pause the simulation. Height is above the ellipsoid, not guaranteed clearance above terrain. No aircraft physics or collision detection is claimed.

Give the ZIP and README to a real partner and fill Partner_Review.md. Automated browser review is not partner feedback.

V3: visit all seven stops; Next wraps Île-à-Vache to Citadelle, Previous wraps Citadelle to Île-à-Vache. Check both cities, beach, waterfall, and island camera framing. Confirm no northern-only validation warning for southern stops. These manual checks are pending actual user observation.

Flight destination revision: choose any stop in flight dropdown, Start, follow target bearing (or Aim at stop), observe shrinking distance and arrival pause; Explore this stop must open the same story. Next destination deliberately restarts a2km approach; it does not simulate travel between distant locations. Live WebGL observation pending upload.
