const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const SignupRouter = express.Router(); //a var called signupRouter is assigned express middlewares router fn (which handle with all routes)
SignupRouter.use(cors()); //to enable cross origin resourse sharing ie make post,get,etc request form different url
SignupRouter.use(bodyParser.urlencoded({ extended: true })); //to read the post request from html form
SignupRouter.use(express.json()); //to interpret json


// handle post request of signup page
SignupRouter.post("/", (req, res) => {
    const { email, pass, name } = req.body;
    console.log("signup: ", name, email, pass);

    //mongoose model
    const User = require('../schema/user.js');

    const user = new User({
        name: name,
        email: email,
        password: pass
    });

    user.save()
        .then(console.log("successfully saved to mongodb database: ", user))
        .catch((err) => { console.log(err) });

})


module.exports = SignupRouter;