const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchFriend = require('../controller/searchFriend');

const router = express.Router()

// create user api
router.post('/register', registerUser)

// login process
router.post('/email', checkEmail)
router.post('/password', checkPassword)
router.get('/user-details', userDetails)
router.get('/logout', logout)
router.post('/updated-user', updateUserDetails)


// search 
router.post('/search-friend', searchFriend)



module.exports = router