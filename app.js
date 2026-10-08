/* V2: real imagery/elevation through Cesium, responsive UI, no idle flight loop. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const all = typeof PLACES !== 'undefined' ? PLACES : [];
  const stops = Tour.usable(all);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, slow = false, mode = 'tour', tilted = false, light = window.innerWidth < 700;
  let viewer = null, markers = [], aircraft = null, runningFrame = null, lastFrame = null, lastHud = 0;
  let state = Flight.initial(), generation = 0, terrainReady = false, busy = false;
  const heights = new Map();
  let closeupLayer=null,closeupTicket=0,closeupStop=null,wideLayer=null,wideLoading=false,terrainRequested=false;
  const buttons = [];
  const stats = { flightFrames: 0, hudUpdates: 0, renderedFrames: 0, lastCameraDuration: 0, bootState: 'loading', errors: [] };
  // Read-only diagnostics aid reproducible tests; no credentials are present.
  window.HaitiLab = { get viewer(){return viewer;}, get stats(){return {...stats};}, get state(){return {...state};}, get mode(){return mode;}, get terrainReady(){return terrainReady;} };

  function status(message){ $('message').textContent = message; }
  function render(){ if(viewer) viewer.scene.requestRender(); }
  function textLink(parent,label,url){
    const row = document.createElement('p');
    try { const parsed = new URL(url); if(parsed.protocol !== 'https:') throw Error('Unsafe URL');
      const a = document.createElement('a'); a.href = parsed.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = label+' ↗'; row.append(a);
    } catch { row.textContent = label+': URL unavailable'; }
    parent.append(row);
  }
  all.forEach((p,n) => {
    const issues = Tour.validatePlace(p);
    if(issues.length){ const line = document.createElement('p'); line.textContent = `Needs verification: ${p?.name || 'Record '+(n+1)} — ${issues.join('; ')}`; $('problems').append(line); }
  });
  stops.forEach((p,n) => {
    const button = document.createElement('button'), num = document.createElement('span'), label = document.createElement('span');
    num.className = 'stop-number'; num.textContent = n+1; label.textContent = p.name; button.append(num,label);
    button.setAttribute('aria-label',`Visit ${p.name}`); button.onclick = () => select(n);
    $('stopList').append(button); buttons.push(button);
  });

  function preview(){
    const p = stops[index]; if(!p) return;
    const image = $('satellitePreview'); image.alt = `Satellite image centered on ${p.name}`;
    image.onerror = () => { $('imageFailure').hidden = false; };
    image.onload = () => { $('imageFailure').hidden = true; };
    image.src = View.exportUrl(p);
  }
  function showDetails(){
    const p = stops[index];
    for(const id of ['prev','next','slow']) $(id).disabled = !p;
    if(!p){ $('name').textContent = 'No verified stops'; $('count').textContent = '0 STOPS'; $('desc').textContent = 'Complete the missing fields in places.js.'; return; }
    $('count').textContent = `STOP ${index+1} / ${stops.length}`;
    $('name').textContent = p.name; $('era').textContent = p.era; $('desc').textContent = p.description;
    $('coords').textContent = `${p.lat.toFixed(5)}° N · ${Math.abs(p.lon).toFixed(5)}° W · approximate`;
    $('source').replaceChildren(); textLink($('source'),'History · UNESCO',p.source); textLink($('source'),'Coordinate record',p.coordinateSource);
    const date = document.createElement('p'); date.textContent = 'Checked: '+p.checked; $('source').append(date);
    $('coordinateNote').textContent = p.coordinateNote;
    buttons.forEach((b,n) => b.setAttribute('aria-pressed',String(n===index)));
    markers.forEach((m,n) => { m.point.color = n===index ? Cesium.Color.fromCssColorString('#d21034') : Cesium.Color.WHITE; });
    if(!viewer) preview();else loadCloseup();
  }
  function closeupProvider(p){
    // Start at cached, local-area tiles rather than loading the whole-world pyramid.
    return new Cesium.UrlTemplateImageryProvider({
      url:View.imageryUrl+'/tile/{z}/{y}/{x}',
      rectangle:Cesium.Rectangle.fromDegrees(...View.bounds(p)),
      minimumLevel:p.id==='heritage'?11:14,maximumLevel:18,
      credit:new Cesium.Credit('Satellite imagery: Esri, Vantor, Earthstar Geographics, GIS User Community')
    });
  }
  async function loadCloseup(){
    if(!viewer||!stops[index]||closeupStop===stops[index].id)return;
    const p=stops[index],ticket=++closeupTicket,boot=generation;
    try{
      // A bounded, high-detail tile layer avoids loading low-resolution world tiles.
      const provider=closeupProvider(p);
      if(ticket!==closeupTicket||boot!==generation||!viewer)return;
      if(closeupLayer)viewer.imageryLayers.remove(closeupLayer,true);
      closeupLayer=viewer.imageryLayers.addImageryProvider(provider);closeupStop=p.id;render();
    }catch(e){if(ticket===closeupTicket)stats.errors.push('Close-up imagery: '+e.message);}
  }
  function select(n){ index = n; showDetails(); if(mode==='flight')resetFlight(); else focusStop(); }
  function groundHeight(p){
    const sample = heights.get(p.id);
    if(Number.isFinite(sample)) return sample;
    if(viewer){ const height = viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(p.lon,p.lat)); if(Number.isFinite(height))return height; }
    return 0;
  }
  function focusStop(instant=false){
    if(!viewer || !stops[index]) return;
    const p=stops[index], center=Cesium.Cartesian3.fromDegrees(p.lon,p.lat,groundHeight(p));
    viewer.camera.cancelFlight();
    const duration = instant ? 0 : View.flightDuration(slow,reducedMotion.matches);
    stats.lastCameraDuration = duration;
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(center,15),{
      offset:new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0),Cesium.Math.toRadians(tilted ? -42 : -90),View.rangeFor(p)),
      duration, complete:()=>{viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);render();}
    });
    render();
  }
  $('next').onclick = () => select(Tour.nextIndex(index,stops.length));
  $('prev').onclick = () => select(Tour.prevIndex(index,stops.length));
  $('slow').onclick = () => { slow=!slow; $('slow').setAttribute('aria-pressed',String(slow)); $('slow').textContent = slow?'Slow Tour: on · 6 seconds':'Slow Tour: off'; };
  $('recenter').onclick = () => { if(mode==='flight'){pauseFlight();resetFlight();}else focusStop(); };
  $('topView').onclick = () => {tilted=false; $('topView').setAttribute('aria-pressed','true'); $('tiltView').setAttribute('aria-pressed','false'); if(mode==='tour')focusStop();};
  $('tiltView').onclick = () => {tilted=true; $('topView').setAttribute('aria-pressed','false'); $('tiltView').setAttribute('aria-pressed','true'); if(mode==='tour')focusStop();};
  function zoom(factor){ if(!viewer)return;if(factor<0)ensureWideImagery(); pauseFlight(); viewer.camera.cancelFlight(); const amount=Math.max(50,viewer.camera.positionCartographic.height*factor); if(factor>0)viewer.camera.zoomIn(amount);else viewer.camera.zoomOut(-amount);render(); }
  $('zoomIn').onclick=()=>zoom(.25); $('zoomOut').onclick=()=>zoom(-.35);
  function graphics(){
    $('quality').setAttribute('aria-pressed',String(light));
    if(viewer){viewer.resolutionScale=light ? 0.7 : 1;viewer.targetFrameRate=light?24:30;viewer.scene.globe.maximumScreenSpaceError=light?4:2;render();}
  }
  $('quality').onclick=()=>{light=!light;graphics();};graphics();

  function syncControls(){
    for(const key of ['heading','speed','height']) $(key).value=String(state[key]);
    $('headingOut').textContent=Math.round(state.heading)+'°';$('speedOut').textContent=state.speed+' m/s';$('heightOut').textContent=state.height+' m';
    $('play').textContent=state.paused?'Start flight':'Pause flight';updateHud();
  }
  function updateHud(){stats.hudUpdates++;$('telemetry').textContent=`${state.paused?'PAUSED':'FLYING'} · LAT ${state.lat.toFixed(5)} · LON ${state.lon.toFixed(5)}`;}
  function pauseFlight(){state.paused=true;if(runningFrame!==null)cancelAnimationFrame(runningFrame);runningFrame=null;lastFrame=null;syncControls();}
  function resetFlight(){
    pauseFlight();const p=stops[index];state={...Flight.initial(),lon:p?.lon??-72.24336,lat:p?.lat??19.57333,height:Math.max(2200,Math.ceil((p?groundHeight(p):0)+600))};
    syncControls();renderFlight();
  }
  function renderFlight(){
    if(!viewer || !aircraft)return;
    // A rear chase-camera so the aircraft marker stays in view.
    const heading=state.heading*Math.PI/180,back=250;
    const camLat=state.lat-Math.cos(heading)*back/111320;
    const camLon=state.lon-Math.sin(heading)*back/(111320*Math.cos(state.lat*Math.PI/180));
    aircraft.position=Cesium.Cartesian3.fromDegrees(state.lon,state.lat,state.height);
    viewer.camera.setView({destination:Cesium.Cartesian3.fromDegrees(camLon,camLat,state.height+160),orientation:{heading:Cesium.Math.toRadians(state.heading),pitch:Cesium.Math.toRadians(-30),roll:0}});
    render();
  }
  function frame(time){
    runningFrame=null;if(state.paused || mode!=='flight' || !viewer)return;
    const dt=lastFrame===null?0:Math.min((time-lastFrame)/1000,.1);lastFrame=time;
    state=Flight.step(state,dt);stats.flightFrames++;renderFlight();
    if(time-lastHud>=150){updateHud();lastHud=time;}
    runningFrame=requestAnimationFrame(frame);
  }
  function startFlight(){
    if(!viewer || mode!=='flight')return; state.paused=false;lastFrame=null;syncControls();
    if(runningFrame===null)runningFrame=requestAnimationFrame(frame);
  }
  $('play').onclick=()=>state.paused?startFlight():pauseFlight();$('reset').onclick=resetFlight;
  for(const key of ['heading','speed','height']) $(key).oninput=()=>{state[key]=Number($(key).value);syncControls();if(mode==='flight')renderFlight();};
  function adjust(action){
    if(mode!=='flight')return;
    if(action==='left')state.heading=Flight.wrap(state.heading-5);
    if(action==='right')state.heading=Flight.wrap(state.heading+5);
    if(action==='up')state.height=Flight.clamp(state.height+50,1200,5000);
    if(action==='down')state.height=Flight.clamp(state.height-50,1200,5000);
    syncControls();renderFlight();
  }
  $('turnLeft').onclick=()=>adjust('left');$('turnRight').onclick=()=>adjust('right');$('climb').onclick=()=>adjust('up');$('descend').onclick=()=>adjust('down');
  function setMode(next){
    if(next==='flight'&&!viewer)return;
    pauseFlight();mode=next;$('tourPanel').hidden=mode!=='tour';$('flightPanel').hidden=mode!=='flight';
    $('tourMode').setAttribute('aria-pressed',String(mode==='tour'));$('flightMode').setAttribute('aria-pressed',String(mode==='flight'));
    if(viewer){viewer.camera.cancelFlight();aircraft.show=mode==='flight';}
    if(mode==='flight'){ensureWideImagery();resetFlight();}else{if(wideLayer){viewer.imageryLayers.remove(wideLayer,true);wideLayer=null;}focusStop();}render();
  }
  $('tourMode').onclick=()=>setMode('tour');$('flightMode').onclick=()=>setMode('flight');
  document.addEventListener('keydown',e=>{
    if(mode!=='flight'||e.ctrlKey||e.metaKey||/INPUT|BUTTON|A|TEXTAREA|SELECT|SUMMARY/.test(e.target.tagName))return;
    const actions={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
    if(actions[e.key]){e.preventDefault();adjust(actions[e.key]);}
    else if(e.key===' '){e.preventDefault();state.paused?startFlight():pauseFlight();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseFlight();});
  window.addEventListener('pagehide',pauseFlight);

  function mapButtons(enabled){for(const id of ['flightMode','recenter','topView','tiltView','zoomIn','zoomOut','quality','terrainToggle'])$(id).disabled=!enabled;}
  mapButtons(false);
  function failMap(message){
    pauseFlight();if(mode==='flight')setMode('tour');
    if(viewer&&!viewer.isDestroyed())viewer.destroy();viewer=null;markers=[];aircraft=null;closeupLayer=null;closeupStop=null;wideLayer=null;wideLoading=false;closeupTicket++;terrainReady=false;
    stats.bootState='failed';$('mapFallback').hidden=false;$('fallbackLabel').textContent='Satellite preview · interactive map unavailable';$('mapMode').textContent='SATELLITE PREVIEW';$('retry').hidden=false;mapButtons(false);preview();status(message);
  }
  async function loadEngine(){
    if(window.Cesium)return;
    window.CESIUM_BASE_URL=new URL('vendor/cesium/',document.baseURI).href;
    const existing=$('cesiumScript');if(existing)existing.remove();
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.id='cesiumScript';script.src='vendor/cesium/Cesium.js';script.async=true;
      const timeout=setTimeout(()=>reject(Error('Cesium engine timed out')),20000);
      script.onload=()=>{clearTimeout(timeout);resolve();};script.onerror=()=>{clearTimeout(timeout);reject(Error('Cesium engine could not load'));};document.head.append(script);
    });
  }
  function deadline(promise,ms,label){return Promise.race([promise,new Promise((_,reject)=>{const timer=setTimeout(()=>reject(Error(label+' timed out')),ms);promise.finally(()=>clearTimeout(timer)).catch(()=>{});})]);}
  async function ensureWideImagery(){
    if(!viewer||wideLayer||wideLoading)return;wideLoading=true;const boot=generation;
    try{
      const provider=await deadline(Cesium.ArcGisMapServerImageryProvider.fromUrl(View.imageryUrl,{maximumLevel:18,rectangle:Cesium.Rectangle.fromDegrees(-74.5,18,-71.5,20.2)}),15000,'Wider-area imagery');
      if(!viewer||boot!==generation)return;wideLayer=viewer.imageryLayers.addImageryProvider(provider,0);render();
    }catch(e){stats.errors.push('Wider imagery: '+e.message);status('Selected landmark imagery is available. Wider-area imagery could not load.');}
    finally{wideLoading=false;}
  }
  async function loadTerrain(boot,terrainPromise){
    try{
      const terrain=await deadline(terrainPromise || Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(View.terrainUrl),15000,'Terrain');
      if(boot!==generation||!viewer||!terrainRequested)return;
      terrain.errorEvent.addEventListener(error=>{stats.errors.push('Terrain: '+error.message);status('Some terrain tiles could not load. The satellite view remains available.');});
      if(viewer.terrainProvider!==terrain)viewer.terrainProvider=terrain;terrainReady=true;stats.bootState='ready';$('terrainToggle').textContent='3D terrain: on';$('mapMode').textContent='SATELLITE · TERRAIN STREAMING';
      status('Satellite view ready. Mountain detail is streaming.');render();
      // A bounded-resolution sample avoids querying the entire high-resolution terrain pyramid.
      const samples=stops.map(p=>Cesium.Cartographic.fromDegrees(p.lon,p.lat));
      try{
        const positions=await deadline(Cesium.sampleTerrain(terrain,12,samples),12000,'Stop elevations');
        if(boot!==generation||!viewer||!terrainRequested)return;
        positions.forEach((pos,n)=>{if(Number.isFinite(pos.height))heights.set(stops[n].id,pos.height);});
        if(mode==='tour')focusStop(true);
      }catch(e){stats.errors.push('Elevation samples: '+e.message);}
    }catch(e){
      if(boot!==generation||!viewer||!terrainRequested)return;stats.errors.push(e.message);stats.bootState='imagery-only';terrainRequested=false;$('terrainToggle').setAttribute('aria-pressed','false');$('terrainToggle').textContent='3D terrain: unavailable';$('mapFallback').hidden=true;
      $('mapMode').textContent='SATELLITE · ELEVATION UNAVAILABLE';status('Satellite view is ready. Elevation service unavailable; this view is flat.');
    }
  }
  async function initialize(){
    if(busy)return;busy=true;const boot=++generation;$('retry').hidden=true;stats.bootState='loading';status('Loading Cesium satellite view. The tour controls are ready.');
    try{
      await loadEngine();
      if(boot!==generation)return;
      const first=stops[index] || {id:'citadelle',lon:-72.24336,lat:19.57333};
      const imagery=closeupProvider(first);
      if(boot!==generation)return;
      const opts={...View.renderOptions(),baseLayer:new Cesium.ImageryLayer(imagery),baseLayerPicker:false,geocoder:false,animation:false,timeline:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,fullscreenButton:false,infoBox:false,selectionIndicator:false,terrainProvider:new Cesium.EllipsoidTerrainProvider(),skyBox:false,skyAtmosphere:false,orderIndependentTranslucency:false};
      viewer=new Cesium.Viewer('globe',opts);closeupLayer=viewer.imageryLayers.get(0);closeupStop=first.id;
      viewer.clock.shouldAnimate=false;viewer.scene.globe.enableLighting=false;viewer.scene.globe.preloadAncestors=false;viewer.scene.globe.preloadSiblings=false;if(viewer.scene.sun)viewer.scene.sun.show=false;if(viewer.scene.moon)viewer.scene.moon.show=false;
      viewer.scene.screenSpaceCameraController.minimumZoomDistance=80;
      viewer.scene.postProcessStages.fxaa.enabled=false;
      viewer.scene.backgroundColor=Cesium.Color.fromCssColorString('#15283c');
      viewer.scene.postRender.addEventListener(()=>stats.renderedFrames++);
      viewer.scene.globe.tileLoadProgressEvent.addEventListener(pending=>{if(!terrainReady)return;if(pending===0){$('mapFallback').hidden=true;$('mapMode').textContent='SATELLITE + 3D TERRAIN';status('Satellite imagery and terrain ready. Select a stop to explore.');}else{$('mapMode').textContent='SATELLITE · TERRAIN STREAMING';status('Satellite view ready. Mountain detail is streaming.');}});
      viewer.scene.renderError.addEventListener((scene,error)=>{stats.errors.push(error.message);failMap('The 3D renderer stopped. Try Lighter graphics after reloading or use a browser with WebGL enabled.');});
      $('globe').addEventListener('pointerdown',ensureWideImagery,{once:true});
      const providerError=()=>{status('Some satellite tiles could not load. Check your connection or zoom out.');};imagery.errorEvent.addEventListener(providerError);
      markers=stops.map((p,n)=>viewer.entities.add({id:p.id,position:Cesium.Cartesian3.fromDegrees(p.lon,p.lat),point:{pixelSize:9,color:Cesium.Color.WHITE,outlineColor:Cesium.Color.fromCssColorString('#00209f'),outlineWidth:2,heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,disableDepthTestDistance:Number.POSITIVE_INFINITY},label:{text:`${n+1}. ${p.name}`,font:'12px sans-serif',showBackground:true,backgroundColor:Cesium.Color.fromCssColorString('#142744dd'),pixelOffset:new Cesium.Cartesian2(0,-24),heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,disableDepthTestDistance:Number.POSITIVE_INFINITY,distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0,18000)}}));
      aircraft=viewer.entities.add({show:false,position:Cesium.Cartesian3.fromDegrees(state.lon,state.lat,state.height),billboard:{image:'assets/aircraft.svg',width:34,height:34,disableDepthTestDistance:Number.POSITIVE_INFINITY},label:{text:'SIMULATED FLIGHT',font:'10px sans-serif',pixelOffset:new Cesium.Cartesian2(0,-29),showBackground:true}});
      viewer.screenSpaceEventHandler.setInputAction(event=>{if(mode!=='tour')return;const pick=viewer.scene.pick(event.position);const selected=stops.findIndex(p=>p.id===pick?.id?.id);if(selected>=0)select(selected);},Cesium.ScreenSpaceEventType.LEFT_CLICK);
      $('mapFallback').hidden=true;stats.bootState='imagery-only';$('mapMode').textContent='SATELLITE VIEW · CESIUM';mapButtons(stops.length>0);graphics();showDetails();focusStop(true);
      status('Satellite view ready. Use 3D Terrain to load mountain elevation.');
      if(typeof ResizeObserver!=='undefined'){const resize=new ResizeObserver(()=>{if(viewer){viewer.resize();render();}});resize.observe($('globe'));}

    }catch(error){stats.errors.push(error.message);failMap('Interactive map unavailable: '+error.message+'. Tour descriptions and satellite preview remain available.');}
    finally{busy=false;}
  }
  $('terrainToggle').onclick=()=>{
    if(!viewer)return;pauseFlight();terrainRequested=!terrainRequested;
    $('terrainToggle').setAttribute('aria-pressed',String(terrainRequested));
    if(terrainRequested){$('terrainToggle').textContent='3D terrain: loading…';preview();$('mapFallback').hidden=false;$('fallbackLabel').textContent='Satellite preview · 3D terrain is streaming';loadTerrain(generation);}
    else{terrainReady=false;heights.clear();viewer.terrainProvider=new Cesium.EllipsoidTerrainProvider();$('terrainToggle').textContent='3D terrain: off';$('mapFallback').hidden=true;$('mapMode').textContent='SATELLITE VIEW · CESIUM';status('Satellite view ready. 3D mountain terrain is off.');focusStop(true);render();}
  };
  $('retry').onclick=initialize;showDetails();syncControls();initialize();
})();
