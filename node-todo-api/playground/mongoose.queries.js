const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//const id = '59886e287f5203585c7663791';
const id = '5984b95382c4083c88ef9e79';

if (!ObjectID.isValid(id)){
    return console.log('Object ID is not valid', id);
}
/*
Todo.find({_id: id})
    .then((todos)=>{
        console.log('Todos', todos);
    });

Todo.findOne({_id: id})
    .then((todo)=>{
        console.log('Todo', todo);
    });

Todo.findById(id)
    .then((todo)=>{
        if (!todo)
            return console.log('ID not found');

        console.log('Todo by ID', todo);
    }).catch((err)=> console.log(err));
*/
User.findById(id).then((user)=>{
    if (!user)
        return console.log('Unable to find user');
    console.log(user);
},
(err)=> {console.log(err)});