const mongoose = require('mongoose');

//creating model before connection
/*let Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});*/


//use promises instead of callbacks
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
}).then(
    (fulfilled)=>{
        //prepare model    
        let User = mongoose.model('User', {
            email: { 
                type: String,
                required: true,
                trim: true,
                minlength: 1
            }
        })

        //prepare obj
        const user = new User({
            email: 'junior@gmail.com'
        });

        //save
        user.save().then(
            (doc)=> console.log(doc),
            (err)=> console.log(err)
        );

        /*
        const todo = new Todo({
            text: 'Walk the dog',
            completed: true,
            completedAt: 12345
        });
        //save in mongodb
        todo2.save().then(
            (doc)=>{console.log(doc);}, 
            (err)=> console.log(err));
            */

        
    }, 
    (rejected)=> console.log(rejected));

console.log('Server up and running');