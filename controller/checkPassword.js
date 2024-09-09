const mongoose = require('mongoose');
const UserModel = require("../models/userModel")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const checkPassword = async (req, res) => {
    try {

        const { password, userId } = req.body;
        const _id = new mongoose.Types.ObjectId(userId);
        // console.log("user id in password", objectId)

        const user = await UserModel.findById(_id)
        // console.log("user in password", user)

        // check password in hash
        const verifyPassword = await bcrypt.compare(password, user.password)


        if (!verifyPassword) {
            return res.status(400).json({
                message: "Password doesn't match",
                error: true,
                success: false
            })
        }

        // set token 
        const tokenData = {
            id: user._id,
            email: user.email
        }
        // console.log(tokenData)

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
        // console.log('token in password', token)

        const cookieOptions = {
            http: true,
            secure: true,
            // sameSite: 'None'
        }

        return res.cookie('token', token, cookieOptions).status(200).json({
            message: "Login successfully",
            error: false,
            success: true,
            token: token,
            data: user
        })


    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports = checkPassword