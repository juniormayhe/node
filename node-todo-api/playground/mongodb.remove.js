const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//delete multiple with mongoose
/*Todo.remove({}).then((result)=> {
    console.log(result);
});//without arguments removes all items
*/
//find one and delete with mongoose
/*Todo.findOneAndRemove({ _id: '5989fc973e72e44bb5bd1db4'}).then((result)=>{
    console.log(result);
});*/

//find by ID and remove
Todo.findByIdAndRemove('5989fc973e72e44bb5bd1db4').then((todo)=>{
    console.log(todo);
});