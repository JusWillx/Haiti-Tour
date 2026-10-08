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
    "checked": "2026-10-08",
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
    "checked": "2026-10-08",
    "photo": "",
    "photoAlt": ""
  },
  {
    "id": "ramiers",
    "name": "Fortifications of Ramiers",
    "era": "Early 1800s · A layered defense",
    "lon": -72.244525,
    "lat": 19.56398888888889,
    "description": "South of the Citadelle, Ramiers preserves residential ruins protected by four fortified redoubts. These independent defensive works guarded a vulnerable approach to the fortress and supported one another. Together with the Citadelle and Sans-Souci, the site belongs to the UNESCO-listed National History Park. This stop connects layered physical defenses with defense in depth in cybersecurity.",
    "coordinateSource": "https://ufdcimages.uflib.ufl.edu/AA/00/06/57/66/00020/Bulletin_ISPAN_No_29.pdf",
    "coordinateNote": "ISPAN Bulletin No. 29 (1 October 2011), printed page 6: N19°33′50.36″, W72°14′40.29″. Published site reference attributed to Google Earth 2010; approximate, not a surveyed entrance or individual redoubt.",
    "source": "https://whc.unesco.org/en/list/180/",
    "checked": "2026-10-08",
    "photo": "",
    "photoAlt": ""
  }
];
if (typeof module !== "undefined") module.exports = PLACES;
