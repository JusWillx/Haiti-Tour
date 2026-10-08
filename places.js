/* Historical facts checked against UNESCO; coordinate sources are separate.
   Longitude FIRST. Coordinates are approximate and are not travel guidance. */
const PLACES = [
  {
    "id": "citadelle",
    "name": "Citadelle Laferrière",
    "era": "1804 · Defending independence",
    "lon": -72.24336,
    "lat": 19.57333,
    "description": "After Haiti declared independence in 1804, Dessalines assigned Henri Christophe to build a fortress on Pic Laferrière. Its inland mountain position supported the defense of the new republic. This stop asks how geography can shape a security strategy.",
    "coordinateSource": "https://www.geonames.org/3723098/citadelle-laferriere.html",
    "coordinateNote": "GeoNames feature 3723098; approximate landmark location, not an entrance or surveyed boundary.",
    "source": "https://whc.unesco.org/en/list/180/",
    "checked": "2026-10-05",
    "photo": "",
    "photoAlt": ""
  },
  {
    "id": "sans-souci",
    "name": "Palais Sans-Souci",
    "era": "1813 · Government and power",
    "lon": -72.21859722222223,
    "lat": 19.604691666666668,
    "description": "Near Milot, Sans-Souci served as Henri Christophe’s royal residence and an administrative center. Inaugurated in 1813, it was later seriously damaged by the 1842 earthquake. Its ruins invite discussion about power, public institutions, and the preservation of historical records.",
    "coordinateSource": "https://www.wikidata.org/wiki/Q930795",
    "coordinateNote": "Wikidata coordinate statement, imported from German Wikipedia; approximate and not independently surveyed.",
    "source": "https://whc.unesco.org/en/list/180/",
    "checked": "2026-10-05",
    "photo": "",
    "photoAlt": ""
  },
  {
    "id": "heritage",
    "name": "National History Park",
    "era": "1982 · Preserving collective memory",
    "lon": -72.23426805555556,
    "lat": 19.573025,
    "description": "The National History Park brings together the Citadel, Sans-Souci, and Ramiers. It entered UNESCO’s World Heritage List in 1982. This overview uses UNESCO’s property reference point, rather than an individual monument, to connect the tour to cultural memory and the care of trusted digital information.",
    "coordinateSource": "https://whc.unesco.org/en/list/180/maps/",
    "coordinateNote": "UNESCO property reference point: N19 34 22.89, W72 14 3.365. This is not the Ramiers monument location.",
    "source": "https://whc.unesco.org/en/list/180/",
    "checked": "2026-10-05",
    "photo": "",
    "photoAlt": ""
  }
];
if (typeof module !== "undefined") module.exports = PLACES;
