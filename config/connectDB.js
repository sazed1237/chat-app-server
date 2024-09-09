const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)


        // to check connection is working proper
        mongoose.connection.on('connected', () => {
            console.log('connect is successful')
        })


    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB