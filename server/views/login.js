const express = require('express');
const passport = require('passport');

//handles login routes
const loginRouter = express.Router();

// //import user to search the collection User in MongoDB
const User = require('../schema/user');

// //handled by passport-local-mongoose module
passport.use(User.createStrategy({ usernameField: 'email' })); //verify credentials from DB

//it handle the post request of login page
loginRouter.post('/', async (req, res, next) => {
    //retrieve input passed by client application
    const { email, password } = req.body;

    //create a new user object
    const user = new User({ email: email, password: password });

    //establishes a login session
    req.logIn(user, (err) => {
        if (err) {
            res.status(403).json(err);
        }
        else {
            //authenticates the user in DB if Successful redirect to /api/login/success else redirects to /api/login/fail
            passport.authenticate('local', { failureRedirect: '/api/login/fail', successRedirect: '/api/login/success' })(req, res);
        }
    });

});

//Authentication fails
loginRouter.get('/fail', (req, res) => {
    res.status(401).json({ message: 'Authentication Failed!' });
});

// Authentication successful 
loginRouter.get('/success', (req, res) => {
    //send the login session to the client application along with response
    res.status(200).json({ message: 'Authentication Successful!' });
})

//export the loginRouter module to app.js which handle all route requests
module.exports = loginRouter;


