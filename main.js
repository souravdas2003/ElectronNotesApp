const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

// Path to store notes in JSON file
const notesFilePath = path.join(__dirname, 'data', 'notes.json');

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'), // Enables use of IPC in renderer
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
});

ipcMain.handle('load-notes', async () => {
  if (!fs.existsSync(notesFilePath)) {
    fs.writeFileSync(notesFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(notesFilePath);
  return JSON.parse(data);
});

ipcMain.on('save-note', (event, noteContent) => {
  const notes = JSON.parse(fs.readFileSync(notesFilePath));
  notes.push(noteContent);
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
  event.returnValue = 'Note saved!';
});
