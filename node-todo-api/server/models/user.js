const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash')

//stores a schema /properties for a user
var UserSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: { 
            validator: validator.isEmail, //or validator: (value)=> { return validator.isEmail(value);},
            message: '{VALUE} is not a valid email'
        }
    },//email

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    tokens: [{
        access: { type: String, required: true },
        token: { type: String, required: true }
    }]
})

//ovewrite methods to hide some JSON properties that 
//must not be returned to user
UserSchema.methods.toJSON = function(){
    //we use a regular function because we must access 'this' which refers to document/user instance
    //we do not use arrow function because it does not bind to this keyword
    var user = this;
    
    //convert mongoose obj to regular object
    var userObject = user.toObject();
    
    //return only _id and email, remove password and tokens!
    return _.pick(userObject, ['_id', 'email']);
}

//adds instance methods "userObj.method()"" to the userSchema
UserSchema.methods.generateAuthToken = function (){
    
    //we use a regular function because we must access 'this' which refers to document/user instance
    //we do not use arrow function because it does not bind to this keyword
    var user = this;//current instance of user
    var access = 'auth';
    const secret='abc123';

    var token = jwt.sign({
        _id: user._id.toHexString(), 
        access}, secret).toString();
    
    user.tokens.push({access, token});//es6

    return user.save().then(()=> token);
}

//static method for model, not instance method
UserSchema.statics.findByToken = function (token){
    let user = this;//regular function because we want to bind to 'this'
    let decoded;

    try {
        //decode a token
        decoded = jwt.verify(token, 'abc123');
    }
    catch(e) { 
        //invalid token, then stops and triggers catch in server.js
        //return new Promise((resolve, reject)=>{reject();}); or:
        return Promise.reject('reason: invalid token');
    }
    //we can bind a then() in the promise below
    return User.findOne({ 
        '_id': decoded._id, 
        'tokens.token': token,
        'tokens.access': 'auth'});
}

//prepare model    
const User = mongoose.model('User', UserSchema );

module.exports = {
    User
};