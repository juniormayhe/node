const express = require('express');
const bodyParser = require('body-parser');//convert string to json obj and attach to http request 

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
        (err)=> res.status(400).send(err));
});    

app.listen(3000, ()=>{
    console.log('Server up and running on port 3000');
});

module.exports = {
    app
}