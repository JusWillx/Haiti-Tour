/* Node DOM/Cesium doubles: control logic only, not rendering evidence. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
 constructor(tag='DIV'){this.tagName=tag;this.children=[];this.attrs={};this.textContent='';this.hidden=false;this.disabled=false;this.value='';}
 append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}setAttribute(k,v){this.attrs[k]=String(v);}remove(){this.removed=true;}addEventListener(){}
 allText(){return this.textContent+' '+this.children.map(v=>v.allText()).join(' ');}
}
function event(){return {addEventListener:()=>()=>{}};}
async function setup({mutation='',fail=false,reduced=false,mobile=false}={}){
 const els={},events={},frames=new Map(),calls=[],options=[];let id=0;
 const document={hidden:false,baseURI:'http://localhost/',getElementById:n=>els[n]??(els[n]=new Element()),createElement:t=>new Element(t.toUpperCase()),addEventListener:(k,fn)=>events[k]=fn,head:new Element('HEAD')};
 const viewer={imageryLayers:{remove:()=>{},addImageryProvider:()=>({}),get:()=>({})},camera:{positionCartographic:{height:2500},cancelFlight:()=>{},flyToBoundingSphere:(sphere,o)=>calls.push(o),lookAtTransform:()=>{},setView:o=>calls.push(o),zoomIn:()=>{},zoomOut:()=>{}},entities:{add:o=>o},screenSpaceEventHandler:{setInputAction:()=>{}},clock:{},scene:{requestRender:()=>{},postRender:event(),renderError:event(),globe:{tileLoadProgressEvent:event(),getHeight:()=>860},sun:{},moon:{},screenSpaceCameraController:{},postProcessStages:{fxaa:{}}},isDestroyed:()=>false,destroy:()=>{},resize:()=>{}};
 const C={UrlTemplateImageryProvider:function(){if(fail)throw Error('Network unavailable');this.errorEvent=event();},Rectangle:{fromDegrees:(...v)=>v},Credit:function(){},SingleTileImageryProvider:{fromUrl:async()=>{if(fail)throw Error('Network unavailable');return {errorEvent:event()};}},Viewer:function(_,o){options.push(o);return viewer;},ImageryLayer:function(p){this.provider=p;},EllipsoidTerrainProvider:function(){},ArcGisMapServerImageryProvider:{fromUrl:async()=>{if(fail)throw Error('Network unavailable');return {errorEvent:event()};}},ArcGISTiledElevationTerrainProvider:{fromUrl:async()=>({errorEvent:event()})},sampleTerrain:async(_,level,points)=>points.map(p=>({...p,height:860})),Cartesian3:{fromDegrees:(lon,lat,height)=>({lon,lat,height})},Cartographic:{fromDegrees:(lon,lat)=>({lon,lat})},BoundingSphere:function(center,radius){this.center=center;this.radius=radius;},HeadingPitchRange:function(heading,pitch,range){this.heading=heading;this.pitch=pitch;this.range=range;},Cartesian2:function(x,y){this.x=x;this.y=y;},Color:{WHITE:'white',fromCssColorString:v=>v},Math:{toRadians:v=>v*Math.PI/180},HeightReference:{CLAMP_TO_GROUND:1},DistanceDisplayCondition:function(){},ScreenSpaceEventType:{LEFT_CLICK:1},Matrix4:{IDENTITY:{}}};
 const ctx=vm.createContext({document,console,URL,URLSearchParams,setTimeout,clearTimeout,Cesium:C,requestAnimationFrame:fn=>{const n=++id;frames.set(n,fn);return n;},cancelAnimationFrame:n=>frames.delete(n)});
 ctx.window=ctx;ctx.matchMedia=()=>({matches:reduced});ctx.innerWidth=mobile?390:1440;ctx.addEventListener=()=>{};
 for(const file of ['places.js','tour-core.js','flight-core.js','view-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
 if(mutation)vm.runInContext(mutation,ctx);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),ctx);
 for(let n=0;n<5;n++)await new Promise(r=>setImmediate(r));
 return {document,els,events,frames,calls,options,lab:ctx.HaitiLab,viewer,frame:time=>{const first=frames.entries().next().value;if(first){frames.delete(first[0]);first[1](time);}}};
}
(async()=>{
 const results=[];async function test(name,fn){try{await fn();results.push('PASS: '+name);}catch(e){results.push('FAIL: '+name+' · '+e.message);process.exitCode=1;}}
 await test('Idle tour schedules no flight animation callbacks',async()=>{const c=await setup();assert.equal(c.frames.size,0);});
 await test('Viewer enables explicit rendering and 30 FPS cap',async()=>{const c=await setup();assert.equal(c.options[0].requestRenderMode,true);assert.equal(c.options[0].targetFrameRate,30);assert.equal(c.options[0].maximumRenderTimeChange,Infinity);});
 await test('Satellite failure shows preview and disables flight honestly',async()=>{const c=await setup({fail:true});assert.equal(c.els.mapFallback.hidden,false);assert.equal(c.els.flightMode.disabled,true);assert.match(c.els.message.textContent,/Network unavailable/);});
 await test('Next and Previous update details and wrap',async()=>{const c=await setup();c.els.prev.onclick();assert.equal(c.els.name.textContent,'National History Park');c.els.next.onclick();assert.equal(c.els.name.textContent,'Citadelle Laferrière');c.els.next.onclick();assert.equal(c.els.name.textContent,'Palais Sans-Souci');});
 await test('Slow Tour only changes future camera duration',async()=>{const c=await setup();c.els.slow.onclick();c.els.next.onclick();assert.equal(c.calls.at(-1).duration,6);c.els.slow.onclick();c.els.next.onclick();assert.equal(c.calls.at(-1).duration,.8);});
 await test('Reduced motion skips transitions',async()=>{const c=await setup({reduced:true});c.els.next.onclick();assert.equal(c.calls.at(-1).duration,0);});
 await test('Missing source warns and excludes incomplete stop',async()=>{const c=await setup({mutation:"PLACES[0].source=''"});assert.match(c.els.problems.allText(),/missing source/);assert.equal(c.els.stopList.children.length,2);});
 await test('Empty data disables navigation safely',async()=>{const c=await setup({mutation:'PLACES.length=0'});assert.equal(c.els.next.disabled,true);assert.equal(c.els.flightMode.disabled,true);});
 await test('HTML-like names remain text',async()=>{const c=await setup({mutation:"PLACES[0].name='<img onerror=alert(1)>'"});assert.equal(c.els.name.textContent,'<img onerror=alert(1)>');assert.equal(c.els.name.children.length,0);});
 await test('Flight starts paused at selected stop',async()=>{const c=await setup();c.els.next.onclick();c.els.flightMode.onclick();assert.equal(c.lab.mode,'flight');assert.equal(c.lab.state.paused,true);assert.equal(c.lab.state.lat,19.604691666666668);});
 await test('Flight runs on demand; Pause cancels queued callback',async()=>{const c=await setup();c.els.flightMode.onclick();c.els.play.onclick();assert.equal(c.frames.size,1);c.frame(0);c.frame(100);assert.ok(c.lab.state.lat>19.57333);c.els.play.onclick();assert.equal(c.frames.size,0);});
 await test('Flight HUD is throttled and sliders are not rewritten per frame',async()=>{const c=await setup();c.els.flightMode.onclick();c.els.play.onclick();const before=c.lab.stats.hudUpdates;c.frame(0);c.frame(50);c.frame(100);assert.equal(c.lab.stats.hudUpdates,before);c.frame(150);assert.equal(c.lab.stats.hudUpdates,before+1);});
 await test('Touch turn buttons and Reset work',async()=>{const c=await setup();c.els.flightMode.onclick();c.els.turnLeft.onclick();assert.equal(c.lab.state.heading,355);c.els.climb.onclick();assert.equal(c.lab.state.height,2250);c.els.reset.onclick();assert.equal(c.lab.state.heading,0);});
 await test('Returning to tour or hiding tab pauses flight',async()=>{const c=await setup();c.els.flightMode.onclick();c.els.play.onclick();c.document.hidden=true;c.events.visibilitychange();assert.equal(c.lab.state.paused,true);c.els.play.onclick();c.els.tourMode.onclick();assert.equal(c.lab.state.paused,true);assert.equal(c.frames.size,0);});
 await test('Mobile defaults to lighter graphics',async()=>{const c=await setup({mobile:true});assert.equal(c.viewer.resolutionScale,.7);assert.equal(c.viewer.targetFrameRate,24);});
 console.log(results.join('\n'));
})();
