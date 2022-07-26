const { AppError } = require('../errors/AppError');
const database = require('./database');

async function getPendencia(id){

    try{

        const client = await database();

        const responseSelect = await client.query('SELECT * FROM pendencia WHERE id = $1', [id]);

        if(responseSelect.rowCount != 1) throw new AppError('Not Found: Pendencia nao encontrada', 404);

        const tipo = (responseSelect.rows[0].tipo == true ? 'receita' : 'divida');
        
        let previsao = "Não Informado";

        if(responseSelect.rows[0].previsao != null){
            previsao = new Date(responseSelect.rows[0].previsao);
            previsao = (("0" + previsao.getDate()).slice(-2)) + '/' + (("0" + (previsao.getMonth() + 1)).slice(-2)) + '/' + previsao.getFullYear();
        }

        const pendenciaObj = {
            id: responseSelect.rows[0].id,
            iduser: responseSelect.rows[0].iduser,
            tipo: tipo,
            valor: responseSelect.rows[0].valor,
            descricao: responseSelect.rows[0].descricao,
            previsao: previsao,
            created_at: new Date(responseSelect.rows[0].created_at)
        };

        return pendenciaObj;

    }catch(error){
        throw error;
    }
    
}

module.exports = {
    getPendencia
}