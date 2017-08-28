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

//prepare model    
const User = mongoose.model('User', UserSchema );

module.exports = {
    User
};