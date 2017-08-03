//const MongoClient = require('mongodb').MongoClient;
//ES6 destructuring -> create a new variable by pulling off field MongoClient from require object
const {MongoClient} = require('mongodb');
//const {MongoClient, ObjectID} = require('mongodb');
//var obj = new ObjectID();//create a new object id with timestamp
//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        return console.log('Unable to connect to database');
    }

    console.log('Connected to mongodb');
   
    /*db.collection('Todos').insertOne({
        name: 'Julia',
        completed: false
    }, (err, result) => {

        if (err){
            return console.log('Unable to insert todo');
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });*/

    db.collection('Users').insertOne({
        name: 'Junior',
        age: 41,
        location: 'Rio'
    }, (err, res) => {
        if (err){
            return console.log('Unable to insert user');
        }
        console.log(JSON.stringify(res.ops, undefined, 2));

        
        const user = res.ops[0];
        //ES6 destructuring -> pull off a field from document
        const {age} = user;
        console.log(age);

    });

    db.close();

});