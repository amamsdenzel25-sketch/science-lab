const CACHE_NAME="science-lab-v12-colour-fixed-cache";
const ASSETS=["./","./index.html","./style.css","./script.js","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const url=new URL(e.request.url);if(e.request.method!=="GET")return;if(["./","./index.html","./style.css","./script.js"].some(p=>url.pathname.endsWith(p.slice(1))|| (p==="./"&&url.pathname.endsWith("/")))){e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request)));}else{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));}});
