const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/userModel")

const updateUserDetails = async (req, res) => {
    try {
        // console.log(req?.body) 

        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token)

        const { name, profile_pic, email } = req.body


        const updatedUser = await UserModel.updateOne({ _id: user._id }, {
            name,
            email,
            profile_pic
        })

        console.log(updatedUser)

        return res.status(200).json({
            message: "user updated successfully",
            success: true,
            error: false,
            data: updatedUser
        })


    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


module.exports = updateUserDetails