/* Ricky Ricón PWA Service Worker — actualizaciones versionadas y caché sin tocar localStorage */
const VERSION='ricky-ricon-v1';
const SHELL=`${VERSION}-shell`;
const RUNTIME=`${VERSION}-runtime`;
const CORE=['./','./index.html','./offline.html','./manifest.json','./assets/img/logo.png','./assets/img/local-polleria.jpg','./assets/img/icon-192.png','./assets/img/icon-512.png'];
const MENU_IMAGES=[
'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(SHELL);
 await cache.addAll(CORE);
 // Guardar las fotos del menú durante la primera instalación con red.
 const runtime=await caches.open(RUNTIME);
 await Promise.allSettled(MENU_IMAGES.map(async url=>{
  try{const response=await fetch(url,{mode:'no-cors'});if(response.type==='opaque'||response.ok)await runtime.put(url,response);}catch(_){}
 }));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('ricky-ricon-')&&key!==SHELL&&key!==RUNTIME).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin===self.location.origin){
  if(request.mode==='navigate'){
   event.respondWith((async()=>{
    try{const fresh=await fetch(request);const cache=await caches.open(SHELL);cache.put(request,fresh.clone());return fresh;}
    catch(_){return (await caches.match(request))||(await caches.match('./index.html'))||(await caches.match('./offline.html'));}
   })());return;
  }
  event.respondWith((async()=>{
   const cached=await caches.match(request);if(cached)return cached;
   try{const response=await fetch(request);if(response.ok){const cache=await caches.open(SHELL);cache.put(request,response.clone());}return response;}
   catch(_){return caches.match('./offline.html');}
  })());return;
 }
 // Recursos de terceros (imágenes, fuentes y hojas de estilo): cache-first después del primer uso.
 event.respondWith((async()=>{
  const cached=await caches.match(request);if(cached)return cached;
  try{const response=await fetch(request);if(response&&(response.ok||response.type==='opaque')){const cache=await caches.open(RUNTIME);cache.put(request,response.clone());}return response;}
  catch(_){return new Response('',{status:503,statusText:'Offline'});}
 })());
});
