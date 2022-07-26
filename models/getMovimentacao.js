const { AppError } = require('../errors/AppError');
const database = require('./database');

async function getMovimentacao(id){

    try{

        const client = await database();

        const responseSelect = await client.query('SELECT * FROM movimentacao WHERE id = $1', [id]);

        if(responseSelect.rowCount != 1) throw new AppError('Not Found: Movimentacao nao encontrada', 404);

        const tipo = (responseSelect.rows[0].tipo == true ? 'entrada' : 'saida');

        const movimentacaoObj = {
            id: responseSelect.rows[0].id,
            iduser: responseSelect.rows[0].iduser,
            tipo: tipo,
            valor: responseSelect.rows[0].valor,
            descricao: responseSelect.rows[0].descricao,
            created_at: new Date(responseSelect.rows[0].created_at)
        };

        return movimentacaoObj;

    }catch(error){
        throw error;
    }
    
}

module.exports = {
    getMovimentacao
}