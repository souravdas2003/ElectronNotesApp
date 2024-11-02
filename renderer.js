const { ipcRenderer } = require('electron');

// Load notes on startup
document.addEventListener('DOMContentLoaded', async () => {
  const notes = await ipcRenderer.invoke('load-notes');
  renderNotesList(notes);
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const noteContent = document.getElementById('noteText').value;
  ipcRenderer.send('save-note', noteContent);
  document.getElementById('noteText').value = ''; // Clear text area
  renderNotesList([noteContent]); // Add new note to the list
});

function renderNotesList(notes) {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = ''; // Clear existing list
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.textContent = `Note ${index + 1}`;
    li.addEventListener('click', () => displayNoteContent(note));
    notesList.appendChild(li);
  });
}

function displayNoteContent(note) {
  document.getElementById('noteText').value = note;
}
