# Sources and verification

## Historical facts — rechecked 2026-10-08

UNESCO World Heritage Centre: https://whc.unesco.org/en/list/180/

Checked: the 1804 independence context and fortress commission; Sans-Souci’s royal and administrative role, 1813 inauguration, and 1842 earthquake damage; the National History Park’s component sites and its 1982 inscription. The stop descriptions paraphrase this institutional account. No current access, opening hours, fees, or travel-safety claims are included.

## Active seven-stop geographic and description sources — checked 2026-10-08

### Citadelle Laferrière
Description: https://whc.unesco.org/en/list/180/
Coordinate record: https://www.geonames.org/3723098/citadelle-laferriere.html
Longitude, latitude: -72.24336, 19.57333
GeoNames feature 3723098; approximate landmark location, not an entrance or surveyed boundary.

### Palais Sans-Souci
Description: https://whc.unesco.org/en/list/180/
Coordinate record: https://www.wikidata.org/wiki/Q930795
Longitude, latitude: -72.21859722222223, 19.604691666666668
Wikidata coordinate statement, imported from German Wikipedia; approximate and not independently surveyed.

### Cap-Haïtien
Description: https://visithaiti.com/destinations/cap-haitien-city-guide/
Coordinate record: https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=1016735
Longitude, latitude: -72.198, 19.759
Getty TGN 1016735 published decimal city reference. Approximate city overview, not a cathedral or entrance.

### Labadee
Description: https://ambhaitibenin.org/public/decouvrir-haiti/cap-haitien/lieu/plage-labadee
Coordinate record: https://www.wikidata.org/wiki/Q1246231
Longitude, latitude: -72.24555555555555, 19.78638888888889
Wikidata Q1246231: N19 47 11, W72 14 44, imported from German Wikipedia. Approximate Labadie/Labadee area view, not a specific beach entrance.

### Jacmel
Description: https://www.unesco.org/en/creative-cities/jacmel
Coordinate record: https://www.wikidata.org/wiki/Q923362
Longitude, latitude: -72.53472222222221, 18.234166666666667
Wikidata city reference N18 14 3, W72 32 5; imported from Russian Wikipedia. Approximate city overview.

### Bassin Bleu
Description: https://visithaiti.com/wildlife-nature/bassin-bleu-waterfall/
Coordinate record: https://www.wikidata.org/wiki/Q2887443
Longitude, latitude: -72.58805555555556, 18.234166666666667
Wikidata Q2887443: N18 14 3, W72 35 17, imported from French Wikipedia. Approximate natural site reference, not a trailhead.

### Île-à-Vache
Description: https://visithaiti.com/beaches-islands/ile-a-vache/
Coordinate record: https://www.wikidata.org/wiki/Q292606
Longitude, latitude: -73.63, 18.07138888888889
Wikidata island reference N18 4 17, W73 37 48; imported from Russian Wikipedia. Island overview, not an individual beach.

Published points are approximate, not a survey. Bassin Bleu is the Jacmel natural attraction, not a northern commune or the nearby hamlet. Pool counts differ between some sources; description follows Visit Haiti. UNESCO Creative City status differs from World Heritage inscription. The flight is simulated; no current opening or service schedule is claimed.

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

