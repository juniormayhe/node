const mongoose = require('mongoose');
//use promises instead of callbacks
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

module.exports = {
    mongoose /*or mongoose:moongoose for EcmaScript5 */
}