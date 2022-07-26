const { AppError } = require('../errors/AppError');
const database = require('./database');

async function getAllMovimentacao(iduser, from, to){

    let fromSql = '', toSql = '';

    if(from) fromSql = 'AND created_at > \'' + from + 'T00:00:00.000Z\'';
    if(to) toSql = 'AND created_at < \'' + to + 'T23:59:59.999Z\'';

    try{

        const client = await database();

        const responseSelect = await client.query('SELECT * FROM movimentacao WHERE iduser = $1 ' + fromSql + toSql + ' ORDER BY created_at', [iduser]);

        const movimentacoes = [];

        for(let i = 0; i < responseSelect.rowCount; i++){

            let tipo = (responseSelect.rows[i].tipo == true ? 'entrada' : 'saida');
            let movimentacaoObj = {
                id: responseSelect.rows[i].id,
                iduser: responseSelect.rows[i].iduser,
                tipo: tipo,
                valor: responseSelect.rows[i].valor,
                descricao: responseSelect.rows[i].descricao,
                created_at: new Date(responseSelect.rows[i].created_at)
            };
            movimentacoes.push(movimentacaoObj);

        }

        return movimentacoes;

    }catch(error){
        throw error;
    }
    
}

module.exports = {
    getAllMovimentacao
}