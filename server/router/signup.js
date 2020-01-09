const express = require('express');
const signup = express.Router();

const userController = require('../controllers/userController');
// const sessionController = require('../controllers/sessionController');
const cookieController = require('../controllers/cookieController');


signup.post('/', userController.createUser, cookieController.setCookie, (req, res) => {
	const { phone } = req.body;
<<<<<<< HEAD
    phoneNum = Number(phone);
	res.status(200)
			.cookie('id', phoneNum, {httpOnly: false})
			.json(phoneNum)
			// .cookie('id', phoneNum, {httpOnly: false});
=======
  phoneNum = Number(phone);
	res.status(200).json(phoneNum);
>>>>>>> b6c1f7107f7b2728b26750639afe82551fd79ae4
});

signup.put('/', userController.updateUserCar,
		  (req, res) => {
			res.status(200).json({ successfulSignup: true })
		  })
						



module.exports = signup;