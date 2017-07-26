console.log('Starting notes.js');
const fs = require('fs');

let logNote = (note) => {
  debugger;
  console.log(`\n---\n${note.title}\n${note.body}`);
}

let fetchNotes = ()=> {
  let notes = [];
  try {
    //read existing notes
    let notesString = fs.readFileSync('notes-data.json');
    notes = JSON.parse(notesString);
  }
  catch(e){
      //maybe file does not exist
  }
  return notes;
}

let saveNotes = (notes) =>{
  fs.writeFileSync('notes-data.json', JSON.stringify(notes));
}

let addNote = (title, body) => {

  let notes = fetchNotes();
  let note = {
    title,/*the same as title: title (parameter)*/
    body
  }

  //check if there are duplicates before adding note
  //filter returns true if title exists in notes array
  let duplicateNotes = notes.filter((note)=> note.title === title);
  //console.log(duplicateNotes);

  //add note to notes
  if (duplicateNotes.length==0){
    notes.push(note);
    saveNotes(notes);
    return note;
  }
  //automatically returns undefined
}

let getNote = (title) => {
  let notes = fetchNotes();
  let foundNote = notes.filter((note) => note.title === title);
  //return undefined if there's no item
  return foundNote[0];
}

let getAll = () => {
  let notes = fetchNotes();
  return notes;
}

let removeNote = (title) => {
  let notes = fetchNotes();
  let filteredNotes = notes.filter((note) => note.title !== title);
  saveNotes(filteredNotes);
  return notes.length !== filteredNotes.length;
}

module.exports = {
  addNote,
  getAll,
  saveNotes,
  removeNote,
  getNote,
  logNote
}
