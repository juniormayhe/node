const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');
//app.__set__ mocks data using rewire


describe('App', ()=>{

    it('should call the spy correctly', () => {
        var spy = expect.createSpy();
        spy('Junior', 41);
        expect(spy).toHaveBeenCalledWith('Junior', 41);
    });

    var fakeDb = {
        saveUser: expect.createSpy()
    };
    app.__set__('db', fakeDb);

    it('should call saveUser with user object', () => {
        var email = 'juniormayhe@gmail.com';
        var password = 'abcd';
        
        //call handle but db will be a spy / mocked object
        app.handleSignup(email, password);
        expect(fakeDb.saveUser).toHaveBeenCalledWith({email, password});
    });
});