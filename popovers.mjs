// One primary floating surface at a time; an explicit child may retain its parent.
export const popovers=(()=>{
 const entries=new Map(),stack=[];
 const resolve=value=>typeof value==='function'?value():value;
 const element=entry=>resolve(entry.element),trigger=entry=>resolve(entry.trigger);
 const cancelPending=()=>{for(const entry of entries.values())clearTimeout(entry.openTimer);};
 function bindHover(id,entry){
  const roots=[...new Set([trigger(entry),element(entry)].filter(Boolean))];
  const enter=event=>{
   clearTimeout(entry.closeTimer);
   if(event.pointerType==='touch'||event.buttons||!matchMedia('(hover:hover)').matches||document.querySelector('dialog[open]')||stack.includes(id))return;
   cancelPending();entry.openTimer=setTimeout(()=>{if(!document.querySelector('dialog[open]'))open(id,{hover:true});},stack.length?80:120);
  };
  const leave=event=>{
   clearTimeout(entry.openTimer);clearTimeout(entry.closeTimer);
   if(roots.some(root=>root.contains(event.relatedTarget)))return;
   entry.closeTimer=setTimeout(()=>{if(!entry.pinned&&!document.querySelector('dialog[open]')&&!stack.some(other=>entries.get(other)?.parent===id))close(id);},240);
  };
  for(const root of roots){root.addEventListener('pointerenter',enter);root.addEventListener('pointerleave',leave);}
  return ()=>{clearTimeout(entry.openTimer);clearTimeout(entry.closeTimer);for(const root of roots){root.removeEventListener('pointerenter',enter);root.removeEventListener('pointerleave',leave);}};
 }
 function close(id,{restoreFocus=false}={}){
  const entry=entries.get(id);if(!entry)return;clearTimeout(entry.openTimer);clearTimeout(entry.closeTimer);entry.pinned=false;if(!stack.includes(id))return;
  for(const child of [...stack].reverse())if(entries.get(child)?.parent===id)close(child);
  stack.splice(stack.indexOf(id),1);
  const button=resolve(entry.returnFocus)||trigger(entry);trigger(entry)?.setAttribute('aria-expanded','false');
  if(entry.hide)entry.hide();else if(element(entry))element(entry).hidden=true;
  if(restoreFocus&&button?.isConnected&&!button.hidden)button.focus({preventScroll:true});
 }
 function open(id,{hover=false}={}){
  const entry=entries.get(id);if(!entry)return;
  cancelPending();clearTimeout(entry.closeTimer);entry.pinned=!hover||entry.pinned;
  const keep=new Set([id]);let parent=entry.parent;
  while(parent&&entries.has(parent)){keep.add(parent);parent=entries.get(parent).parent;}
  for(const other of [...stack].reverse())if(!keep.has(other))close(other);
  if(entry.parent&&!stack.includes(entry.parent))open(entry.parent);
  if(!stack.includes(id))stack.push(id);
  if(entry.show)entry.show();else if(element(entry))element(entry).hidden=false;
  const button=trigger(entry),root=element(entry);button?.setAttribute('aria-expanded','true');if(root?.id)button?.setAttribute('aria-controls',root.id);
  window.dispatchEvent(new CustomEvent('wupai-popover',{detail:id}));
 }
 function register(id,entry){
  close(id);entries.get(id)?.cleanup?.();entries.set(id,entry);const button=trigger(entry),root=element(entry);
  button?.setAttribute('aria-expanded','false');if(root?.id)button?.setAttribute('aria-controls',root.id);
  if(entry.hover)entry.cleanup=bindHover(id,entry);
  return ()=>{close(id);entry.cleanup?.();entries.delete(id);};
 }
 // Editing from a hover preview makes its parent persistent, including on cancel.
 if(typeof window!=='undefined')window.addEventListener('libraryediting',()=>{cancelPending();for(const id of stack){const entry=entries.get(id);entry.pinned=true;clearTimeout(entry.closeTimer);}});
 if(typeof document!=='undefined')document.addEventListener('pointerdown',event=>{
  cancelPending();
  if(document.querySelector('dialog[open]'))return;
  for(const id of [...stack].reverse()){
   const entry=entries.get(id);
   if(element(entry)?.contains(event.target)||trigger(entry)?.contains(event.target))break;
   close(id);
  }
 });
 if(typeof document!=='undefined')document.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||event.defaultPrevented)return;cancelPending();if(document.querySelector('dialog[open]')||!stack.length)return;
  event.preventDefault();event.stopImmediatePropagation();close(stack.at(-1),{restoreFocus:true});
 },true);
 return {register,open,close,toggle(id){stack.includes(id)&&entries.get(id)?.pinned?close(id):open(id);},isOpen:id=>stack.includes(id),closeAll(){cancelPending();for(const id of [...stack].reverse())close(id);}};
})();
