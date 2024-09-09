const UserModel = require("../models/userModel")

const searchFriend = async (req, res) => {
    try {

        const { search } = req.body

        const query = new RegExp(search, "i", "g")

        const user = await UserModel.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password")

        return res.json({
            message: "search user",
            data: user,
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


module.exports = searchFriend