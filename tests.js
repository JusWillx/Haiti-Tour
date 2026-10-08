(function () {
  const results = [];
  const test = (name, fn) => { try { if (!fn()) throw Error('Unexpected result'); results.push({ name, pass: true }); } catch (e) { results.push({ name, pass: false, error: e.message }); } };
  const T = (typeof Tour !== 'undefined') ? Tour : require('./tour-core.js');
  const data = (typeof PLACES !== 'undefined') ? PLACES : require('./places.js');
  const good = { name: 'A', lon: -72.24336, lat: 19.57333, description: 'd', source: 'https://whc.unesco.org/en/list/180/', checked: '2026-09-28' };

  test('Next moves forward', () => T.nextIndex(0, 3) === 1);
  test('Next wraps from the last stop to the first', () => T.nextIndex(2, 3) === 0);
  test('Previous wraps from the first stop to the last', () => T.prevIndex(0, 3) === 2);
  test('Empty list does not crash', () => T.nextIndex(0, 0) === 0 && T.prevIndex(0, 0) === 0);
  test('A complete record is usable', () => T.validatePlace(good).length === 0);
  test('Missing longitude is flagged, not guessed', () => T.validatePlace({ ...good, lon: null }).some(m => m.includes('longitude')));
  test('Longitude 200 is out of range', () => T.validatePlace({ ...good, lon: 200 }).length > 0);
  test('Swapped longitude/latitude is caught', () => T.validatePlace({ ...good, lon: 19.57333, lat: -72.24336 }).some(m => m.includes('swapped')));
  test('Missing source is flagged', () => T.validatePlace({ ...good, source: '' }).some(m => m.includes('source')));
  test('Photo without alt text is flagged', () => T.validatePlace({ ...good, photo: 'x.jpg', photoAlt: '' }).some(m => m.includes('alt')));
  test('usable() drops bad records only', () => T.usable([good, { ...good, lat: null }]).length === 1);
  test('Every record in places.js is usable', () => data.every(p => T.validatePlace(p).length === 0));

  if (typeof document !== 'undefined') document.getElementById('results').textContent = results.map(r => (r.pass ? 'PASS: ' : 'FAIL: ') + r.name).join('\n');
  else { results.forEach(r => console.log((r.pass ? 'PASS: ' : 'FAIL: ') + r.name)); if (results.some(r => !r.pass)) process.exitCode = 1; }
})();
