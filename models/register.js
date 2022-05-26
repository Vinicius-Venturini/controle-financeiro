const database = require('./database');
const { AppError } = require('../errors/AppError');
const { getUser } = require('./getUser');
const sha256 = require('js-sha256').sha256;

async function register(name, password){

    if(name.length > 30) throw new AppError('Bad Request: O parâmetro "nome" excede a quantidade máxima permitida de caracteres', 400);

    const passwordHash = sha256(password);
    const created_at = new Date().toLocaleString({timeZone: "America/Sao_Paulo"});

    try{

        const client = await database();

        const responseInsert = await client.query('INSERT INTO users (nome, senha, created_at) VALUES ($1, $2, $3)', [name, passwordHash, created_at]);
        const responseSelect = await client.query('SELECT id FROM users WHERE nome = $1 AND senha = $2 AND created_at = $3', [name, passwordHash, created_at]);

        return await getUser(responseSelect.rows[0].id);
        
    }catch(error){
        throw error;
    }

}

module.exports = {
    register
};