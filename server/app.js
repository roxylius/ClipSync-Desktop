const express = require('express');
const cors = require('cors');
const loginRouter = require('./views/login');
const SignupRouter = require('./views/signup');

const app = express();
app.use(cors());

app.use('/api/login', loginRouter);
app.use('/api/signup', SignupRouter);

module.exports = app;