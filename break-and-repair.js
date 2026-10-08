/* Required Path B exercise runs on a temporary copy and restores identical bytes. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'haiti-break-'));
for(const f of ['places.js','tour-core.js','tests.js'])fs.copyFileSync(path.join(__dirname,f),path.join(folder,f));
const file=path.join(folder,'places.js'),original=fs.readFileSync(file,'utf8');
const report=[];
function run(stage){const result=cp.spawnSync(process.execPath,[path.join(folder,'tests.js')],{encoding:'utf8'});report.push(stage+' · exit '+result.status+'\n'+result.stdout);return result.status;}
try{
 if(run('Before break')!==0)throw Error('Baseline failed');
 const broken=original.replace('"source": "https://whc.unesco.org/en/list/180/"','"source": ""');
 if(broken===original)throw Error('No mutation made');fs.writeFileSync(file,broken);
 const data=require(file),T=require(path.join(folder,'tour-core.js'));
 const warnings=T.validatePlace(data[0]);report.push('Data warning: '+data[0].name+': '+warnings.join('; '));
 if(!warnings.includes('missing source'))throw Error('Warning was not produced');
 if(run('After removing first historical source')===0)throw Error('Broken data unexpectedly passed');
 fs.writeFileSync(file,original);
 if(run('After repair')!==0)throw Error('Repair failed');
 report.push('Restored bytes equal original: '+(fs.readFileSync(file,'utf8')===original));
 console.log(report.join('\n\n'));
}finally{fs.rmSync(folder,{recursive:true,force:true});}
