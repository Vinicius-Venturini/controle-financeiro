const database = require('./database');
const { AppError } = require('../errors/AppError');
const { getUser } = require('./getUser');
const { getPendencia } = require('./getPendencia');
const { editUser } = require('./editUser');

async function createPendencia(id, tipo, valor, descricao, previsao){

    if(previsao === undefined) previsao = null;

    if(previsao != null) previsao += 'T12:00:00.000Z';

    if(!(typeof valor === "number")) throw new AppError("Bad Request: O valor de pendencia deve ser passado em forma de número real", 400);

    if(valor > 9999999999999) throw new AppError("Bad Request: O valor de pendencia deve ser menor que 10000000000000", 400);

    if(valor < 0) throw new AppError("Bad Request: O valor de pendencia deve ser positivo", 400);

    const valorString = valor.toString();
    const created_at = new Date();

    try{
        
        const client = await database();

        const responseInsert = await client.query('INSERT INTO pendencia (iduser, tipo, valor, descricao, previsao, created_at) VALUES ($1, $2, $3, $4, $5, $6)', [id, tipo, valorString, descricao, previsao, created_at]);
        const responseSelect = await client.query('SELECT id FROM pendencia WHERE iduser = $1 AND tipo = $2 AND valor = $3 AND created_at = $4', [id, tipo, valorString, created_at]);

        const pendencia = await getPendencia(responseSelect.rows[0].id);

        let pendenciasAtual = (await getUser(id)).pendencias;
        pendenciasAtual = parseFloat(pendenciasAtual);

        let novaPendencias = (tipo == '1' ? (pendenciasAtual + valor) : (pendenciasAtual - valor));
        novaPendencias = novaPendencias.toString();

        const user = await editUser(id, "pendencias", novaPendencias);

        return {
            pendencia: pendencia,
            user: user
        }

    }catch(error){
        throw error;
    }

}

module.exports = {
    createPendencia
}