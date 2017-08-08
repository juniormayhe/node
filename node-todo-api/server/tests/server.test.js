const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//seed data 
const todos = [
    {_id: new ObjectID(), text: 'First test todo'},
    {_id: new ObjectID(), text: 'Second test todo'}
]

//run some code before each test case
beforeEach((done)=> {
    //whipe all todos to ensure db is empty
    Todo.remove({}).then(()=> {
        //push dummy data
        return Todo.insertMany(todos);
    }).then(()=> done());//async is done
});

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
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('DELETE /todos/:todoID', ()=>{
    it('should remove a todo', (done)=> {
        let hexID = todos[1]._id.toHexString();
        request(app).delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res)=>{
                if (err)
                    return done();
                
                //query db find by id, it should not exist
                Todo.findById(hexID).then((todo)=>{
                    //expect todo to be null / not exist
                    expect(todo).toNotExist();
                    done();
                }).catch((err)=> done());
        });
    });//it

    it('should return 404 if todo no found', (done)=> {
        let hexID = new ObjectID().toHexString();
        request(app).delete(`/todos/${hexID}`)
            .expect(404)
            .end(done());
    });

    it('should return 404 if objectID is invalid', (done)=> {
        let hexID = '1234';
        request(app).delete(`/todos/${hexID}`)
            .expect(404)
            .end(done());

    });

});