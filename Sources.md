# Sources and verification

## Historical facts — checked 2026-10-05

UNESCO World Heritage Centre: https://whc.unesco.org/en/list/180/

Checked: the 1804 independence context and fortress commission; Sans-Souci’s royal and administrative role, 1813 inauguration, and 1842 earthquake damage; the National History Park’s component sites and its 1982 inscription. The stop descriptions paraphrase this institutional account. No current access, opening hours, fees, or travel-safety claims are included.

## Geographic records — checked 2026-10-05

| Stop | Coordinate source | Longitude, latitude | Limitation |
|---|---|---|---|
| Citadelle | https://www.geonames.org/3723098/citadelle-laferriere.html | -72.24336, 19.57333 | Gazetteer approximation; retrieved search result, direct opening unavailable. Not a surveyed entrance. |
| Sans-Souci | https://www.wikidata.org/wiki/Q930795 | -72.2185972222, 19.6046916667 | Coordinate imported from German Wikipedia; approximate, not independently surveyed. |
| Park overview | https://whc.unesco.org/en/list/180/maps/ | -72.2342680556, 19.573025 | UNESCO property reference, not a Ramiers monument or entrance. |

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
