const { AppError } = require('../errors/AppError');
const database = require('./database');

async function getUser(id){

    try{

        const client = await database();

        const responseSelect = await client.query('SELECT id, nome, saldo, created_at, pendencias FROM users WHERE id = $1', [id]);

        if(responseSelect.rowCount != 1) throw new AppError('Not Found: Usuário não encontrado', 404);

        const userObj = {
            id: responseSelect.rows[0].id,
            nome: responseSelect.rows[0].nome,
            saldo: responseSelect.rows[0].saldo,
            pendencias: responseSelect.rows[0].pendencias,
            created_at: new Date(responseSelect.rows[0].created_at)
        };

        return userObj;

    }catch(error){
        throw error;
    }
    
}

module.exports = {
    getUser
}