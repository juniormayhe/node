const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//run some code before each test case
beforeEach(populateUsers);
beforeEach(populateTodos);


//use mocha describe() and it()
describe('POST /todos', ()=>{
    
    it('should create a new todo', (done)=> {
        
        const _text = 'Test todo text';
        
        //use supertest request(app).verb().expect()...end()
        request(app).post('/todos').send({ text: _text })
            .expect(200)
            .expect((res)=>{
                //use expect(obj).toBe() assertion
                expect(res.body.text).toBe(_text);})
            .end((err, res)=>{
                //handle erros that might happened with early expects in supertest
                if (err)
                    return done(err);

                //use mongoose to get all todos and assert first item
                Todo.find({text: _text}).then((todos)=> {
                    //use expect(obj).toBe() assertion
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(_text);
                    done();
                }).catch((e)=> done(e));
            });
        
    });//it

    it('should not create todo with invalid data',()=>{
        //use supertest and send an empty body
        request(app).post('/todos').send({})
            .expect(400)
            .expect((err, res)=> {
                if (err)
                    return done(err);

                //use mongoose to check if db has only seed data
                Todo.find().then((todos)=> {
                    //use expect(obj).toBe() assertion
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });

    });
});

describe('GET /todos', ()=> {
    
    it('should get all todos', (done)=>{
        request(app).get('/todos')
            .expect(200)
            .expect((res)=> {expect(res.body.todos.length).toBe(2);})
            .end(done);
    });
});


describe('GET /todos/:todoID', ()=> {
    
    it('should return todo doc', (done)=>{
        request(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done)=>{
        const todoID = new ObjectID().toHexString();
        request(app).get(`/todos/${todoID}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should return a 404 for non object ID', (done)=>{
        const invalidTodoID = '1234';
        request(app).get(`/todos/${invalidTodoID}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    
    it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
        if (err) {
            return done(err);
        }

        //query db find by id, it should not exist
        Todo.findById(hexId).then((todo) => {
            //expect todo to be null / not exist
            expect(todo).toNotExist();
            done();
        }).catch((e) => done(e));
        });
    });//it

    it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app).delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
    request(app)
        .delete('/todos/123abc')
        .expect(404)
        .end(done);
    });
});



describe('PATCH /todos/:id', () => {
    
    it('should return todo doc', (done) => {
    request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
    request(app)
        .get('/todos/123abc')
        .expect(404)
        .end(done);
    });
});

//test sign in with a valid auth token and an invalid auth token
describe('GET /users/me', ()=>{
    it('should return a user if authenticated', (done)=>{
        //supertest
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect(res=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return a 401 if not authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            //expect empty body response
            expect(res.body).toEqual({});
        })
        .end(done);
    })
});

//test sign up
describe('POST /users', ()=>{
    it('should create a user', (done)=>{
        const email = 'example@example.com';
        const password = '123#password';
        //supertest
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect(res=>{
            //when user is created there should be a token
            expect(res.headers['x-auth']).toExist();
            //user id should exist
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end(err=> {
            if (err){
                return done(err);
            }
            //if response is ok check user object sent from server
            User.findOne({email}).then(user=>{
                expect(user).toExist();
                //password should be hashed
                expect(user.password).toNotBe(password);
                done();
            }).catch(e=> done(e));
        });
    });

    it('should return validation errors if request invalid', (done)=>{
        const email = 'invalidemail';
        const password = '123';
        //supertest
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });

    it('should not create a user if email in use', (done)=>{
        const email = users[0].email;
        const password = '123#password!';
        //supertest
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
});

//test login
describe('POST /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        //supertest
        request(app)
        .post('/users/login')
        .send({ email: users[1].email, password: users[1].password})
        .expect(200)
        .expect(res=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toBe(users[1]._id.toHexString());
            expect(res.body.email).toBe(users[1].email);
            
        })
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            User.findById(users[1]._id).then(user=>{
                //check if there is access and token properties
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch(e=> done(e));
        });
    });

    it('should reject invalid login', (done)=>{
        //supertest
        request(app)
        .post('/users/login')
        .send({ email: users[1].email, password: 'invalidpass'})
        .expect(400)
        .expect(res=>{
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body).toEqual({});
        })
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            //why should I test a user with a invalid pass?
            User.findById(users[1]._id).then(user=>{
                console.log(user);
                //check if there is access and token properties
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(e=> done(e));
        });
    });
});