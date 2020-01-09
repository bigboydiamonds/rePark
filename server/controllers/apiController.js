const db = require('../models/data');

const apiController = {};

apiController.create = async (req, res, next) => {
    const { longitude, latitude, id } = req.body;
    // const time = new Date(Date.UTC(2020, 1)).toUTCString();
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
    const text = `
        INSERT INTO parking(longitude, latitude, time, available, reserved, taken)
        values($1, $2, $3, $4, $5, $6);
    `

    const values = [longitude, latitude, dateTime, true, false, false ];

   await db.query(text, values)
        .then(response => console.log(response))
        .catch(err => console.log(err))

    next();
}

apiController.findAll = async (req, res, next) =>{
    const text = `
        SELECT name, _id, car_make, car_model, parking_spot, longitude, latitude, time, available, reserved, taken
        FROM users
        LEFT JOIN parking
        ON parking_spot = parking_id;
    `
    await db.query(text)
    .then(response =>{
        console.log('response.rows within apicontroller is: ',response.rows);
        res.locals.pins = response.rows;
        console.log('Locations are updating!');
    })
    .catch(err => {
        console.log(err)
    })

    next();
}

apiController.findOne = async (req, res, next) =>{
  const { longitude, latitude, id } = req.body;
  const text = `
                SELECT parking_id
                FROM parking
                WHERE longitude = '${longitude}' AND latitude = '${latitude}';
`
  await db.query(text)
    .then(response => {
      res.locals.id = response.rows[0].parking_id;
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    })

    console.log('req.body within findOne controller function in api: ', req.body);
  const text2 = `
        UPDATE users
        SET parking_spot = ${res.locals.id}
        WHERE _id = ${req.body.user_id};
`

  const values = [res.locals.id];
  await db.query(text2)
    .then(response => {console.log(response)})
    .catch(err => {console.log(err)})

  const text3 = `
        SELECT _id, name
        FROM users
        WHERE _id = ${req.body.user_id}
  `

  await db.query(text3)
    .then(response => {
      res.locals.name = response.rows[0].name;
      console.log(response);
    })
    .catch(err => {console.log(err)})

  next();
}

apiController.updateMarker = async (req, res, next) => {
  const { longitude, latitude } = req.body;
  const text = `SELECT * 
                FROM parking 
                WHERE longitude = '${longitude}' AND latitude = '${latitude}'`;
  await db.query(text)
    .then(response =>{
    res.locals.updated = response.rows[0];
    console.log(response);
    })
    .catch(err =>{
      console.log(err); 
    })

  next();
}

module.exports = apiController;