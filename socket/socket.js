const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/userModel');
const mongoose = require('mongoose');
const { ConversationModel, MessageModel } = require('../models/conversationModel');
const getRecentConversations = require('../helpers/getRecentConversations');

const app = express();

// socket connections
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://chattappp.netlify.app", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Track online users
const onlineUser = new Set();

io.on('connection', async (socket) => {
    // console.log("Connected user", socket.id);

    const token = socket.handshake.auth.token;


    // Get current user details via token
    const currentUser = await getUserDetailsFromToken(token);


    if (!currentUser?._id) {
        console.error("Invalid user detected, disconnecting", socket.id);
        socket.disconnect();
        return;
    }

    // console.log('current user id', currentUser?._id)


    // Add user to room and online users set
    socket.join(currentUser?._id?.toString());
    onlineUser.add(currentUser?._id?.toString());


    // Emit online users
    io.emit('onlineUser', Array.from(onlineUser));

    // console.log('online users', onlineUser); 



    // Handle message page event
    socket.on('message-page', async (userId) => {
        // console.log("User ID", userId);

        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)  // Check if the user is online
        };

        // console.log("payload", payload);

        socket.emit('message-user', payload);


        // get previous massage 
        const getConversation = await ConversationModel.findOne({
            "$or": [
                { sender: currentUser?._id, receiver: userDetails?._id },
                { sender: userDetails._id, receiver: currentUser?._id },

            ]
        }).populate("messages").sort({ updatedAt: -1 })

        socket.emit('message', getConversation?.messages || [])
    });


    // new message
    socket.on('new message', async (data) => {
        // console.log('new message', data)

        // check both user conversation already have
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender },

            ]
        })
        // console.log("conversation", conversation)

        // if conversation not available then create new conversation
        if (!conversation) {
            const createConversation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })

            conversation = await createConversation.save()
        }


        const message = await MessageModel({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            msgByUserId: data?.msgByUserId
        })

        console.log('message', message)

        const saveMessage = await message?.save()

        const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
            "$push": { messages: saveMessage?._id }
        })


        // get conversation
        const getConversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender },

            ]
        }).populate("messages").sort({ updatedAt: -1 })

        console.log("get conversation", getConversation)

        io.to(data?.sender).emit('message', getConversation?.messages)
        io.to(data?.receiver).emit('message', getConversation?.messages)

        // sidebar message
        const conversationSender = await getRecentConversations(data?.sender)
        const conversationReceiver = await getRecentConversations(data?.receiver)

        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)
    })


    // sidebar conversation user
    socket.on('sidebar', async (userId) => {
        console.log('sidebar user id', userId)

        const conversation = await getRecentConversations(userId)

        socket.emit('conversation', conversation)

    })


    // seen message
    socket.on('seen', async (msgUserId) => {

        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: currentUser?._id, receiver: msgUserId },
                { sender: msgUserId, receiver: currentUser?._id },
            ]
        })

        const conversationMessagesId = conversation?.messages || []

        const updateMessages = await MessageModel.updateMany(
            { _id: { "$in": conversationMessagesId }, msgByUserId: msgUserId },
            { "$set": { seen: true } }
        )

        // sidebar message
        const conversationSender = await getRecentConversations(currentUser?._id?.toString())
        const conversationReceiver = await getRecentConversations(msgUserId)

        io.to(currentUser?._id?.toString()).emit('conversation', conversationSender)
        io.to(msgUserId).emit('conversation', conversationReceiver)
    })


    // Handle disconnection
    socket.on('disconnect', () => {
        onlineUser.delete(currentUser._id);
        io.emit('onlineUser', Array.from(onlineUser));
        // console.log("Disconnected user", socket.id);
    });
});

module.exports = {
    app,
    server
};
