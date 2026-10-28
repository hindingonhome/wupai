import {popovers} from './popovers.mjs';
import {swatchItem} from './swatch-item.mjs';
import {styleSwatch} from './swatch-style.mjs';
import {ARTIFACTS} from './artifact-library.mjs';
import {FRUIT_PROFILES} from './fruit-profiles.mjs';
const ordered=[];
const add=id=>{if(id!=='peach'&&FRUIT_PROFILES[id]&&!ordered.includes(id))ordered.push(id);};
for(const item of ARTIFACTS.filter(item=>item.category==='fruit')){
 add(item.id);add(item.id+'-production');
 if(item.id==='apple'){add('apple-green');add('apple-green-production');}
 if(item.id==='banana')add('banana-blue');
}
for(const id of Object.keys(FRUIT_PROFILES))add(id);
export const VASE_PROFILE_IDS=Object.freeze(ordered);

export function initVaseTextures({viewer,getKind,getOwned=()=>[],getTextures=()=>[],getSurface=()=>'',onTexture=()=>{},onApplied=()=>{},onRemove=()=>{}}){
 const groups=[];
 function close(){for(const group of groups)popovers.close(group.popover.id);}
 function position(group){
  const rect=group.more.getBoundingClientRect(),panel=group.popover;
  const width=panel.getBoundingClientRect().width,height=panel.getBoundingClientRect().height;
  panel.style.left=Math.max(12,Math.min(innerWidth-width-12,rect.left+rect.width/2-width/2))+'px';
  panel.style.top=Math.max(12,rect.top-height-12)+'px';
 }
 function syncPressed(){for(const group of groups){for(const button of group.buttons)button.setAttribute('aria-pressed',String(!viewer.settings?.solid&&!viewer.settings?.original&&(viewer.settings?.vaseProfile===button.dataset.vaseProfile||(viewer.settings?.fruitFlow&&viewer.settings?.fruitProfile===button.dataset.vaseProfile))));for(const button of group.custom.values())button.setAttribute('aria-pressed',String(!viewer.settings?.original&&getSurface()===button.dataset.textureId));}}
 for(const [index,host]of [...document.querySelectorAll('.quick-patterns,.sample-row')].entries()){
  const more=document.createElement('button');more.type='button';more.className='vase-more';more.innerHTML='<span class="sr-only">...</span><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';more.setAttribute('aria-label','更多花瓶纹样');more.setAttribute('aria-expanded','false');more.setAttribute('aria-controls','vase-textures-'+index);
  const popover=document.createElement('div');popover.id='vase-textures-'+index;popover.className='vase-texture-popover';popover.hidden=true;popover.setAttribute('role','group');popover.setAttribute('aria-label','更多花瓶纹样');document.body.append(popover);
  const group={host,more,popover,buttons:[],custom:new Map()};groups.push(group);
  for(const id of VASE_PROFILE_IDS){
   const profile=FRUIT_PROFILES[id],button=document.createElement('button');button.type='button';button.className='swatch vase-profile';button.dataset.vaseProfile=id;button.setAttribute('aria-label',profile.name+(id.endsWith('-production')?'纹样':'原配色纹样'));button.setAttribute('aria-pressed','false');styleSwatch(button,profile.colors,profile.weights);
   button.onclick=async()=>{
    document.querySelectorAll('.quick-patterns .swatch,.sample-row .swatch').forEach(other=>other.setAttribute('aria-pressed','false'));
    await onApplied(id);refresh();close();
   };
   button._swatchItem=host.matches('.quick-patterns')?swatchItem(button,()=>onRemove('vase-profile:'+id)):button;group.buttons.push(button);
  }
  group.base=[...host.querySelectorAll('[data-surface], [data-lacquer]')];if(host.matches('.quick-patterns'))for(const button of group.base){const next=button.nextSibling;button._swatchItem=swatchItem(button,()=>onRemove(button.dataset.surface||'lacquer'));host.insertBefore(button._swatchItem,next);}
  const clear=host.querySelector('#clear-texture');host.insertBefore(more,clear);
  popovers.register(popover.id,{element:popover,trigger:more,hover:true,parent:host.matches('.sample-row')?'lab':undefined,show:()=>{popover.hidden=false;position(group);}});
  more.onclick=()=>popovers.toggle(popover.id);
 }
 document.addEventListener('click',event=>{const button=event.target.closest?.('.swatch');if(button&&!button.dataset.vaseProfile&&button.closest('.quick-patterns,.sample-row,.vase-texture-popover'))for(const group of groups)for(const extra of group.buttons)extra.setAttribute('aria-pressed','false');});
 window.addEventListener('resize',close);window.addEventListener('scroll',close,true);
 function refresh(){
  close();
  for(const group of groups){
   group.host.classList.add('vase-palette');
   group.host.closest('.object-controls')?.classList.add('has-vase-palette');
   const live=new Set(getTextures().map(entry=>entry.id));for(const [id,button]of group.custom)if(!live.has(id)){(button._swatchItem||button).remove();group.custom.delete(id);}
   const all=group.host.matches('.sample-row'),owned=getOwned(getKind());
   for(const entry of getTextures())if(!group.custom.has(entry.id)){const button=document.createElement('button');button.type='button';button.className='swatch custom-texture';button.dataset.textureId=entry.id;button.dataset.userContent='';button.setAttribute('aria-label',entry.name);button.setAttribute('title',entry.name);styleSwatch(button,entry.colors);button.onclick=async()=>{await onTexture(entry);refresh();};button._swatchItem=all?button:swatchItem(button,()=>onRemove(entry.id));group.custom.set(entry.id,button);}
   for(const button of group.base){const show=all||owned.includes(button.dataset.surface||'lacquer');button.hidden=!show;if(button._swatchItem)button._swatchItem.hidden=!show;}const lacquer=group.base.find(button=>button.hasAttribute('data-lacquer'));
   const candidates=[...group.buttons,...group.custom.values()].filter(button=>{const id=button.dataset.textureId||'vase-profile:'+button.dataset.vaseProfile;const show=all||owned.includes(id);button.hidden=!show;if(button._swatchItem)button._swatchItem.hidden=!show;if(!show)group.popover.append(button._swatchItem||button);return show;});
   if(!all)candidates.sort((a,b)=>owned.indexOf(a.dataset.textureId||'vase-profile:'+a.dataset.vaseProfile)-owned.indexOf(b.dataset.textureId||'vase-profile:'+b.dataset.vaseProfile));
   const base=group.base.filter(button=>!button.hidden).length,visible=all?candidates.length:Math.max(0,8-base);
   candidates.forEach((button,index)=>{if(index<visible)group.host.insertBefore(button._swatchItem||button,group.more);else group.popover.append(button._swatchItem||button);});if(lacquer&&!lacquer.hidden)group.host.insertBefore(lacquer._swatchItem||lacquer,group.more);
   group.more.hidden=candidates.length<=visible;group.more.setAttribute('aria-label','更多纹样');group.popover.setAttribute('aria-label',all?'更多纹样':'当前器物纹样');
  }
  syncPressed();
 }
 refresh();return {refresh};
}
