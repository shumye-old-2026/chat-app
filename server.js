const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('አዲስ ተጠቃሚ ተገናኝቷል! ✅');

    ws.on('message', (message) => {
        console.log('የመጣ መልእክት: %s', message);
        
        // የመጣውን መልእክት ለሁሉም ተጠቃሚዎች ማሰራጨት
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

console.log("WebSocket ሰርቨር በፖርት 8080 ላይ እየሰራ ነው... 🚀");