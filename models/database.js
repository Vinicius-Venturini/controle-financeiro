const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DB,
    password: process.env.POSTGRESQL_PASS,
    port: parseInt(process.env.POSTGRESQL_PORT),
});

async function dbConnect(){
    try {
        const con = pool.connect();
        global.connection = con;
        return con;
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = async function(){
    if (!global.connection)
        return dbConnect();

    return global.connection;
}
