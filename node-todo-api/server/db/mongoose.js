const mongoose = require('mongoose');
//use promises instead of callbacks
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');

//heroku config:set MONGODB_URI=mongodb://nodeman:rocketman@ds163397.mlab.com:63397/node-todo-api
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

module.exports = {
    mongoose /*or mongoose:moongoose for EcmaScript5 */
}