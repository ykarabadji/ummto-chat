// server.js
// ---------
// WebSocket server for real-time chat communication.
// Handles message broadcasting, channel management, and message persistence using Supabase.

import { WebSocketServer } from "ws";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for message storage
const supabase = createClient('https://nedideoenoyacsjsgamd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZGlkZW9lbm95YWNzanNnYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDgxOTIsImV4cCI6MjA2NzQ4NDE5Mn0.db_NOXMpTU4z9qAvFlxWpbzyBsvdv4fJFH3g9K5-kGw')

const wss = new WebSocketServer({ port: 8080 });
const channel_clients_map = new Map(); // Map each client to their channel

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    // Handle incoming messages from clients
    ws.on('message', async function message(data) {
        const client_data = JSON.parse(data);
        if(client_data.type === 'load-old'){
            // Fetch old messages for the requested channel
            const clientChannel = client_data.clientChannel
            const messages = await import_messages(clientChannel);
            if (clientChannel) {
                channel_clients_map.set(ws, clientChannel);
            }
            const server_loading_db = {
                type:'old-messages',
                data: messages
            }
            ws.send(JSON.stringify(server_loading_db))
            return 
        }

        // Extract message details
        const { chatName, clientChannel, message, fullName ,msg_type } = client_data;
        // Save the channel for this client
        if (clientChannel) {
            channel_clients_map.set(ws, clientChannel);
        }
        // Store the message in the database
        insert_messages(fullName,message,clientChannel);
        // Prepare message to broadcast
        const server_response_toclient = {
            msg_type : msg_type,
            message : message,
            senderName: fullName ,
        }
        // Broadcast to all clients in the same channel
        wss.clients.forEach(function each(client) {
            const clientChannelValue = channel_clients_map.get(client);
            if (client !== ws && client.readyState === client.OPEN) {
                if (chatName === "group class chat" && clientChannelValue === clientChannel) {
                    client.send(JSON.stringify(server_response_toclient));
                } else if (chatName === "global chat" && clientChannelValue === clientChannel) {
                    client.send(JSON.stringify(server_response_toclient));
                }
            }
        });
    });
});

// Store a message in Supabase
async function insert_messages(sender,message,channel){
    try{
       const { error } = await supabase.from('messages').insert(
        {sender:sender,msg : message,channel:channel}
    )
    if(error ){
        console.log('error adding user ',error);
    }
    }catch(err){
        console.error('user not added ',err);
    }
}

// Retrieve messages for a channel from Supabase
async function import_messages(channel) {
    const { data, error } = await supabase
        .from('messages')
        .select('sender, msg')
        .eq('channel', channel)
        .order('created_at', { ascending: true });
    if (error) {
        console.error('error loading messages', error);
        return [];
    }
    return data;
}

