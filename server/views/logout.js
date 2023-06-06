const express = require('express');

//handles logout route
const logoutRouter = express.Router();


logoutRouter.delete('/', (req, res) => {
    //logs out user from the application
    req.logOut((err) => {
        if (err) {
            console.log(err);
            res.status(401).json({ message: 'Unable to Logout!' });
        }
        else {
            req.session.destroy(function (err) {
                if (err) console.log(err);
                res.status(200).json({ message: 'User Logged Out' });
            });

        }
    })
})

module.exports = logoutRouter;