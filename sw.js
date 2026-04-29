// 서비스워커 - 캐시 완전 비활성화 버전
// index.html은 절대 캐시하지 않음

self.addEventListener('install', e=>{
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  // 모든 이전 캐시 삭제
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const url = e.request.url;
  
  // Firebase 관련 - 네트워크 직접
  if(url.includes('firebase')||url.includes('gstatic')||url.includes('googleapis')){
    e.respondWith(fetch(e.request));
    return;
  }
  
  // 모든 요청 - 항상 네트워크 (캐시 사용 안 함)
  e.respondWith(
    fetch(e.request, {cache:'no-store'}).catch(()=>new Response('오프라인', {status:503}))
  );
});
