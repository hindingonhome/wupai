import {mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
await mkdir('verification',{recursive:true});
const server=spawn(process.execPath,['server.cjs'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:8765')).ok)break;}catch{}await sleep(100);}
for(const file of ['onboarding-navigation.cjs','fixed-thumbnails.cjs','selection-smooth.cjs','switch-lighting.cjs','icon-centering.cjs','help.cjs','responsive.cjs','liquid-layout.cjs','personal-library.cjs','v121-ui.cjs','preferences-management.cjs','plate.cjs','surface-workflow.cjs','work-assets.cjs','work-retained-texture.cjs','palette-export.cjs','collection-gear.cjs','texture-studio.cjs','texture-worker-fallback.cjs','texture-import-race.cjs','object-patterns.cjs','texture-catalog-resilience.cjs','texture-management.cjs','texture-delete-race.cjs','graphical-textures.cjs','hover-selected.cjs','plate-planar.cjs'])await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['tests/'+file],{stdio:'inherit'});child.on('exit',code=>code===0?resolve():reject(new Error(file+' failed '+code)));});}finally{server.kill();}
