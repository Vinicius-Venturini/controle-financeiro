const { AppError } = require('../errors/AppError');
const database = require('./database');
const { editUser } = require('./editUser');
const { getMovimentacao } = require('./getMovimentacao');
const { getUser } = require('./getUser');

async function editMovimentacao(id, iduser, column, data){

    if(column == 'id' || column == 'created_at' || column == 'iduser') throw new AppError('Forbiden: Este campo não pode ser alterado', 403);

    if(column != 'tipo' && column != 'valor' && column != 'descricao') throw new AppError('Bad Request: Este campo não existe', 400);

    if(!(typeof data === 'string' || data instanceof String)) throw new AppError('Bad Request: A informação precisar ser uma string', 400);

    if(column == 'tipo'){

        if(data != 'entrada' && data != 'saida') throw new AppError('Bad Request: O parâmetro "tipo" deve ser definido como "entrada" ou "saida"', 400);

        data = (data == 'entrada' ? '1' : '0');

    }

    try{

        let movimentacaoAtual = await getMovimentacao(id);

        let saldoAtual = (await getUser(iduser)).saldo;
        saldoAtual = parseFloat(saldoAtual);
        saldoAtual = (movimentacaoAtual.tipo == 'entrada' ? (saldoAtual - parseFloat(movimentacaoAtual.valor)) : (saldoAtual + parseFloat(movimentacaoAtual.valor)));

        const client = await database();
        const responseUpdate = await client.query('UPDATE movimentacao SET ' + column + ' = $1 WHERE id = $2', [data, id]);

        const movimentacao = await getMovimentacao(id);

        let novoSaldo = (movimentacao.tipo == 'entrada' ? (saldoAtual + parseFloat(movimentacao.valor)) : (saldoAtual - parseFloat(movimentacao.valor)));
        novoSaldo = novoSaldo.toString();

        const user = await editUser(iduser, "saldo", novoSaldo);

        return {
            user: user,
            movimentacao: movimentacao
        };

    }catch(error){
        throw error;
    }

}

module.exports = {
    editMovimentacao
}