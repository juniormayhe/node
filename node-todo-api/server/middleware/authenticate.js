//import user
const {User} = require('./../models/user');

//middleware function to make some routes private
var authenticate = (req, res, next) =>{
    //get the token
    let token = req.header('x-auth');
    
        User.findByToken(token).then(user=> {
            if (!user){
                return Promise.reject('reason: user not found in db');
            }
            //modify the request and set the user we just found
            req.user = user;
            req.token = token;
            //call next so /users/me gets executed
            next();
        })
        .catch(reason=>{
            console.log(reason);
            res.status(401).send();
            //do not call next so execution gets interrupted
        })
  };

  module.exports = {authenticate};