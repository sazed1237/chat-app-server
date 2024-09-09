const UserModel = require("../models/userModel")
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {

        const { name, email, password, profile_pic } = req.body

        const userExist = await UserModel.findOne({ email })
        if (userExist) {
            return res.status(400).json({
                message: "Already have account",
                error: true,
                success: false
            })
        }

        // convert password to hash using bcrypt 
        var salt = await bcrypt.genSalt(10);
        var hashPassword = await bcrypt.hash(password, salt);


        const payload = {
            name,
            email,
            password: hashPassword,
            profile_pic,
        }

        const user = UserModel(payload)
        const userSave = await user.save()

        res.status(200).json({
            message: "User created successful",
            error: false,
            success: true,
            data: userSave
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


module.exports = registerUser