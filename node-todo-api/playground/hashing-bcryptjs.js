//const {SHA256} = require('crypto-js');
const {jwt} = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password ='123abc!';


// bcrypt.genSalt(10, (err, salt)=>{
//     bcrypt.hash(password, salt, (err, hashedPass)=>{
//         console.log(hashedPass);
//     });
// });
var hashedPass='$2a$10$olxAu5zBw1.o8BwYt1NVeeqaBAUwrjmWVa8ESiLz/vwV7XQ7TjZFS';
bcrypt.compare(password, hashedPass, (err, result)=>{
    console.log(result);
})