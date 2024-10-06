const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // To hash passwords

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
});

// Hash password before saving a user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare hashed passwords during login
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', UserSchema);
module.exports = User
