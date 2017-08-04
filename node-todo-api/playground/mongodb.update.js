const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err)
        return console.log(err);
    console.log('Connected to mongo');

    //find and delete
    /*
        db.collection('Todos').findOneAndUpdate(
        {completed: false},
        { $set: { completed: true }}, 
        { returnOriginal: false})
        .then((result)=>{
        console.log('Document updated');
        console.log(result);
    });
    */

    db.collection('Users').findOneAndUpdate(
        { _id: new ObjectID('598358bf37bf6631508f95e9') },
        {
            $set: {name: 'JuniorM'},
            $inc: {age: 1}
        },
        {
            returnOriginal: false
        }
    ).then(
        (result)=> console.log(result) ,
        (error)=> console.log(error)
    );
    
    
    db.close();
});