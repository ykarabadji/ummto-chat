import { WebSocketServer } from "ws";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://nedideoenoyacsjsgamd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZGlkZW9lbm95YWNzanNnYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDgxOTIsImV4cCI6MjA2NzQ4NDE5Mn0.db_NOXMpTU4z9qAvFlxWpbzyBsvdv4fJFH3g9K5-kGw')
/*let recent_messages = [];*/
const wss = new WebSocketServer({ port: 8080 });
const channel_clients_map = new Map();

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    // Send all past messages

    
    /*recent_messages.forEach(message => {
        ws.send(message);
    });*/

    ws.on('message', async function message(data) {

        const client_data = JSON.parse(data);
        if(client_data.type === 'load-old'){
            // fething old messages 
           const clientChannel = client_data.clientChannel
           const messages = await import_messages(clientChannel);
           // now the data is inside an object variable //
            
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
        const { chatName, clientChannel, message, fullName } = client_data;
        console.log('message received :  ',message);
        // Save the channel
       
           if (clientChannel) {
               channel_clients_map.set(ws, clientChannel);
          }

         

        
        // Store the message
        
              insert_messages(fullName,message,clientChannel);
        
       
        /*recent_messages.push(message);*/
        const server_response_toclient = {
            message : message,
            senderName: fullName ,
            
        }
        console.log(server_response_toclient.message,server_response_toclient.senderName);
        wss.clients.forEach(function each(client) {
            const clientChannelValue = channel_clients_map.get(client);
             console.log('loop has been entereed ')
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



async function insert_messages(sender,message,channel){
    // adding a message 
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


async function import_messages(channel) {
    const { data, error } = await supabase
        .from('messages')
        .select('sender, msg')
        //channel filtering 
        .eq('channel', channel)
        .order('created_at', { ascending: true }); // optional: sort oldest → newest

    if (error) {
        console.error('error loading messages', error);
        return [];
    }

    return data;
}

