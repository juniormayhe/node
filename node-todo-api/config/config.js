var env = process.env.NODE_ENV || 'development';//available in heroku and locally (by you)
console.log('** env = ', env);

if (env === 'development'){
    console.log('dev!');
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env ==='test'){
    console.log('testing!');
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}