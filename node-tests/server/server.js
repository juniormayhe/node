const express = require('express');


var app = express();

//set http get handler
app.get('/', (req, res)=>{
    res
        .status(200)//set custom return code
        .send('Hello world');
});

app.get('/json', (req, res)=>{
    res.send({ name: 'Junior', age: 41 });
});

app.get('/users', (req, res)=>{
    res.status(200)
        .send([
        { name: 'Julia', age: 2 },
        { name: 'Junior', age: 41 }
    ]);
});
app.listen(3000);

//expose so we can access in supertest in server.test.js
module.exports.app = app;