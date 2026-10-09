# Three AI collaboration excerpts from this session

These are excerpts of actual user/AI or AI/tool interactions. They are not invented follow-up prompts. Review the accepted/rejected choices yourself before submitting.

## 1. Planning

User: “create a Haiti history tour/ flight simulator with cesium js and maybe three description files”

AI: “I’ll inspect both starters and use the one that best fits a Haiti history tour with a flight experience.”

Implemented choice to review: Path B uses the supplied Tour validation/navigation and adds a practice-flight mode from the supplied Flight movement core. The audience connection is cybersecurity students learning source provenance and validation. Rejected approach: portraying simulated flights as real travel routes or guessing a Ramiers coordinate. The third stop uses UNESCO’s published property reference point and is labeled as a park overview.

## 2. Coding

User: “use the colors of the haitian flag for the design for the user interface”

AI: “I’ll use Haitian flag blue and red, with white backgrounds and accents.”

Implemented choice to review: CSS uses blue #00209f, red #d21034, and white; Slow Tour changes camera duration from 2 to 6 seconds. Source labels and warnings use textContent. Rejected approach: injecting record descriptions/names into innerHTML. The new UI preserves the starter’s missing-data behavior and does not require an ion token.

## 3. Debugging — actual AI/tool trace

AI ran `node Haiti_History_Lab/break-and-repair.js`.

Tool evidence:

```text
Data warning: Citadelle Laferrière: missing source
After removing first historical source · exit 1
FAIL: Every record in places.js is usable
After repair · exit 0
PASS: Every record in places.js is usable
Restored bytes equal original: true
```

Implemented choice to review: restore the source in a temporary exercise copy and rerun tests rather than weaken the validator. A separate DOM-double check confirmed the warning and exclusion of the incomplete stop. Rejected approach: counting a mock or Node check as a real WebGL/browser demonstration. The browser preview was blocked, so manual results remain pending.

The student still needs to read the code, confirm these choices, and describe any independent edits or decisions accurately. Full repair evidence is in evidence/break-and-repair.txt.


## Rebuild follow-up — actual session

User: “its slow and its not responsive whatsoever and i dont want a grid i want the actual landmarks view thru the cesium api this needs to be redone”

AI: “I’ll redo the globe and controls around actual geographic imagery, improve responsiveness, and investigate what’s making it slow.”

Accepted implementation changes to review: real satellite/elevation providers; local engine files; immediate selection text; mobile map layout; on-demand rendering; throttled flight HUD; touch controls. Rejected: treating a grid as a landmark view or claiming satellite/elevation data is a photorealistic building mesh.

Debugging evidence: the first actual browser run reported “Cannot set properties of undefined (setting 'show')”. The fix guards absent sun/moon objects when sky effects are disabled. Missing runtime resource files were added rather than ignoring 404s. Browser tests use actual upstream imagery/elevation responses; container network transport limitations are explained in the evidence.

Follow-up accepted: replace the overview only after verifying ISPAN’s original PDF coordinates. Rejected the corrupted OCR transcription. Added a pinned official Cesium CDN fallback for missing vendor uploads. User prompt: “yes verify everything and then implement everything efficiently.”

V3 user request: “add like cities and beaches and other attractions ... total of 7 stops ... remove the 3rd stop.” Accepted seven distinct places and longer original descriptions; rejected retaining Ramiers or reusing a northern-only geographic box. Published references are labeled as overviews where appropriate.
