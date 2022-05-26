const { AppError } = require('../errors/AppError');
const auth = require('basic-auth');
const database = require('../models/database');
const sha256 = require('js-sha256').sha256;

async function basicAuth(req, res, next){

    if(!(/^\d+$/.test(req.params.id))) throw new AppError('Not Found: Usuário não encontrado', 404);

    try{

        const client = await database();

        const responseSelect = await client.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

        if(responseSelect.rowCount != 1) throw new AppError("Not Found: Usuário não encontrado", 404);
        
        const credentials = auth(req);

        if(!credentials){
            res.set('WWW-Authenticate', 'Basic realm=http://localhost:3000/');
            throw new AppError('Unauthorized: Autenticação não fornecida', 401);
        }

        const passwordHash = sha256(credentials.pass);

        if(credentials.name != responseSelect.rows[0].nome || passwordHash != responseSelect.rows[0].senha){
            res.set('WWW-Authenticate', 'Basic realm=http://localhost:3000/');
            throw new AppError('Unauthorized: Usuário ou senha incorretos!', 401);
        }

        next();

    }catch(error){

        throw error;

    }

}

module.exports = {
    basicAuth
}