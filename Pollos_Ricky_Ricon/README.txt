POLLOS RICKY RICÓN — CATÁLOGO PWA

Estructura:
- index.html: aplicación y catálogo original conservados en un solo HTML.
- manifest.json y sw.js: archivos externos obligatorios por las reglas de seguridad PWA del navegador.
- offline.html: respaldo si no hay conexión y no se puede recuperar la página.
- assets/img/: fotografía real del local, logotipo e iconos.

EJECUCIÓN LOCAL
1. Descomprime la carpeta.
2. Abre una terminal dentro de Pollos_Ricky_Ricon.
3. Ejecuta: python -m http.server 8000
4. Abre http://localhost:8000 en Chrome o Edge.
No abras index.html mediante file://: los Service Workers requieren localhost o HTTPS.

PUBLICACIÓN
- GitHub Pages: sube el contenido de esta carpeta a un repositorio y activa Settings > Pages. La aplicación se servirá por HTTPS.
- Otro hosting: publica todos los archivos manteniendo las rutas relativas y habilita HTTPS.
- Para probar offline: abre una vez con Internet, espera a que termine la carga, luego activa modo avión y recarga. Las fotos del local y el catálogo están precargados; las imágenes externas del menú se almacenan durante la instalación cuando la red las permite.
- Los cambios de versión del Service Worker usan cachés versionadas y no borran el carrito ni el tema guardados en localStorage.

NOTAS
- WhatsApp y Google Maps necesitan conexión; se muestra un aviso si se pulsan sin Internet.
- La disponibilidad de instalación depende del navegador y sus criterios PWA.
- La primera instalación necesita conexión. En iPhone/iPad, usa Compartir > Añadir a pantalla de inicio.
- Los recursos de Google Fonts y Font Awesome dependen de terceros; para una copia 100% autocontenida de esas fuentes sería necesario alojarlas localmente.
