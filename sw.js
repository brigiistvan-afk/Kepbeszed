// Képbeszéd – offline gyorsítótár. A verziót a build automatikusan számolja, kézzel nem kell módosítani.
const CACHE='kepbeszed-8f1f923627';
const FILES=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  if(req.mode==='navigate'){ // az oldal: előbb hálózat, offline a mentett változat
    e.respondWith(fetch(req).then(res=>{const cl=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cl));return res}).catch(()=>caches.match('index.html')));return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{
    if(res.ok){const cl=res.clone();caches.open(CACHE).then(c=>c.put(req,cl))} return res})));
});
