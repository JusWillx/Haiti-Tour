# Source verification — checked 2026-10-05

## History

UNESCO World Heritage Centre, National History Park – Citadel, Sans Souci, Ramiers:
https://whc.unesco.org/en/list/180/

The descriptions paraphrase UNESCO’s account. Checked: Haiti’s 1804 independence and the fortress commission; Sans-Souci’s royal/administrative role, inauguration in 1813, and damage in the 1842 earthquake; the park’s component sites and 1982 World Heritage inscription. UNESCO provides an institutional account, not every historical perspective. Avoid unsourced claims about current opening hours, entry fees, safety, or access.

## Coordinates

| Stop | Source | Longitude, latitude | Care taken |
|---|---|---|---|
| Citadelle | https://www.geonames.org/3723098/citadelle-laferriere.html | -72.24336, 19.57333 | Published gazetteer location. Retrieved search result supplied coordinates; direct page opening failed. Approximate, not surveyed. |
| Sans-Souci | https://www.wikidata.org/wiki/Q930795 | -72.2185972222, 19.6046916667 | DMS: 19°36′16.89″ N, 72°13′6.95″ W. The statement is imported from German Wikipedia; do not treat it as an independent survey. |
| Park overview | https://whc.unesco.org/en/list/180/maps/ | -72.2342680556, 19.573025 | DMS: N19 34 22.89, W72 14 3.365. A property reference point, not a Ramiers marker or entrance. |

Conversion: degrees + minutes/60 + seconds/3600; west longitude is negative. Cesium receives longitude first. The sources’ labels and northern-Haiti region were checked. These checks do not establish survey precision or safe travel routes.

## API claim

Cesium Camera.flyTo documentation:
https://cesium.com/learn/cesiumjs/ref-doc/Camera.html#flyTo

The official API defines `duration` in seconds. The Slow Tour implementation changes duration from 2 to 6. The added pure-function and UI-double tests confirm the supplied options. Actual WebGL animation has not been observed here.

Cesium Cartesian3.fromDegrees:
https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html#fromDegrees

Cesium Viewer/GridImageryProvider/EllipsoidTerrainProvider follow the supplied starter. CDN version 1.145 is retained, not upgraded; CDN delivery itself remains unverified in this environment. No ion token or private credentials were introduced.
