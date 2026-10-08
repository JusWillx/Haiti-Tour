/* Node-only DOM/Cesium doubles. These are integration logic checks, NOT browser/WebGL evidence. */
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
class Element {
  constructor(tag='DIV'){this.tagName=tag;this.children=[];this.attrs={};this.textContent='';this.hidden=false;this.disabled=false;this.value='';}
  append(...items){this.children.push(...items);}
  replaceChildren(...items){this.children=items;}
  setAttribute(k,v){this.attrs[k]=String(v);}
  removeAttribute(k){delete this.attrs[k];}
  allText(){return this.textContent+' '+this.children.map(x=>x.allText()).join(' ');}
}
function context(dir,mutate,cesium=false){
  const els={},events={},calls=[],frames=[];
  const document={getElementById:id=>els[id]??(els[id]=new Element()),createElement:t=>new Element(t.toUpperCase()),createElementNS:(_,t)=>new Element(t.toUpperCase()),addEventListener:(k,fn)=>events[k]=fn};
  const ctx=vm.createContext({console,document,window:{matchMedia:()=>({matches:false})},URL,requestAnimationFrame:fn=>frames.push(fn)});
  if(cesium){
    const color={WHITE:'white',BLACK:'black',fromCssColorString:v=>v};
    const viewer={camera:{cancelFlight:()=>{},flyTo:o=>calls.push(o),setView:o=>calls.push(o)},entities:{add:o=>o},imageryLayers:{addImageryProvider:()=>{}},scene:{},isDestroyed:()=>false,destroy:()=>{}};
    ctx.Cesium={Viewer:function(){return viewer;},EllipsoidTerrainProvider:function(){},GridImageryProvider:function(){},Cartesian3:{fromDegrees:(lon,lat,height)=>({lon,lat,height})},Cartesian2:function(x,y){this.x=x;this.y=y;},Color:color,Math:{toRadians:d=>d*Math.PI/180}};
  }
  for(const file of ['places.js','tour-core.js','flight-core.js'])if(fs.existsSync(dir+'/'+file))vm.runInContext(fs.readFileSync(dir+'/'+file,'utf8'),ctx);
  if(mutate)vm.runInContext(mutate,ctx);
  vm.runInContext(fs.readFileSync(dir+'/app.js','utf8'),ctx);
  return {els,events,calls,frames};
}
const out=[];
function test(name,fn){try{fn();out.push('PASS: '+name);}catch(e){out.push('FAIL: '+name+' · '+e.message);process.exitCode=1;}}
const dir=__dirname;
test('Original starter fallback initializes first stop',()=>{const c=context(dir+'/originals/Tour_Lab');assert.match(c.els.name.textContent,/Example Stop 1/);assert.match(c.els.message.textContent,/Cesium did not load/);});
test('No-Cesium fallback shows history and coordinate plot',()=>{const c=context(dir);assert.equal(c.els.name.textContent,'Citadelle Laferrière');assert.equal(c.els.fallback.hidden,false);assert.equal(c.els.fallbackMarkers.children.length,6);});
test('Next and Previous update details and wrap',()=>{const c=context(dir);c.els.prev.onclick();assert.equal(c.els.name.textContent,'National History Park');c.els.next.onclick();assert.equal(c.els.name.textContent,'Citadelle Laferrière');c.els.next.onclick();assert.equal(c.els.name.textContent,'Palais Sans-Souci');});
test('Slow Tour updates accessible button and flyTo duration',()=>{const c=context(dir,null,true);assert.equal(c.calls.at(-1).duration,2);c.els.slow.onclick();c.els.next.onclick();assert.equal(c.els.slow.attrs['aria-pressed'],'true');assert.equal(c.calls.at(-1).duration,6);});
test('Missing source warning excludes stop',()=>{const c=context(dir,"PLACES[0].source=''");assert.match(c.els.problems.allText(),/missing source/);assert.equal(c.els.name.textContent,'Palais Sans-Souci');assert.equal(c.els.stopList.children.length,2);});
test('Empty data disables navigation safely',()=>{const c=context(dir,'PLACES.length=0');assert.equal(c.els.next.disabled,true);assert.equal(c.els.flightMode.disabled,true);assert.match(c.els.name.textContent,/No usable stops/);});
test('HTML-like data is displayed as text',()=>{const c=context(dir,"PLACES[0].name='<img src=x onerror=alert(1)>'");assert.equal(c.els.name.textContent,'<img src=x onerror=alert(1)>');assert.equal(c.els.name.children.length,0);});
test('Flight mode starts paused at selected stop; Reset restores it',()=>{const c=context(dir);c.els.next.onclick();c.els.flightMode.onclick();assert.equal(c.els.flightPanel.hidden,false);assert.match(c.els.telemetry.textContent,/PAUSED.*19.60469/);c.els.play.onclick();assert.equal(c.els.play.textContent,'Pause flight');c.els.reset.onclick();assert.match(c.els.telemetry.textContent,/PAUSED/);});
test('Frame integration advances flight; returning to tour pauses it',()=>{const c=context(dir);c.els.flightMode.onclick();c.els.play.onclick();const first=c.els.telemetry.textContent;c.frames.shift()(0);c.frames.shift()(100);assert.notEqual(c.els.telemetry.textContent,first);c.els.tourMode.onclick();assert.match(c.els.telemetry.textContent,/PAUSED/);});
test('Keyboard heading wraps and background visibility pauses',()=>{const c=context(dir);c.els.flightMode.onclick();const event={key:'ArrowLeft',target:{tagName:'DIV'},preventDefault:()=>{}};c.events.keydown(event);assert.equal(c.els.heading.value,355);c.els.play.onclick();c.events.visibilitychange();assert.match(c.els.telemetry.textContent,/PAUSED/);});
console.log(out.join('\n'));
