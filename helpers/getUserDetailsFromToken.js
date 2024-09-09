const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const getUserDetailsFromToken = async (token) => {
    try {

        if (!token) {
            return {
                message: "Session out",
                logout: true
            }
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log("decoded id", decode)
        const user = await UserModel.findById(decode?.id).select("-password")
        // console.log("decoded user", user)

        return user

    } catch (error) {
        console.log(error)
    }
}


module.exports = getUserDetailsFromToken