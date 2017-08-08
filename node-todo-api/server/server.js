const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');//convert string to json obj and attach to http request 

const {ObjectID} = require('mongodb');
const {mongoose}= require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();
const port = process.env.PORT || 3000;//set by heroku
//process.env.MONGODB_URI = 'mongodb://nodeman:rocketman!@ds163397.mlab.com:63397/node-todo-api';

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

app.delete('/todos/:todoID', (req, res) => {
    let todoID = req.params.todoID;
    if (!ObjectID.isValid(todoID))
        return res.status(404).send({});//send empty for security reasons

    Todo.findByIdAndRemove(todoID).then((todo)=> {
        if (!todo)
            return res.status(404).send({});

        //console.log('todo removed', JSON.stringify(todo, undefined, 2));
        res.send({todo, status: res.statusCode});

    }).catch((err)=> res.send(400).send({}));//send empty body

});

//update just specific properties
app.patch('/todos/:todoID', (req, res)=>{
    let todoID = req.params.todoID;
    if (!ObjectID.isValid(todoID))
        return res.status(404).send({});//send empty for security reasons

    //with lodash, pick from body only specific properties to update!
    let _body = _.pick(req.body, ['text', 'completed']);
    
    //check if completed is boolean
    if (_.isBoolean(_body.completed) && _body.completed){
        
        _body.completedAt = new Date().getTime();//returns number of millisenconds since 1970
    } else {
        _body.completed = false;
        _body.completedAt = null;
    }

    //in mongoose returnOriginal is called 'new'
    let returnOriginal = true;
    //do a query to update db
    Todo.findByIdAndUpdate(todoID, { $set: _body }, { new: returnOriginal })
        .then((todo)=>{
            console.log(_body);
            if (!todo)
                return res.status(404).send();

            res.send({todo: todo});//or ES6 {todo}
        })
        .catch((err)=> res.status(400).send({}));

});

app.listen(port, ()=>{
    console.log(`Server up and running on port ${port} in mode ${app.settings.env}`);
});

module.exports = {
    app
}