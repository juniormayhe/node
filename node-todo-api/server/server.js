require('./config/config');

//for production you can set
// heroku config:set MONGODB_URI=mongodb://user:password@ds163397.mlab.com:63397/node-todo-api

const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');//convert string to json obj and attach to http request 

const {ObjectID} = require('mongodb');
const {mongoose}= require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;//set by heroku
//process.env.MONGODB_URI = 'mongodb://nodeman:rocketman!@ds163397.mlab.com:63397/node-todo-api';

app.use(bodyParser.json());

//setup routes

//POST /todos (private)
app.post('/todos', authenticate, (req, res)=>{

    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc)=>{
        //doc saved then send it back saved doc to client
        res.send(doc);
    },
    (err) => res.status(400).send(err));
    
});

// get all todos (private)
app.get('/todos', authenticate, (req, res)=>{
    //show only todos for logged in user
    Todo.find({_creator: req.user._id}).then(
        (todos)=>{
            res.send({todos});
        }, 
        (err)=> res.status(400).send(err));//or you can replace this with catch
});

//GET /todos/1234 (private)
app.get('/todos/:todoID', authenticate, (req, res)=>{
    //console.log(req.params['todoID']);
    
    let todoID = req.params.todoID;
    if (!ObjectID.isValid(todoID)){
        return res.status(404).send({});//send empty for security reasons
	}

    Todo.findOne({
		_id: todoID,
		_creator: req.user._id
	}).then((todo)=>{
        if (!todo){
            return res.status(404).send();
		}
        res.send({todo});//when sending object you can attach more properties
    })
    .catch((e)=> res.status(400).send());//send empty for security reasons
});

// //DELETE /todos/:todoID
app.delete('/todos/:id', authenticate, (req, res) => {
    var todoID = req.params.id;
  
    if (!ObjectID.isValid(todoID)) {
      return res.status(404).send();
    }
  
    Todo.findOneAndRemove({
      _id: todoID,
      _creator: req.user._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();//send empty body
    });
  });



//PATCH /todos/:todoID
app.patch('/todos/:id', authenticate, (req, res) => {
    var todoID = req.params.id;
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
  
    Todo.findOneAndUpdate({_id: todoID, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })
  });


//POST /users to signup
app.post('/users', (req, res)=>{

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(()=>{
        console.log('will generate token');
        return user.generateAuthToken();
    })
    .then((token)=> {
        //doc saved then add token to header and 
        //send it back saved doc to client
        console.log(`token $token`);
        res.header('x-auth', token).send(user);
    })
    .catch((err)=> {
        console.trace();
        res.status(400).send(err);
    });
    //console.log(req.body);
});



//private route for signing in with middleware function authenticate
app.get('/users/me', authenticate, (req, res)=>{
    //send modified request with user
    res.send(req.user);
});

//POST /users/login {email, password}
app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then(user=>{
        return user.generateAuthToken().then((token)=>{
            //send user along with token to client
            res.header('x-auth', token).send(user);
        });
        
    }).catch(e=>{
        //if no user is found
        res.status(400).send();//empty response
    });
});

//private route for deleting token of current logged user
app.delete('/users/me/token', authenticate, (req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, ()=>{
        res.status(400).send();
    });
});

//listen to routes
app.listen(port, ()=>{
    console.log(`Server up and running on port ${port} in mode ${app.settings.env}`);
});

module.exports = {
    app
}



// const _ = require('lodash');
// const express = require('express');
// const bodyParser = require('body-parser');
// const {ObjectID} = require('mongodb');

// var {mongoose} = require('./db/mongoose');
// var {Todo} = require('./models/todo');
// var {User} = require('./models/user');
// var {authenticate} = require('./middleware/authenticate');

// var app = express();
// const port = process.env.PORT;

// app.use(bodyParser.json());

// app.post('/todos', authenticate, (req, res) => {
//   var todo = new Todo({
//     text: req.body.text,
//     _creator: req.user._id
//   });

//   todo.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/todos', authenticate, (req, res) => {
//   Todo.find({
//     _creator: req.user._id
//   }).then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOne({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// app.delete('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOneAndRemove({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// app.patch('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }

//   Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   })
// });

// // POST /users
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);

//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });

// app.get('/users/me', authenticate, (req, res) => {
//   res.send(req.user);
// });

// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);

//   User.findByCredentials(body.email, body.password).then((user) => {
//     return user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// app.delete('/users/me/token', authenticate, (req, res) => {
//   req.user.removeToken(req.token).then(() => {
//     res.status(200).send();
//   }, () => {
//     res.status(400).send();
//   });
// });

// app.listen(port, () => {
//   console.log(`Started up at port ${port}`);
// });

// module.exports = {app};
