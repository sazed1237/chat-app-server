const logout = async (req, res) => {
    try {
        const cookieOptions = {
            http: true,
            secure: true,
            // sameSite: 'None'
        }

        return res.cookie('token', '', cookieOptions).status(200).json({
            message: "Logout successful",
            error: false,
            success: true,
        })


    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


module.exports = logout