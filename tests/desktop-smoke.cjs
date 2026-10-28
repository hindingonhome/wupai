if (process.env.WUPAI_TEST_EXECUTABLE) {
 require('./desktop-packaged-smoke.cjs');
} else {
const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
(async () => {
 const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'wupai-desktop-'));
 const downloads = path.join(temporary, 'downloads');
 const executablePath = process.env.WUPAI_TEST_EXECUTABLE;
 const application = await electron.launch({ ...(executablePath ? { executablePath, args: [] } : { args: ['.'] }), env: { ...process.env, WUPAI_TEST: '1', WUPAI_TEST_PROFILE: path.join(temporary, 'profile'), WUPAI_TEST_DOWNLOAD_DIR: downloads }, timeout: 120000 });
 try {
  const page = await application.firstWindow(); const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.waitForFunction(()=>globalThis.SAFARI_VIEWER && document.querySelector('#loading').hidden, undefined, {timeout:120000});
  assert.equal(await application.evaluate(({ BrowserWindow })=>BrowserWindow.getAllWindows()[0].getTitle()),'物派');
  assert.deepEqual(await page.evaluate(()=>[typeof require, typeof process, typeof Buffer, typeof wupaiDesktop.download]), ['undefined','undefined','undefined','function']);
  const preferences=await application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences());
  assert.equal(preferences.sandbox,true); assert.equal(preferences.contextIsolation,true); assert.equal(preferences.nodeIntegration,false); assert.equal(preferences.webSecurity,true);
  assert.ok(await page.evaluate(()=>document.querySelector('nav').contains(document.querySelector('#help-open'))&&document.querySelector('#site-header').contains(document.querySelector('#caption-name'))),'packaged interface must include V1.1.3 top bar');
  await page.locator('#help-open').click();await page.getByRole('tab',{name:'使用许可',exact:true}).click();assert.ok((await page.locator('#help-body').innerText()).includes('仅限个人非商业使用'));await page.getByRole('button',{name:'关闭使用说明'}).click();
  for(const id of ['apple','watermelon']) {
   await page.evaluate(id=>document.querySelector('[data-kind='+id+']').click(),id);
   await page.waitForFunction(()=>document.querySelector('#loading').hidden);
   assert.equal(await page.locator('[data-kind='+id+']').getAttribute('aria-pressed'),'true');
  }
  const download=async selector=>{await page.evaluate(()=>document.querySelector('#status').textContent='等待保存');await page.locator('#capture').click(); await page.locator(selector).click(); await page.waitForFunction(()=>/已导出/.test(document.querySelector('#status').textContent),undefined,{timeout:120000});};
  await download('#export-image');
  let png=fs.readdirSync(downloads).find(name=>name.endsWith('.png')); assert.ok(png); assert.equal(fs.readFileSync(path.join(downloads,png)).readUInt32BE(0),0x89504e47);
  await download('#export-model');
  let glb=fs.readdirSync(downloads).find(name=>name.endsWith('.glb')); assert.ok(glb); assert.equal(fs.readFileSync(path.join(downloads,glb)).readUInt32LE(0),0x46546c67);
  await page.locator('#texture-file').setInputFiles(path.join(downloads,png));
  await page.waitForFunction(()=>!document.querySelector('#export-texture').disabled);
  await application.evaluate(()=>{process.env.WUPAI_TEST_CANCEL_DOWNLOAD='1';});
  const cancelled=await page.evaluate(()=>wupaiDesktop.download('data:image/png;base64,iVBORw0KGgo=','cancelled.png'));
  assert.deepEqual(cancelled,{cancelled:true});
  await application.evaluate(()=>{delete process.env.WUPAI_TEST_CANCEL_DOWNLOAD;});
  assert.equal(await page.evaluate(()=>globalThis.QIWU_NATIVE_DOWNLOAD === undefined),true);
  const blocked=await page.evaluate(async()=>{try{await wupaiDesktop.download('https://example.com/remote.png','test.png');return false;}catch{return true;}}); assert.ok(blocked);
  await page.evaluate(()=>{window.open('https://example.com');}); assert.equal(application.windows().length,1);
  const response=await page.evaluate(async()=>{try{return (await fetch('https://example.com')).ok;}catch{return false;}}); assert.equal(response,false);
  assert.deepEqual(errors,[]);
  console.log('DESKTOP_BOOT_ISOLATION_SWITCH_IMPORT_PNG_GLB_PASS ' + (executablePath||'development'));
 } finally {await application.close(); fs.rmSync(temporary,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
}
