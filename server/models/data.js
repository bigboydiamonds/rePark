const { Pool } = require('pg');

const PG_URI= 'postgres://dkuslawz:D8ru1jkT06vPEtqBOco6nYIBl-_7OvSB@rajje.db.elephantsql.com:5432/dkuslawz';

const pool = new Pool({
    connectionString: PG_URI
});

module.exports = {
    query: (text, params, callback) => {
        console.log('executed query', text);
        return pool.query(text, params, callback);
    }
};