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
        .then(response => {})
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
        res.locals.pins = response.rows;
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
    })
    .catch(err => {
      console.log(err);
    })

  const text2 = `
        UPDATE users
        SET parking_spot = ${res.locals.id}
        WHERE _id = ${req.body.user_id};
`

  const values = [res.locals.id];
  await db.query(text2)
    .then(response => {})
    .catch(err => {console.log(err)})

  const text3 = `
        SELECT _id, name
        FROM users
        WHERE _id = ${req.body.user_id}
  `

  await db.query(text3)
    .then(response => {
      res.locals.name = response.rows[0].name;
    })
    .catch(err => {console.log(err)})

  next();
}


apiController.updateMarker = async (req, res, next) => {
  const { longitude, latitude, available, reserved, taken, id, parking_spot, reserved_by } = req.body;
  const text = `UPDATE parking
  SET available = false, reserved = true, reserved_by = '${reserved_by}'
  WHERE parking_id = ${parking_spot};`;
  await db.query(text)
    .then(response =>{
    })
    .catch(err =>{
      console.log(err); 
    })

  next();
}

apiController.reservedBy = async (req, res, next) => {
  const { parking_spot } = req.body;
  const text = `SELECT reserved_by
                FROM parking
                WHERE parking_id = ${parking_spot};`;
  await db.query(text)
  .then(response => {
    console.log('this is response.rows in reservedBy', response.rows)
    res.locals.reservedBy = response.rows[0];
  })
  .catch(err => {
    console.log(err);
  })
  next();
}

module.exports = apiController;