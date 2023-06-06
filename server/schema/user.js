const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

// Get the Schema object from Mongoose
const Schema = mongoose.Schema;

// Create a schema to define the structure of the user data
const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    googleId: String,
    githubId: String,
    provider: String, //where did the user data come from 
    // password: { // Password field not required as it is being handled by passport-local-mongoose
    //     type: String,
    //     required: true
    // },
    data: Schema.Types.Mixed
});

// Add passport-local-mongoose plugins to handle username and password fields and find or create users
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(findOrCreate);

// Create a model using the user schema
const User = new mongoose.model('User', userSchema);

module.exports = User;
