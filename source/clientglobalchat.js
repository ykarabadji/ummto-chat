// clientglobalchat.js
// -------------------
// Handles the client-side logic for the global chat feature.
// Manages WebSocket connection, message sending/receiving, file uploads, and UI updates.

const chat_name = "global chat";
let filesObje = [];
let fileBool = false;
const ws = new WebSocket('ws://localhost:8080');


// WebSocket connection established
ws.onopen = () => {
    console.log('connected to the server successfully');
    ws.send(JSON.stringify({type:'load-old',clientChannel:chat_name}));
};

// Handle incoming messages from server
ws.onmessage = (server_data) => {
    const server_response = JSON.parse(server_data.data);
    if (server_response.type === 'old-messages') {
        server_response.data.forEach((db_data) => {
            addMessage({ message: db_data.msg, senderName: db_data.sender }, 'other');
        });
    } else {
        addMessage(server_response, 'other');
    }
};

window.onload = () => {
  const button = document.getElementById('send_button');
  const input = document.getElementById('message_sended');
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const full_name = localStorage.getItem("fullName");
  const chat_name_title = document.getElementById('chat_name_title');
  const channel = localStorage.getItem("channel");
  chat_name_title.innerText = "global chat";
  button.addEventListener('click',async () => {
    let our_message = "";
    let type
    if(fileBool === false){
        type = "msg";
        our_message = input.value.trim();
        if (!our_message) return; // Prevent sending empty messages
    }else{
      const file = filesObje[0]; // assuming one file
      console.log("Selected file:", file);
      type = "file"
      let file_url_after_fetch = await uploadFile(file);
      our_message = file_url_after_fetch
    }
    
    
    
    const client_data = {
      msg_type : type,
      message :our_message,
      fullName : full_name,
      clientChannel : 'global chat',
      chatName : chat_name

    }
    console.log(our_message);
    ws.send(JSON.stringify(client_data));
    addMessage(client_data,'me');
    filesObje = []
    fileBool = false
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

const global_chat_button = document.getElementById('group_class_chat')
global_chat_button.addEventListener('click',()=>{
   window.location.href = "/home/anux/Desktop/chatpp/source/specializedchat/specialitieschat.html";
})


const pdf_input = document.getElementById("pdf_input")
pdf_input.addEventListener('change',(event)=>{
   const selectedFile = event.target.files
   console.log("this is the ",selectedFile);
   if(selectedFile.length>0){
    fileBool = true
    for(let file of selectedFile){
      console.log("the file name path is ",file);
         filesObje.push(file);
    }
   }else{
    fileBool = false
   }
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
  if(text.msg_type === 'file' || (typeof text.message === 'string' && (text.message.startsWith('https://') || text.message.startsWith('http://'))) ){
    const urlalink = document.createElement('a');
    urlalink.href = text.message;
    urlalink.textContent = "📄 View PDF";
    urlalink.target = "_blank";
    urlalink.style.color = "#007bff"; // Optional: make it look like a link
    textElement.appendChild(urlalink);
  }else{
   textElement.textContent = text.message || text  ;
  }
  

  msgContainer.appendChild(nameElement);
  msgContainer.appendChild(textElement);

  box.appendChild(msgContainer);
  box.scrollTop = box.scrollHeight;
}




async function uploadFile(file) {
  console.log("this is the file im sending ",file);
  const formData = new FormData();
  formData.append('pdf', file); // 'pdf' must match your multer field name

  try {
    const response = await fetch(`http://localhost:3000/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json(); // { url: "http://localhost:3000/files/xyz.pdf" }
    return data.url;

  } catch (err) {
    console.error('Error uploading file:', err);
  }
}
