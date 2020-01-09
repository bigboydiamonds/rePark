const path = require('path');
const db = require('../models/data');

const userController = {};

userController.createUser = async (req, res, next) => {
  const { name, phone, pass, email } = req.body;
  const phoneNum = Number(phone);
  const text = `
      INSERT INTO users(name, password, phone_number, email)
      values($1, $2, $3, $4);
  `

  const values = [ name, pass, phoneNum, email ];

    await db.query(text, values)
      .then(response => console.log(response))
      .catch(err => console.log(err))

  const text2 = `
      SELECT _id
      FROM users
      WHERE phone_number = ${phoneNum}
      `

    await db.query(text2) 
      .then(response => {
        res.locals.userID = response.rows[0]._id;
        console.log(response);
      })
      .catch(err => console.log(err));

    next();
  }

userController.verifyUser = async (req, res, next)=>{
  const { phone, pass } = req.body;
  const phoneNum = Number(phone);

  const text = `
    SELECT _id
    FROM users
    WHERE password = '${pass}' AND phone_number = ${phoneNum}
  `

  await db.query(text)
  .then(response => {
    res.locals.id = response.rows[0]._id;
    res.locals.auth = true;
    console.log(response)
  })
  .catch(err => {
    res.locals.auth = false;
    console.log(err)})

  next();
}

userController.updateUserCar = (req, res, next) => {
  const { car_make, car_model, car_color } = req.body;
  const { id } = req.body;
  console.log('req.body in userController: ', req.body);
  const text = `
    UPDATE users
    SET car_make = '${req.body.car.car_make}',
        car_model = '${req.body.car.car_model}',
        car_color = '${req.body.car.car_color}'
    WHERE _id = ${id}
  `

  db.query(text)
    .then(response =>{console.log(response)})
    .catch(err => {console.log(err)});

  next();
}

module.exports = userController;