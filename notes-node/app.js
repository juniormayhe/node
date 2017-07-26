//load in a builtin module with require
const fs = require('fs');
const yargs=require('yargs');
const notes = require('./notes');

//console.log(process.argv);
let titleOptions={ 
        describe: 'Title of note', 
        demand: true, 
        alias: 't' };
let bodyOptions={ 
        describe: 'Body of note', 
        demand: true, 
        alias: 'b' };

let argv = yargs
  .command('add', 'Add a new note', 
    { 
      title: titleOptions,
      body: bodyOptions  
    })
    .command('list', 'List all nodes')
    .command('read', 'Read a note', 
    { 
      title: titleOptions
    })
    .command('remove', 'Remove a note', 
    { 
      title: titleOptions
    })
    .help()
    .argv;

let command =  argv._[0];

if (command === 'add'){
  let note = notes.addNote(argv.title, argv.body);
  if (note)
    console.log(`Node created:${notes.logNote(note)}`);
  else
    console.log('Note was not created');
}
else if (command === 'list') {
  let allNotes = notes.getAll();
  console.log(`Printing ${allNotes.length} notes`);
  allNotes.forEach((note)=> notes.logNote(note));
}
else if (command === 'read') {
  let note = notes.getNote(argv.title);
  if (note)
    console.log(`Node found:${notes.logNote(note)}`);
  else
    console.log('Note not found');
}
else if (command === 'remove') {
  if (notes.removeNote(argv.title))
    console.log('Note removed');
  else
    console.log('Note does not exist');
}
else{
  console.log('Command not found');
}
