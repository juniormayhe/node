const request = require('supertest');
const expect = require('expect');//for custom assertions

//grab app from server.js
var app = require('./server').app;

describe('Server', ()=> {

    describe('GET /', ()=> {
        //mocha
        it('should return hello world', (done) =>{
            request(app).get('/')
                .expect(200)
                .expect('Hello world')
                .end(done);
        });
    });
    

    describe('GET /json', ()=> {
        it('should return json', (done) =>{
            request(app).get('/json')
                .expect({ name: 'Junior', age: 41 })
                .expect((response) => {
                    //custom assertion with expect library
                    expect(response.body).toInclude({ age: 41 })
                })
                .end(done);
        });
    });

    describe('GET /users', ()=> {
        it('should return user', (done) =>{
            request(app).get('/users')
                .expect(200)
                .expect((response) => {
                    //custom assertion with expect library
                    expect(response.body).toInclude({ name: 'Julia', age: 2 })
                })
                .end(done);
        });
    });
});
