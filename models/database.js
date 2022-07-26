const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
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
