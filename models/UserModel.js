import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please Provide your name!'],
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide valide Email']
    },
    password: {
        type: String,
        require: [true, 'please provide your password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        maxlength: 15,
        default: 'Last Name',
        trim: true
    },
    location: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'my city'
    },

})


// hash the passwoed

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
})

userSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch
}

const User = mongoose.model('User', userSchema);

export default User;