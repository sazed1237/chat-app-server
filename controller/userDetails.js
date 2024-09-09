const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

const userDetails = async (req, res) => {
    try {

        const token = req?.cookies?.token || ''
        // console.log(token)

        const user = await getUserDetailsFromToken(token)

        return res.status(200).json({
            message: "user details",
            data: user,
            error: false,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports = userDetails