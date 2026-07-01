// Rappels doux — importé dans le service worker généré (workbox importScripts).
// Se déclenche via Periodic Background Sync quand le navigateur le décide.

self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'gentle-reminder') return
  event.waitUntil(
    self.registration.showNotification('Mood Garden 🌱', {
      body: 'Ton jardin pense à toi. Un petit moment pour toi ?',
      icon: 'pwa-192x192.png',
      badge: 'pwa-192x192.png',
      tag: 'gentle-reminder',
      silent: true,
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => 'focus' in c)
      if (existing) return existing.focus()
      return self.clients.openWindow('./')
    }),
  )
})
