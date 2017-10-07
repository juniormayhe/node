var env = process.env.NODE_ENV || 'development';//available in heroku and locally (by you)
console.log('** env = ', env);

if (env === 'development' || env ==='test') {
    //parse json to an object
    var config = require('./config.json');
    //access json property of desired enviroment (key)
    var envConfig = config[env];
    //return envConfig as an array of keys
    Object.keys(envConfig).forEach((key)=>{
        //port or mongodb url
        process.env[key] = envConfig[key];
    });
    
}

// if (env === 'development'){
//     console.log('dev!');
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env ==='test'){
//     console.log('testing!');
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }