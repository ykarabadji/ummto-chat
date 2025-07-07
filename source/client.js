
//const {full_name} = require("./module");
const chat_name = "group class chat";

const ws = new WebSocket('ws://localhost:8080');


ws.onopen = ()=>{
    
    console.log('connected to the server successfully');
    const channel = localStorage.getItem("channel");
    ws.send(JSON.stringify({type:'load-old',clientChannel:channel}));
};


ws.onmessage = (server_data)=>{
    
    //console.log(server_data.data);
    const server_response = JSON.parse(server_data.data)
    console.log(server_response);
    if (server_response.type === 'old-messages') {
  server_response.data.forEach((db_data) => {
    addMessage({ message: db_data.msg, senderName: db_data.sender }, 'other');
  });
} else {
  if(server_response.current_chat === 'global chat'){
    return ;
  }else{addMessage(server_response, 'other');}
  
}

    
}

window.onload = () => {
  const button = document.getElementById('send_button');
  const input = document.getElementById('message_sended');
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const full_name = localStorage.getItem("fullName");
  const chat_name_title = document.getElementById('chat_name_title');
  const channel = localStorage.getItem("channel");
  chat_name_title.innerText = `${channel} discussion`;
  button.addEventListener('click', () => {
    const our_message = input.value;
    if (our_message.trim() === '') return;

    
    
    const client_data = {
      message :our_message,
      // we need the full name to deisplay it on top of each client message 
      fullName : full_name,
      //sending the channel so the server know which users receives the messages (users from one group class )
      clientChannel : channel,
      // the chat_name is used by the server to check wether the message is comming from a global chat or group class chat 
      chatName : chat_name

    }
    console.log(our_message);
    ws.send(JSON.stringify(client_data));
    addMessage(client_data.message,'me');
    input.value = '';
  });
};
var svg_bool = false;
const svg_menu = document.getElementById('menu_svg');
svg_menu.addEventListener('click',()=>{
  if(svg_bool === false){
   document.getElementById('available_chat').style.display = 'block';
   svg_bool = true;
  }else{
    document.getElementById('available_chat').style.display = 'none';
    svg_bool = false;
  }
  
})

const global_chat_button = document.getElementById('global_chat')
global_chat_button.addEventListener('click',()=>{
   window.location.href = "/home/anux/Desktop/chatpp/source/globalchat/globalchat.html";
})


function addMessage(text, sender) {
 const full_name = localStorage.getItem("fullName");
 

   


  const box = document.getElementById('chat-box');

  // Create message container
  const msgContainer = document.createElement('div');
  msgContainer.classList.add('message', sender);

  // Add name on top (only for your messages)
  const nameElement = document.createElement('div');
  nameElement.style.fontWeight = 'bold';
  nameElement.style.fontSize = '14px';
  nameElement.style.marginBottom = '4px';

  if (sender === 'me') {
    nameElement.textContent = full_name;
  } else {
    nameElement.textContent = text.senderName; // optional, update later
  }

  // Add message text
  const textElement = document.createElement('div');
  textElement.textContent = text.message || text  ;

  msgContainer.appendChild(nameElement);
  msgContainer.appendChild(textElement);

  box.appendChild(msgContainer);
  box.scrollTop = box.scrollHeight;
}