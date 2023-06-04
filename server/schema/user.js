const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Get the Schema object from Mongoose
const Schema = mongoose.Schema;

// Create a schema to define the structure of the user data
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    // password: { // Password field not required as it is being handled by passport-local-mongoose
    //     type: String,
    //     required: true
    // },
    data: Schema.Types.Mixed
});

// Add passport-local-mongoose plugin to handle username and password fields
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Create a model using the user schema
const User = new mongoose.model('User', userSchema);

module.exports = User;
