const express = require('express');
const passport = require('passport');

//handles signup routes
const SignupRouter = express.Router();

// Import the Mongoose model for user
const User = require('../schema/user.js');

// //handled by passport-local-mongoose
passport.use(User.createStrategy({ usernameField: 'email' })); //verify credentials from DB

// Handle POST request for the signup page
SignupRouter.post("/", async (req, res) => {
    //retrieve input passed by client application
    const { email, password, name } = req.body;

    //find the user in DB
    const foundUser = await User.findOne({ email: email });

    //if user with same is found sends err else register the user
    if (foundUser)
        res.status(401).json({ message: 'The email already exists!' });
    else {
        //create a new user
        const newUser = new User({ email: email, name: name, provider: 'local' });

        //registers the user using passport-local-mongoose fn
        User.register(newUser, password, (err, user) => {
            //if any error in registering otherwise authenticate the user
            if (err) { res.status(401).json(err); console.log(err) }
            else {
                //authenticates the user based on local strategy and sends the session with the response
                passport.authenticate('local')(req, res, () => {
                    res.status(200).json({ message: 'User Authenticated!' });
                });
            }
        });
    }
});



module.exports = SignupRouter;

