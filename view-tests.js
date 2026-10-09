(()=>{
 const V=typeof View!=='undefined'?View:require('./view-core.js');
 const results=[];function test(name,fn){try{if(!fn())throw Error('Unexpected result');results.push('PASS: '+name);}catch(e){results.push('FAIL: '+name+' '+e.message);}}
 test('Normal camera response is under one second',()=>V.flightDuration(false)===0.8);
 test('Slow Tour explicitly uses six seconds',()=>V.flightDuration(true)===6);
 test('Reduced motion overrides both camera speeds',()=>V.flightDuration(false,true)===0&&V.flightDuration(true,true)===0);
 test('Citadelle camera frames the landmark closely',()=>V.rangeFor({id:'citadelle'})===900);
 test('Palace camera frames the landmark closely',()=>V.rangeFor({id:'sans-souci'})===650);
 test('Island overview frames a wider area',()=>V.rangeFor({cameraRange:15000})===15000);
 test('Imagery preview bounds contain selected coordinate',()=>{const u=new URL(V.exportUrl({lon:-72.24,lat:19.57}));const [w,s,e,n]=u.searchParams.get('bbox').split(',').map(Number);return w< -72.24&&e> -72.24&&s<19.57&&n>19.57;});
 test('Imagery preview explicitly uses geographic coordinates',()=>new URL(V.exportUrl({})).searchParams.get('bboxSR')==='4326');
 test('Invalid preview coordinates fall back to Citadelle',()=>!V.exportUrl({lon:NaN,lat:NaN}).includes('NaN'));
 test('Idle map uses request-render mode',()=>V.renderOptions().requestRenderMode===true&&V.renderOptions().maximumRenderTimeChange===Infinity);
 test('GPU work is capped at 30 FPS and no shadows',()=>V.renderOptions().targetFrameRate===30&&V.renderOptions().shadows===false);
 test('Satellite and terrain use HTTPS services',()=>V.imageryUrl.startsWith('https://')&&V.terrainUrl.startsWith('https://'));
 if(typeof document!=='undefined')document.getElementById('viewResults').textContent=results.join('\n');else{console.log(results.join('\n'));if(results.some(r=>r.startsWith('FAIL')))process.exitCode=1;}
})();
