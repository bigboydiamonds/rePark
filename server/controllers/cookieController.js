const db = require('../models/data');


// const cookieController = {
    
//     setSSIDCookie (req, res, next) {
//         User.find({name: res.locals.user.name})
//         .exec()
//         .then(user => {
//             res.cookie('ssid', user[0]._id, {httpOnly: true});
//             res.locals.userId = user[0]._id;
//             return next();
//         })
//         .catch(
//             err => {return next({
//                 log: 'Express error handler caught setSSIDcookie error',
//                 status: 400,
//                 message: { err: 'An error occurred' },
//               })}
//         )
//     }
// };

const cookieController = {}; 

cookieController.setCookie = (req, res, next) =>{
    const { phone } = req.body;
    const phoneNum = Number(phone);
    res.cookie('username', phoneNum, {httpOnly: false});
    next();
}
module.exports = cookieController;