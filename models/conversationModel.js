const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    msgByUserId: {
        type: mongoose.Schema.ObjectId, 
        require: true,
        ref: "user"
    },
    text: {
        type: String,
        default: ''
    },

    imageUrl: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },

    seen: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
})



const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: "user"
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: "user"
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "message"
        }
    ],
}, {
    timestamps: true
})


const MessageModel = mongoose.model('message', messageSchema)
const ConversationModel = mongoose.model("conversation", conversationSchema)



module.exports = {
    MessageModel,
    ConversationModel

}

