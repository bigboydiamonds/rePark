const express = require('express');
const login = express.Router();

const userController = require('../controllers/userController');
// const sessionController = require('../controllers/sessionController');
// const cookieController = require('../controllers/cookieController');


login.post('/', userController.verifyUser, (req, res) => {
    res.status(200).json({ userinfo: res.locals.userinfo, auth: res.locals.auth })
  });

module.exports = login;