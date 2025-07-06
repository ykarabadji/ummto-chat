import { WebSocketServer } from "ws";

let recent_messages = [];
const wss = new WebSocketServer({ port: 8080 });
const channel_clients_map = new Map();

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    // Send all past messages
    recent_messages.forEach(message => {
        ws.send(message);
    });

    ws.on('message', function message(data) {
        const client_data = JSON.parse(data);
        const { chatName, clientChannel, message, fullName } = client_data;
        console.log('message received :  ',message);
        // Save the channel
        channel_clients_map.set(ws, clientChannel);

        // Store the message
        recent_messages.push(message);
        const server_response_toclient = {
            message : message,
            senderName: fullName 
        }
        console.log(server_response_toclient.message,server_response_toclient.senderName);
        wss.clients.forEach(function each(client) {
            const clientChannelValue = channel_clients_map.get(client);

            if (client !== ws && client.readyState === client.OPEN) {
                if (chatName === "group class chat" && clientChannelValue === clientChannel) {
                    client.send(JSON.stringify(server_response_toclient));
                } else if (chatName === "global chat") {
                    client.send(JSON.stringify(server_response_toclient));
                }
            }
        });
    });
});
