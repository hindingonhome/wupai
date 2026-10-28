import {popovers} from './popovers.mjs';
export function initExportMenu({viewer,getKind,getName,download,status}){
 const host=document.querySelector('.gallery-console'),trigger=document.getElementById('capture');
 const menu=document.createElement('div');menu.id='export-menu';menu.className='export-menu';menu.hidden=true;menu.setAttribute('role','group');menu.setAttribute('aria-label','保存与作品');
 const filename=()=>String(getName?.()||getKind()).replace(/[<>:\x22/\\|?*\x00-\x1f]/g,'-').slice(0,80)||'作品';
 const group=(id,label)=>{const section=document.createElement('section');section.id=id;section.className='export-group';section.setAttribute('role','group');section.setAttribute('aria-label',label);const heading=document.createElement('p');heading.className='export-group-label';heading.textContent=label;section.append(heading);menu.append(section);return section;};
 const pictures=group('export-picture-group','图片'),works=group('export-work-group','可继续编辑的作品'),models=group('export-model-group','模型');
 const hint=document.createElement('p');hint.className='export-work-hint';hint.textContent='保存后，下次继续编辑。';works.append(hint);
 const picture=document.createElement('button'),model=document.createElement('button');picture.type=model.type='button';picture.textContent='保存图片';picture.id='export-image';model.textContent='导出模型';model.id='export-model';pictures.append(picture);models.append(model);host.append(menu);
 trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
 let busy=false;
 popovers.register('export',{element:menu,trigger,hover:true});
 const close=()=>popovers.close('export'),open=()=>popovers.open('export');
 trigger.onclick=()=>popovers.toggle('export');
 picture.onclick=async()=>{if(busy)return;busy=true;picture.disabled=true;try{const saved=await download(viewer.capture(),`物派-${filename()}-${Date.now()}.png`);status(saved?.cancelled?'已取消保存。':'已导出当前三维展品画面 PNG。');close();}catch(error){status('画面导出失败：'+error.message,true);}finally{busy=false;picture.disabled=false;}};
 model.onclick=async()=>{
  if(busy)return;busy=true;model.disabled=true;model.textContent='正在导出…';status('正在整理模型与当前材质…');
  try{await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));const data=await viewer.exportModel(),url=URL.createObjectURL(new Blob([data],{type:'model/gltf-binary'}));let saved;try{saved=await download(url,`物派-${filename()}-${Date.now()}.glb`);}finally{setTimeout(()=>URL.revokeObjectURL(url),60000);}status(saved?.cancelled?'已取消保存。':'已导出 GLB，包含当前纹样、密度与材质。');close();}
  catch(error){status('模型导出失败：'+error.message,true);}
  finally{busy=false;model.disabled=false;model.textContent='导出模型';}
 };
 return {close,open};
}
