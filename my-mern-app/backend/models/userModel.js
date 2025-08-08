const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
  
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        console.error("Please enter valid password");
        return next();
    }
    try {
        const saltround = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(user.password, saltround);
        user.password = hashPassword;
        next();
    } catch (error) {
        console.error("Error during hasing of password");
        next(error);
    }

});
userSchema.methods.comparePassword = async function (userPassword) {
    try {
        return await bcryptjs.compare(userPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }

}

const User = mongoose.model("USER", userSchema);
module.exports = User;