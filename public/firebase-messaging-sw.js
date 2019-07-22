importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "550292707876"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background messagE ', payload);

    // Customize notification here
    var notificationTitle = payload.data.title;
    var notificationOptions = {
        body: payload.data.message,
        icon: (payload.data.icon) ? payload.data.icon : '/images/icon.png',
        data:{}
    };

    if(payload.data.url){
        notificationOptions.data.url = payload.data.url;
        notificationOptions.actions = [
            {action: 'open_url', title: 'Leer ahora'}
        ]
    }

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', function(event){
    switch (event.action) {
        case 'open_url':
            return openUrl(event);
    }
}, false);

/**
 * Cierra la notificación y, o bien abre una nueva ventana con la noticia o, si ya está abierta
 * la url, hace foco en ella.
 * @param event
 */
function openUrl(event){
    let url = event.notification.data.url;
    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(function(windowClients){
            for(var i = 0; i < windowClients.length; i++){
                var client = windowClients[i];
                if(client.url === url && 'focus' in client) return client.focus();
            }
            if(clients.openWindow){
                return clients.openWindow(url);
            }
        })
    );
}