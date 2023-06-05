const express = require('express');
const passport = require('passport');

const getUserRouter = express.Router();

//import user to search the collection User in MongoDB
const User = require('../schema/user');

// //handled by passport-local-mongoose module
passport.use(User.createStrategy({ usernameField: 'email' })); //verify credentials from DB

//it handle the post request of user page
getUserRouter.get("/", (req, res) => {
    //check if user is Authenticated 
    if (req.isAuthenticated())
        res.status(200).json(req.user);
    else
        res.status(401).json({ message: 'Authentication Error!' });
});

//export the getUserRouter module to app.js which handle all route requests
module.exports = getUserRouter;


