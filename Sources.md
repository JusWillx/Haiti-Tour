# Sources and verification

## Historical facts — rechecked 2026-10-08

UNESCO World Heritage Centre: https://whc.unesco.org/en/list/180/

Checked: the 1804 independence context and fortress commission; Sans-Souci’s royal and administrative role, 1813 inauguration, and 1842 earthquake damage; the National History Park’s component sites and its 1982 inscription. The stop descriptions paraphrase this institutional account. No current access, opening hours, fees, or travel-safety claims are included.

## Geographic records — rechecked 2026-10-08

| Stop | Coordinate source | Longitude, latitude | Limitation |
|---|---|---|---|
| Citadelle | https://www.geonames.org/3723098/citadelle-laferriere.html | -72.24336, 19.57333 | Gazetteer approximation; retrieved search result, direct opening unavailable. Not a surveyed entrance. |
| Sans-Souci | https://www.wikidata.org/wiki/Q930795 | -72.2185972222, 19.6046916667 | Coordinate imported from German Wikipedia; approximate, not independently surveyed. |
| Ramiers | https://ufdcimages.uflib.ufl.edu/AA/00/06/57/66/00020/Bulletin_ISPAN_No_29.pdf | -72.244525, 19.56398888888889 | ISPAN No.29, page 6; approximate site reference, checked 2026-10-08. |

DMS conversion: degrees + minutes/60 + seconds/3600. West longitude is negative, and Cesium receives longitude first. The palace source gives N19 36 16.89, W72 13 6.95. UNESCO’s property point gives N19 34 22.89, W72 14 3.365. The region box is a coarse validation aid, not a Haiti boundary or proof of precision.

## Imagery/elevation — checked 2026-10-08 UTC

Satellite: https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer

Terrain: https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer

Both metadata responses returned HTTP 200 with valid tileInfo and no error field. A satellite tile at the Citadelle and actual binary elevation tiles at levels 12 and 14 were retrieved. Raw metadata and browser results are in evidence/. Public service access required no token in these checks; availability is not guaranteed permanently. Credits remain visible in the viewer. Imagery age/resolution and elevation accuracy come from the services.

The initial view uses cached satellite tiles through UrlTemplateImageryProvider. Wider ArcGIS tiles are requested when exploring or entering Flight mode. 3D mountain elevation is requested only when the user enables it. Satellite/elevation data do not provide photorealistic monument meshes; no licensed monument scan is bundled.

## Official API documentation checked

- https://cesium.com/learn/cesiumjs/ref-doc/UrlTemplateImageryProvider.html
- https://cesium.com/learn/cesiumjs/ref-doc/ArcGisMapServerImageryProvider.html
- https://cesium.com/learn/cesiumjs/ref-doc/ArcGISTiledElevationTerrainProvider.html
- https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
- https://cesium.com/learn/cesiumjs/ref-doc/Camera.html#flyToBoundingSphere
- https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html#fromDegrees

Camera duration is in seconds: normal 0.8, Slow Tour 6, reduced motion 0. Runtime version 1.145.0 was confirmed in its header and live browser. Rendering only on demand and reducing resolution are supported Viewer options; these changes do not guarantee a specific frame rate on every device.

## Ramiers verification — 2026-10-08

UNESCO describes residential remains with two pairs of redoubts. ISPAN Bulletin No. 29 documents their auxiliary defensive role. The original PDF was visually inspected: latitude is 19°33′50.36″ N (not the incorrect OCR transcription 19°32′50.26″), longitude 72°14′40.29″ W. Convert using degrees + minutes/60 + seconds/3600, negate west. The publication attributes its point to Google Earth 2010; no surveyed precision is claimed. It does not conclusively establish the exact construction date or identify the residence as a queen’s palace, so those claims are omitted.

Citadelle coordinates rechecked against GeoNames indexed entry (direct page unavailable); Sans-Souci DMS and provenance rechecked on Wikidata. Official pinned Cesium fallback script retrieved successfully (HTTP 200, 6,018,837 bytes). GitHub deployment still requires the user’s site URL to verify.
