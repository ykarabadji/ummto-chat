🟦 ummto-chat

    A student-focused chat app built with ❤️ by Yani Karabadji, a CS student at UMMTO University.

Tired of distractions like Instagram (#reels, etc.), I created this app to help students chat, collaborate, and create class groups — all in a focused academic space.
🚀 Getting Started
1. Clone the project:

git clone https://github.com/your-username/ummto-chat.git
cd ummto-chat

2. Install dependencies:

npm install

    This will install all required dependencies:
    Electron, Firebase, and Supabase libraries.

🔧 Configuration

Before running the app, you need to configure the following:
🔥 Firebase

    Add your Firebase config object in:

        login.js

        register.js
        (I've added comments in the code to guide you where to paste it.)

🟨 Supabase

    Add your Supabase key in:

        server.js

🧠 Features
✅ Already Implemented:

    🔐 Private Class Chats: Students are automatically grouped into their class chats after registration.

    🌐 Global Chat: All UMMTO students can interact in one big shared space.

    💬 Persistent Messages: Messages are saved so that disconnected users can return and see previous conversations.
    
    📎 File & Image Sharing (currently in progress 80%)   you can send messages of type (image/png application/pdf)

🛠️ Roadmap – To Be Implemented:

If you'd like to contribute, here are some key features I plan to add. Please follow the existing structure to keep the project clean and organized:

    📎 File & Image Sharing    you can send messages of type (image/png application/pdf) and i ll include many other formats later / and also voice messages(last)

    📅 Event Page: A public board where university events (what/where/when) are posted.

    🗳️ Student Elections: Ability for students to vote on posts (Yes/No).

    👤 Anonymous Mode: Allow shy students to ask questions without revealing their identity.

    🤖 Message Filter Bot: Automatically detects and filters inappropriate words.

    🔐 Security Layer: Even though it's just student talk, I want the app to be secure. I currently lack expertise in this area — any help is welcome!

🧩 Known Challenges

    📦 Limited Supabase Storage:
    If you're working on file/image sharing, please compress all uploads before saving them to conserve space.

🙏 Final Note

I built this to help students stay focused and collaborate more efficiently.
If you want to contribute — thank you in advance!

Feel free to fork, clone, and suggest improvements ❤️# ummto-chat
