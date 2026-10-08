/* Starter validation and navigation retained. New: Slow Tour and practice flight. */
(() => {
  const $ = id => document.getElementById(id);
  const all = typeof PLACES !== 'undefined' ? PLACES : [];
  const stops = Tour.usable(all);
  const problems = all.map((p,n) => ({name:p?.name || `Record ${n+1}`, issues:Tour.validatePlace(p)})).filter(p=>p.issues.length);
  // Data is rendered as text, never interpolated into HTML.
  if(problems.length) {
    const title = document.createElement('p'); title.textContent='Needs verification (excluded from tour):'; $('problems').append(title);
    problems.forEach(p=>{const line=document.createElement('p');line.textContent=`${p.name}: ${p.issues.join('; ')}`;$('problems').append(line);});
  }
  let index=0, slow=false, mode='tour', viewer=null, markers=[], aircraft=null;
  let state=Flight.initial(); let lastTime=null;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stopButtons=stops.map((p,n)=>{const b=document.createElement('button');b.textContent=n+1;b.setAttribute('aria-label',`Visit ${p.name}`);b.onclick=()=>{index=n;show();};$('stopList').append(b);return b;});
  function link(parent,label,url) {
    const line=document.createElement('p');
    try { const parsed=new URL(url);if(parsed.protocol!=='https:')throw Error('Unsafe source');const a=document.createElement('a');a.href=parsed.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';line.append(a); }
    catch {line.textContent=label+': source URL unavailable';}
    parent.append(line);
  }
  function show() {
    const p=stops[index];
    $('next').disabled=$('prev').disabled=$('slow').disabled=$('flightMode').disabled=!p;
    if(!p){$('name').textContent='No usable stops yet';$('desc').textContent='Fix the warnings in places.js.';$('count').textContent='0 stops';return;}
    $('count').textContent=`STOP ${index+1} / ${stops.length}`;$('era').textContent=p.era||'';$('name').textContent=p.name;$('desc').textContent=p.description;
    $('coords').textContent=`${p.lat.toFixed(5)}° N · ${Math.abs(p.lon).toFixed(5)}° W · approximate`;
    $('source').replaceChildren();link($('source'),'Historical account · UNESCO',p.source);link($('source'),'Coordinate record',p.coordinateSource);
    const d=document.createElement('p');d.textContent=`Checked: ${p.checked}`;$('source').append(d);$('coordinateNote').textContent=p.coordinateNote||'';
    stopButtons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===index)));
    if(viewer){viewer.camera.cancelFlight();viewer.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(p.lon,p.lat,7000),duration:reduced?0:Tour.flightDuration(slow)});markers.forEach((m,n)=>m.point.color=n===index?Cesium.Color.fromCssColorString('#d21034'):Cesium.Color.WHITE);}
    fallback();
  }
  function fallback(){
    const layer=$('fallbackMarkers');layer.replaceChildren();
    // Local equirectangular coordinate plot. No invented roads, borders, or terrain.
    const ns='http://www.w3.org/2000/svg';
    stops.forEach((p,n)=>{const x=70+(p.lon+72.25)*8000,y=325-(p.lat-19.57)*5500;
      const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r',n===index?9:5);dot.setAttribute('fill',n===index?'#ff4765':'#ffffff');layer.append(dot);
      const text=document.createElementNS(ns,'text');text.setAttribute('x',x+13);text.setAttribute('y',y+(n===2?20:-12));text.textContent=`${n+1}. ${p.name}`;layer.append(text);
    });
  }
  $('next').onclick=()=>{index=Tour.nextIndex(index,stops.length);show();};
  $('prev').onclick=()=>{index=Tour.prevIndex(index,stops.length);show();};
  $('slow').onclick=()=>{slow=!slow;$('slow').setAttribute('aria-pressed',String(slow));$('slow').textContent=`Slow Tour: ${slow?'on (6 seconds)':'off (2 seconds)'}`;};
  function sync(){
    for(const k of ['heading','speed','height'])$(k).value=state[k];
    $('headingOut').textContent=`${Math.round(state.heading)}°`;$('speedOut').textContent=`${state.speed} m/s`;$('heightOut').textContent=`${state.height} m`;
    $('play').textContent=state.paused?'Start flight':'Pause flight';
    $('telemetry').textContent=`${state.paused?'PAUSED':'FLYING'} · LAT ${state.lat.toFixed(5)} · LON ${state.lon.toFixed(5)}`;
  }
  function reset(){const p=stops[index];state={...Flight.initial(),lon:p?.lon??-72.24336,lat:p?.lat??19.57333};lastTime=null;sync();renderFlight();}
  function renderFlight(){if(!viewer)return;const pos=Cesium.Cartesian3.fromDegrees(state.lon,state.lat,state.height);aircraft.position=pos;
    viewer.camera.setView({destination:Cesium.Cartesian3.fromDegrees(state.lon,state.lat,state.height+1600),orientation:{heading:Cesium.Math.toRadians(state.heading),pitch:Cesium.Math.toRadians(-55),roll:0}});
  }
  function setMode(next){mode=next;state.paused=true;lastTime=null;$('tourPanel').hidden=mode!=='tour';$('flightPanel').hidden=mode!=='flight';$('tourMode').setAttribute('aria-pressed',String(mode==='tour'));$('flightMode').setAttribute('aria-pressed',String(mode==='flight'));if(aircraft)aircraft.show=mode==='flight';if(viewer)viewer.camera.cancelFlight();if(mode==='flight')reset();else show();sync();}
  $('tourMode').onclick=()=>setMode('tour');$('flightMode').onclick=()=>setMode('flight');
  $('play').onclick=()=>{state.paused=!state.paused;lastTime=null;sync();};$('reset').onclick=reset;
  for(const k of ['heading','speed','height'])$(k).oninput=()=>{state[k]=Number($(k).value);sync();if(mode==='flight')renderFlight();};
  document.addEventListener('keydown',e=>{if(mode!=='flight'||/INPUT|BUTTON|A|TEXTAREA|SELECT|SUMMARY/.test(e.target.tagName))return;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))return;e.preventDefault();
    if(e.key==='ArrowLeft')state.heading=Flight.wrap(state.heading-5);if(e.key==='ArrowRight')state.heading=Flight.wrap(state.heading+5);
    if(e.key==='ArrowUp')state.height=Flight.clamp(state.height+50,500,5000);if(e.key==='ArrowDown')state.height=Flight.clamp(state.height-50,500,5000);
    if(e.key===' ')state.paused=!state.paused;sync();renderFlight();
  });
  document.addEventListener('visibilitychange',()=>{state.paused=true;lastTime=null;sync();});
  function frame(t){if(mode==='flight'&&!state.paused){const dt=lastTime===null?0:Math.min((t-lastTime)/1000,0.1);state=Flight.step(state,dt);renderFlight();sync();}lastTime=t;requestAnimationFrame(frame);}
  function noGlobe(msg){viewer=null;$('globe').hidden=true;$('fallback').hidden=false;$('mapMode').textContent='COORDINATE PLOT';$('message').textContent=msg;}
  if(typeof Cesium==='undefined')noGlobe('Cesium did not load. Check internet/CDN access. Tour descriptions and simulated coordinates still work.');
  else try {
    viewer=new Cesium.Viewer('globe',{baseLayer:false,baseLayerPicker:false,geocoder:false,animation:false,timeline:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,fullscreenButton:false,infoBox:false,selectionIndicator:false,terrainProvider:new Cesium.EllipsoidTerrainProvider()});
    viewer.imageryLayers.addImageryProvider(new Cesium.GridImageryProvider({cells:12,color:Cesium.Color.fromCssColorString('#557fe0'),glowColor:Cesium.Color.fromCssColorString('#00209f'),backgroundColor:Cesium.Color.fromCssColorString('#163b91')}));
    viewer.scene.backgroundColor=Cesium.Color.fromCssColorString('#071c65');
    markers=stops.map((p,n)=>viewer.entities.add({position:Cesium.Cartesian3.fromDegrees(p.lon,p.lat,0),point:{pixelSize:12,color:Cesium.Color.WHITE,outlineColor:Cesium.Color.BLACK,outlineWidth:2},label:{text:`${n+1}. ${p.name}`,font:'13px sans-serif',pixelOffset:new Cesium.Cartesian2(0,-22),showBackground:true}}));
    aircraft=viewer.entities.add({show:false,position:Cesium.Cartesian3.fromDegrees(state.lon,state.lat,state.height),point:{pixelSize:13,color:Cesium.Color.fromCssColorString('#ff4765')},label:{text:'SIMULATED AIRCRAFT',font:'12px sans-serif',pixelOffset:new Cesium.Cartesian2(0,-24),showBackground:true}});
    $('message').textContent='Virtual tour ready. Grid globe: no terrain or satellite imagery.';
  }catch(e){if(viewer&&!viewer.isDestroyed())viewer.destroy();noGlobe('WebGL could not start. Tour descriptions and simulated coordinates still work.');console.error(e);}
  show();sync();requestAnimationFrame(frame);
})();