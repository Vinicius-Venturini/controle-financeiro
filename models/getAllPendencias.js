const { AppError } = require('../errors/AppError');
const database = require('./database');

async function getAllPendencias(iduser, from, to){

    let fromSql = '', toSql = '';

    if(from) fromSql = 'AND created_at > \'' + from + 'T00:00:00.000Z\'';
    if(to) toSql = 'AND created_at < \'' + to + 'T23:59:59.999Z\'';

    try{

        const client = await database();

        const responseSelect = await client.query('SELECT * FROM pendencia WHERE iduser = $1 ' + fromSql + toSql + ' ORDER BY created_at', [iduser]);

        const pendencias = [];

        for(let i = 0; i < responseSelect.rowCount; i++){

            let tipo = (responseSelect.rows[i].tipo == true ? 'receita' : 'divida');

            let previsao = "Não Informado";
            if(responseSelect.rows[i].previsao != null){
                previsao = new Date(responseSelect.rows[i].previsao);
                previsao = (("0" + previsao.getDate()).slice(-2)) + '/' + (("0" + (previsao.getMonth() + 1)).slice(-2)) + '/' + previsao.getFullYear();
            }

            let pendenciaObj = {
                id: responseSelect.rows[i].id,
                iduser: responseSelect.rows[i].iduser,
                tipo: tipo,
                valor: responseSelect.rows[i].valor,
                descricao: responseSelect.rows[i].descricao,
                previsao: previsao,
                created_at: new Date(responseSelect.rows[i].created_at)
            };
            pendencias.push(pendenciaObj);

        }

        return pendencias;

    }catch(error){
        throw error;
    }
    
}

module.exports = {
    getAllPendencias
}