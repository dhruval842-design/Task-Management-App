const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

  
const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password } = req.body;
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(409).json({
                message: "User already exist please log in"
            });
        }
        else {
            const userCreate = new User({ firstname, lastname, email, username, password });
            await userCreate.save();
            return res.status(200).json({
                message: "User registered successfully",
                user: userCreate
            });
        }
    } catch (error) {
        console.error("Internal server error please try again");
        return res.status(500).json({
            message: "Internal server error during signup"
        });
    }
}
const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "User not exist please sign up first"
            });
        }
        else {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid Credentials"
                });
            };
        }
        const payload = {
            id: user._id,
            email: user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token: token,
                   userId:payload.id });

    } catch (error) {
        console.error("Internal server error please try again");
        return res.status(500).json({
            message: "Internal server error during login"
        });
    }

}

module.exports = { signup, login };