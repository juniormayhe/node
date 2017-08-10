require('./../config/config');

//for production you can set
// heroku config:set MONGODB_URI=mongodb://user:password@ds163397.mlab.com:63397/node-todo-api

const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');//convert string to json obj and attach to http request 

const {ObjectID} = require('mongodb');
const {mongoose}= require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();
const port = process.env.PORT;//set by heroku
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
        return res.status(404).send({});//send empty for security reasons

    Todo.findById(todoID).then((todo)=>{
        if (!todo)
            res.status(404).send();
        res.send({todo});//when sending object you can attach more properties
    })
    .catch((e)=> res.status(400).send());//send empty for security reasons
});

app.delete('/todos/:todoID', (req, res) => {
    let todoID = req.params.todoID;
    if (!ObjectID.isValid(todoID))
        return res.status(404).send();//send empty for security reasons

    Todo.findByIdAndRemove(todoID).then((todo)=> {
        if (!todo)
            return res.status(404).send();

        //console.log('todo removed', JSON.stringify(todo, undefined, 2));
        res.send({todo});

    }).catch((err)=> res.send(400).send());//send empty body

});

//PATCH /todos/:todoID
app.patch('/todos/:todoID', (req, res) => {
  var todoID = req.params.todoID;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(todoID)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(todoID, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port, ()=>{
    console.log(`Server up and running on port ${port} in mode ${app.settings.env}`);
});

module.exports = {
    app
}