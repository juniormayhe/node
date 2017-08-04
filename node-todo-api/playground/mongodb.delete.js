const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err)
        return console.log(err);
    console.log('Connected to mongo');
    
    //delete many
    /*db.collection('Todos').deleteMany({text: 'Eat lunch'})
        .then(
            (results)=>{
                console.log('Deleted Todos');
                console.log(results);
            }, 
            (error)=> console.log('Unable to delete todos', error));
    */
    //delete one
    /*db.collection('Todos').deleteOne({text: 'Eat lunch'})
        .then(
            (results)=>{
                console.log('Deleted Todo');
                console.log(results);
            }, 
            (error)=> console.log('Unable to delete todo', error));
    */
    //find and delete
    /*db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((result)=>{
        //console.log('Document deleted');
        console.log(result);
    });*/

    //delete many
    /*db.collection('Users').deleteMany({location: 'La Coruña'}).then((results)=>{
        console.log(results);
    }, (error)=> console.log('Unable to delete'));*/


    //find one and delete
    db.collection('Users').findOneAndDelete({location: 'Sevilla'}).then((result)=>{
        console.log(`Deleted ${result.value.location}`);
    }, (error)=> console.log('Unable to delete'));
    
    db.close();
});