add = (a, b) => a + b;
asyncAdd = (a, b, callback) => {
    setTimeout(()=> {
        callback(a + b);
    },1000);//mocha assumes > 2000 as an error
    
}
square = (x) => x * x;

asyncSquare = (x, callback) => {
    setTimeout(()=>{

        callback(x*x);
    }, 1000);
}

setName = (user, fullname) => {
    let  names = fullname.split(' ');
    user.firstname = names[0];
    user.lastname = names[1];
    return user;
}
module.exports = {add, square, setName, asyncAdd, asyncSquare};
/*
module.exports.add = (a, b) => a + b;
module.exports.square = (x) => x * x;
*/
