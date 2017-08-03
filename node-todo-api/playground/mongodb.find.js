const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err)
        return console.log(err);
    console.log('Connected to mongo');
    /*
    //all docs
    db.collection('Todos').find().toArray()
        .then(
            (documents)=>{
                console.log('Todos');
                console.log(JSON.stringify(documents, undefined, 2));
            }, 
            (error)=> console.log('Unable to fetch todos', error));

    //filter docs
    db.collection('Todos').find({completed: true}).toArray()
        .then(
            (documents)=>{
                console.log('Completed Todos');
                console.log(JSON.stringify(documents, undefined, 2));
            }, 
            (error)=> console.log('Unable to fetch completed todos', error));
            
    //find an id
    db.collection('Todos').find({
        _id: new ObjectID('598356d946320d155c95316e')
    }).toArray().then(
            (documents)=>{
                console.log('Todo by ID');
                console.log(JSON.stringify(documents, undefined, 2));
            }, 
            (error)=> console.log('Unable to fetch todo by ID', error));
            
    //count
    db.collection('Todos').find().count()
        .then(
            (count)=>{
                console.log(`\nTodos count: ${count}`);
            }, 
            (error)=> console.log('Unable to count todos', error));

            */
    //users
    db.collection('Users').find({'location': 'Barcelona'})
    .toArray()
        .then(
            (docs)=> { console.log(JSON.stringify(docs, undefined, 2)); },
            (err)=> console.log('Unable to filter by location', err));

    db.close();
});