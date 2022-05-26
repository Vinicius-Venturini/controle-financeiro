const database = require('./database');

async function deleteUser(id){

    try{

        const client = await database();
        return await client.query('DELETE FROM users WHERE id = $1', [id]);

    }catch(error){
        throw error;
    }

}

module.exports = {
    deleteUser
}