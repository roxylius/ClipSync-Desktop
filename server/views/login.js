const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loginRouter = express.Router();
loginRouter.use(cors()); //to enable accepting post request from different url
loginRouter.use(bodyParser.urlencoded({ extended: true })); //to receive the post request 
loginRouter.use(express.json()); //to understand json that is send as post request 


//it handle the post request of login page
loginRouter.post("/", (req, res) => {
    const { email, pass } = req.body;
    console.log("login:", email, pass);

})

//export the loginRouter module to app.js which handle all route requests
module.exports = loginRouter;