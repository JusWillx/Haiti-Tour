/* Pure view helpers: testable without WebGL or network access. */
(function(root){
 const imageryUrl='https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';
 const terrainUrl='https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer';
 const ranges={citadelle:900,'sans-souci':650};
 function rangeFor(p){return Number.isFinite(p?.cameraRange)?p.cameraRange:ranges[p?.id]||1200;}
 function flightDuration(slow,reduced=false){return reduced?0:slow?6:0.8;}
 function bounds(p){
   const span=Number.isFinite(p?.imagerySpan)?p.imagerySpan:0.008;
   const lon=Number.isFinite(p?.lon)?p.lon:-72.24336,lat=Number.isFinite(p?.lat)?p.lat:19.57333;
   return [lon-span,lat-span*0.75,lon+span,lat+span*0.75];
 }
 function exportUrl(p,width=1024,height=768){
   const url=new URL(imageryUrl+'/export');
   url.search=new URLSearchParams({bbox:bounds(p).join(','),bboxSR:'4326',imageSR:'4326',size:`${width},${height}`,format:'jpg',f:'image'});
   return url.href;
 }
 function renderOptions(){return {requestRenderMode:true,maximumRenderTimeChange:Infinity,targetFrameRate:30,useBrowserRecommendedResolution:true,shadows:false,shouldAnimate:false,msaaSamples:1};}
 function destinationGuidance(state,p){
   const rad=Math.PI/180,lat1=state.lat*rad,lat2=p.lat*rad,dlat=lat2-lat1,dlon=(p.lon-state.lon)*rad;
   const a=Math.sin(dlat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2;
   const distance=6371000*2*Math.atan2(Math.sqrt(Math.min(1,a)),Math.sqrt(Math.max(0,1-a)));
   const bearing=(Math.atan2(Math.sin(dlon)*Math.cos(lat2),Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dlon))/rad+360)%360;
   return {distance,bearing,arrived:distance<=250};
 }
 const api={destinationGuidance,imageryUrl,terrainUrl,rangeFor,flightDuration,bounds,exportUrl,renderOptions};
 if(typeof module!=='undefined')module.exports=api;root.View=api;
})(globalThis);
