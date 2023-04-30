const mongoose = require('mongoose');


// Get the Schema object from Mongoose
const Schema = mongoose.Schema;


//create a schema or like structure in which data should be stored
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true
    }, data: Schema.Types.Mixed
});

//saves the mongoose schema basically creates a collection to store data
const User = mongoose.model('User', userSchema);

module.exports = User;