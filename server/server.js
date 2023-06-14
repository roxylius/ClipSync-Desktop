require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const server = express(); //var server uses all the express function
const port = process.env.PORT || 3000; //port
const DB = process.env.MONGODB_ATLAS;  //database link
const handleSocket = require('./views/socket'); //handles socket connections

//connect to mongo database
mongoose.connect(DB)
    .then(() => console.log("Successfully connected to database!!"))
    .catch((err) => { console.log(err) });


//we require app.js as it handles all the routes
const app = require('./app');

//app is a middleware fn which is included here i.e. it is used in server but the code is defined else where but we use it here
server.use(app);


//the server is started on the given port
const socketserver = server.listen(port, () => console.log("The server is listening on port: ", port, '....'));

//handle socket connection
handleSocket(socketserver);