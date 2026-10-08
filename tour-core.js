/* Tour rules with no Cesium and no buttons, so they can be tested on their own. */
(function (root) {
  // Area the class project is expected to stay inside (in northern Haiti; a coarse validation box, not a country boundary).
  // Change this box if your verified stops are somewhere else.
  const AREA = { west: -72.50, east: -72.00, south: 19.30, north: 19.90 };

  const hasText = v => typeof v === 'string' && v.trim().length > 0;
  const isNum = v => typeof v === 'number' && Number.isFinite(v);

  // Returns a list of problems. An empty list means the record is usable.
  function validatePlace(p, area = AREA) {
    const problems = [];
    if (!p || typeof p !== 'object') return ['record is not an object'];
    for (const k of ['name', 'description', 'source', 'checked'])
      if (!hasText(p[k])) problems.push('missing ' + k);
    if (!isNum(p.lon) || p.lon < -180 || p.lon > 180) problems.push('longitude must be a number from -180 to 180');
    if (!isNum(p.lat) || p.lat < -90 || p.lat > 90) problems.push('latitude must be a number from -90 to 90');
    if (problems.length === 0 && !inArea(p, area)) problems.push('outside the project area: are longitude and latitude swapped?');
    if (hasText(p.checked) && (!/^\d{4}-\d{2}-\d{2}$/.test(p.checked) || !Number.isFinite(Date.parse(p.checked)) || new Date(p.checked).toISOString().slice(0,10) !== p.checked)) problems.push('checked must be a real YYYY-MM-DD date');
    if (hasText(p.source) && !/^https:\/\//i.test(p.source)) problems.push('source must use HTTPS');
    if (hasText(p.photo) && !hasText(p.photoAlt)) problems.push('photo needs alt text');
    return problems;
  }

  const inArea = (p, a = AREA) => p.lon >= a.west && p.lon <= a.east && p.lat >= a.south && p.lat <= a.north;
  const usable = (places, area = AREA) => places.filter(p => validatePlace(p, area).length === 0);
  const nextIndex = (i, n) => (n > 0 ? (i + 1) % n : 0);
  const prevIndex = (i, n) => (n > 0 ? (i - 1 + n) % n : 0);

  const flightDuration = slow => slow ? 6 : 2;
  const api = { flightDuration, AREA, validatePlace, inArea, usable, nextIndex, prevIndex };
  if (typeof module !== 'undefined') module.exports = api;
  root.Tour = api;
})(globalThis);
