// sw.js v1778214509 - 캐시 완전 비활성화
const CACHE_VERSION = 'v1778214509';

self.addEventListener('install', e=>{
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const url = e.request.url;
  if(url.includes('firebase')||url.includes('gstatic')||url.includes('googleapis')){
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    fetch(e.request, {cache:'no-store'}).catch(()=>new Response('오프라인', {status:503}))
  );
});
