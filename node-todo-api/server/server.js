const express = require('express');
const bodyParser = require('body-parser');//convert string to json obj and attach to http request 

const {ObjectID} = require('mongodb');
const {mongoose}= require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();

app.use(bodyParser.json());

//setup routes
//insert with post
app.post('/todos', (req, res)=>{

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        //doc saved then send it back saved doc to client
        res.send(doc);
    },
    (err) => res.status(400).send(err));
    //console.log(req.body);
});

// get all todos
app.get('/todos', (req, res)=>{
    Todo.find().then(
        (todos)=>{
            res.send({todos});
        }, 
        (err)=> res.status(400).send(err));//or you can replace this with catch
});

//GET /todos/1234
app.get('/todos/:todoID', (req, res)=>{
    //console.log(req.params['todoID']);
    
    let todoID = req.params.todoID;
    if (!ObjectID.isValid(todoID))
        return res.status(400).send({});//send empty for security reasons

    Todo.findById(todoID).then((todo)=>{
        if (!todo)
            res.status(404).send('Todo not found');
        res.send({todo, status: res.statusCode});//when sending object you can attach more properties
    })
    .catch((e)=> res.status(400).send());//send empty for security reasons
});

app.listen(3000, ()=>{
    console.log('Server up and running on port 3000');
});

module.exports = {
    app
}