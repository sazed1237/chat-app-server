const UserModel = require("../models/userModel");

const checkEmail = async (req, res) => {
    try {

        const { email } = req.body;

        const emailExist = await UserModel.findOne({ email, }, "-password")

        // console.log('check email', emailExist)

        if (!emailExist) {
            return res.status(400).json({
                message: "user not exits",
                error: true,
                success: false
            })
        }


        return res.status(200).json({
            message: "user exits",
            error: false,
            success: true,
            data: emailExist
        })


    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports = checkEmail