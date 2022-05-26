const database = require('./database');
const { editUser } = require('./editUser');
const { getMovimentacao } = require('./getMovimentacao');
const { getUser } = require('./getUser');

async function deleteMovimentacao(id, iduser){

    try{

        let movimentacaoAtual = await getMovimentacao(id);

        let saldoAtual = (await getUser(iduser)).saldo;
        saldoAtual = parseFloat(saldoAtual);
        saldoAtual = (movimentacaoAtual.tipo == 'entrada' ? (saldoAtual - parseFloat(movimentacaoAtual.valor)) : (saldoAtual + parseFloat(movimentacaoAtual.valor)));
        saldoAtual = saldoAtual.toString();

        const client = await database();
        await client.query('DELETE FROM movimentacao WHERE id = $1', [id]);

        return await editUser(iduser, "saldo", saldoAtual);

    }catch(error){
        throw error;
    }

}

module.exports = {
    deleteMovimentacao
}