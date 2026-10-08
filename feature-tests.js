(() => {
const T=typeof Tour!=='undefined'?Tour:require('./tour-core.js');
const F=typeof Flight!=='undefined'?Flight:require('./flight-core.js');
const data=typeof PLACES!=='undefined'?PLACES:require('./places.js');
const results=[];const test=(name,fn)=>{try{if(!fn())throw Error('Unexpected result');results.push('PASS: '+name);}catch(e){results.push('FAIL: '+name+' '+e.message);}};
test('Slow Tour uses six seconds instead of 0.8',()=>T.flightDuration(true)===6&&T.flightDuration(false)===0.8);
test('Three history stops are supplied',()=>data.length===3);
test('Coordinate sources are HTTPS',()=>data.every(p=>/^https:\/\//.test(p.coordinateSource)));
test('Missing date is rejected',()=>T.validatePlace({...data[0],checked:''}).some(x=>x.includes('checked')));
test('Impossible date is rejected',()=>T.validatePlace({...data[0],checked:'2026-02-30'}).some(x=>x.includes('date')));
test('Unsafe source scheme is rejected',()=>T.validatePlace({...data[0],source:'javascript:alert(1)'}).length>0);
test('Initial flight state is in northern Haiti',()=>T.inArea(F.initial()));
test('Nonfinite time cannot corrupt state',()=>JSON.stringify(F.step({...F.initial(),paused:false},NaN))===JSON.stringify({...F.initial(),paused:false}));
test('ISPAN Ramiers DMS conversion preserves west longitude',()=>Math.abs(data[2].lon-(-(72+14/60+40.29/3600)))<1e-10&&Math.abs(data[2].lat-(19+33/60+50.36/3600))<1e-10);
if(typeof document!=='undefined')document.getElementById('featureResults').textContent=results.join('\n');else{console.log(results.join('\n'));if(results.some(x=>x.startsWith('FAIL')))process.exitCode=1;}
})();