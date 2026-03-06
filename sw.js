self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'complete') {
        const taskId = event.notification.data.taskId;
        const recurrence = event.notification.data.recurrence;
        
        // self.registration.scope akan otomatis mengambil URL website Vercel Anda
        const appUrl = self.registration.scope; 
        const targetUrl = appUrl + '?complete_task=' + taskId + '&recurrence=' + recurrence;
        
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url.split('?')[0] === appUrl || client.url === appUrl) {
                        client.postMessage({ type: 'COMPLETE_TASK', taskId: taskId, recurrence: recurrence });
                        return client.focus();
                    }
                }
                return clients.openWindow(targetUrl);
            })
        );
    } else {
        event.waitUntil(clients.openWindow(self.registration.scope));
    }
});
