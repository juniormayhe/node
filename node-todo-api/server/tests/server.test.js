const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
//run some code before each test case
beforeEach((done)=> {
    //whipe all todos to ensure db is empty
    Todo.remove({})
        .then(()=> done());//async is done
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
                Todo.find().then((todos)=> {
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

                //use mongoose to check if db is empty
                Todo.find().then((todos)=> {
                    //use expect(obj).toBe() assertion
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e)=> done(e));
            });

    });
});
