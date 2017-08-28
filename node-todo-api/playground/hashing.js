//THIS IS TESTING AND NOT PART OF THE PROJECT
//you need to install crypto-js that includes all sorts of 
//encryption and hashing algorithms
const {SHA256} = require('crypto-js');

//one way encrypting algorithm
var hash = SHA256(message).toString();
//message to hash
var message = 'I am user number 2';

console.log(`message ${message}`);
console.log(`hash ${hash}`);

var data = {
    id: 4
}

var token = {
    data,/*es6 */
    hash: SHA256(JSON.stringify(data)+'someSecret').toString()
}

// man in the middle does not know salt/secret
token.data.id = 9;
token.hash = SHA256(JSON.stringify(data)).toString();

var resultHash = SHA256(JSON.stringify(token.data)+'someSecret').toString();

if (resultHash === token.hash)
    console.log('Data was not changed');
else
    console.log(`Data was changed. Don't trust`)