const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId, 
        email: 'juniormayhe@example.com', 
        password: 'password#1234',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId, 
        email: 'noaccess@user.com', 
        password: 'password#1234',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
        }]
    }
];

//seed data 
const todos = [{
	_id: new ObjectID(), 
	text: 'First test todo', 
  _creator: userOneId
}, {
    _id: new ObjectID(), 
	text: 'Second test todo', 
	completed: true, 
  completedAt: 333,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
    //whipe all todos to ensure db is empty
    User.remove({}).then(() => {
        //push seed data
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        
        //wait all save actions to complete
        return Promise.all([userOne,userTwo]);
        
  }).then(() => done());//async is done
};


module.exports = {todos, populateTodos, users, populateUsers};
