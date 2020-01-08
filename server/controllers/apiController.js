const db = require('../models/data');

const apiController = {};

apiController.create = (req, res, next) => {
    const { longitude, latitude } = req.body;
    const time = new Date(Date.UTC(96, 1, 2, 3, 4, 5)).toUTCString();

    const text = `
        INSERT INTO parkingpins(longitude, latitude, time, available, reserve, taken)
        values($1, $2, $3, $4, $5, $6)
    `

    const values = [longitude, latitude, time, true, false, false ];

    db.query(text, params)
        .then(response => console.log(response))
        .catch(err => console.log(err))

    next();
}

apiController.findAll = async (req, res, next) =>{
    const text = `
        SELECT * 
        FROM parkingpins
    `
    await db.query(text)
    .then(response =>{
        res.locals.pins = response.rows;
        console.log(response)
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports = apiController;