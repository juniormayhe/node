//Hashing with JSON Web Token

const jwt = require('jsonwebtoken')

var data = {
    id: 10
}

//sign the object with secret for sending back to user
var token = jwt.sign(data, '123abc');
console.log('token', token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);