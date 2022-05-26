const { AppError } = require('../errors/AppError');
const database = require('./database');
const { getUser } = require('./getUser');

async function editUser(id, column, data){

    if(column == 'id' || column == 'created_at') throw new AppError('Forbiden: Este campo não pode ser alterado', 403);

    if(column != 'nome' && column != 'saldo' && column != 'pendencias') throw new AppError('Bad Request: Este campo não existe', 400);

    if(!(typeof data === 'string' || data instanceof String)) throw new AppError('Bad Request: A informação precisar ser uma string', 400);

    try{

        const client = await database();
        const responseUpdate = await client.query('UPDATE users SET ' + column + ' = $1 WHERE id = $2', [data, id]);

        return await getUser(id);

    }catch(error){
        throw error;
    }

}

module.exports = {
    editUser
}