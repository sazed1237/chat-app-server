const { ConversationModel } = require("../models/conversationModel")

const getRecentConversations = async (userId) => {
    if (userId) {
        const currentUserConversation = await ConversationModel.find({
            "$or": [
                { sender: userId },
                { receiver: userId }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate("sender").populate('receiver')

        // console.log("current user conversation", currentUserConversation) 

        const conversation = currentUserConversation.map(con => {
            const countUnseenMsg = con.messages.reduce((previous, curr) => {
                const msgByUserId = curr?.msgByUserId?.toString()

                if (msgByUserId !== userId) {
                    return previous + (curr.seen ? 0 : 1)
                } else {
                    return previous
                }
            }, 0)

            return {
                _id: con?._id,
                sender: con?.sender,
                receiver: con?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: con.messages[con?.messages?.length - 1]
            }
        })

        return conversation

    } else {
        return []
    }
}

module.exports = getRecentConversations