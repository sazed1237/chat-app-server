const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB');
const router = require('./routes/Router');
const { app, server } = require('./socket/socket')


// const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL_PRODUCTION || "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// api endpoint
app.use('/api', router)


app.options('*', cors({
    origin: [process.env.FRONTEND_URL_PRODUCTION || "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));


// api
app.get('/', async (req, res) => {
    res.send('welcome to Chat App')
})

// run server
connectDB().then(() => {
    server.listen(port, () => {
        console.log(`server is running on ${port}`)
    })
})