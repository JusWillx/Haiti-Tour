const cp=require('node:child_process'),path=require('node:path');
let failed=false;
for(const file of ['tests.js','flight-tests.js','feature-tests.js','view-tests.js','ui-logic-tests.js','break-and-repair.js']){
 console.log('\n=== '+file+' ===');const r=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit'});if(r.status!==0)failed=true;
}
process.exitCode=failed?1:0;
