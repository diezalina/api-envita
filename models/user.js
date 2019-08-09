const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    privileges: { type: String, default: 'basic' }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Usuario", userSchema);
