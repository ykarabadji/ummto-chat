

// ESM syntax
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
// ✅ Define __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);










function createWindow () {

    fork(path.join(__dirname, 'server.js'));
   
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
     nodeIntegration: true,     // so you can use Node features
     contextIsolation: false,   // disable to simplify dev
  // preload: path.join(__dirname, 'preload.js') // ✅ remove or fix
}

  
  })

  win.loadFile('./source/userauth/login.html')
     win.webContents.openDevTools(); // ✅ Opens DevTools automatically
}
 
app.whenReady().then(() => {
  createWindow()
 

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
   
    }
  })
})




app.on('window-all-closed', () => {
   if (serverProcess) {
    serverProcess.kill(); // 🔥 Kill server on all window close
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


