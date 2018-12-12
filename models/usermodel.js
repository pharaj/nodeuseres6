const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
require('mongoose-type-email');


//creating Schema
const UserSchema = new Schema({
    first_name: { type: String, required: true },
    email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
    user_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true },
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

//exporting collections
const User = mongoose.model('User', UserSchema);
module.exports = User;
