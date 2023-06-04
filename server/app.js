require('dotenv').config();

const express = require('express');
const cors = require('cors');
const loginRouter = require('./views/login');
const signupRouter = require('./views/signup');
const getUserRouter = require('./views/getUser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


const app = express();

//set up middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); //to enable cross origin resourse sharing ie make post,get,etc request form different url
app.use(bodyParser.urlencoded({ extended: true })); //to read the post request from html form
app.use(express.json()); //to interpret json
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/user', getUserRouter);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = app;
