const database = require('./database');
const { AppError } = require('../errors/AppError');
const { getUser } = require('./getUser');
const { getMovimentacao } = require('./getMovimentacao');
const { editUser } = require('./editUser');

async function createMovimentacao(id, tipo, valor, descricao){

    if(!(typeof valor === "number")) throw new AppError("Bad Request: O valor de movimentação deve ser passado em forma de número real", 400);

    if(valor >= 1000000) throw new AppError("Bad Request: O valor de movimentação deve ser menor que 1000000", 400);

    if(valor < 0) throw new AppError("Bad Request: O valor de movimentação deve ser positivo", 400);

    const valorString = valor.toString();
    const created_at = new Date().toLocaleString({timeZone: "America/Sao_Paulo"});

    try{
        
        const client = await database();

        const responseInsert = await client.query('INSERT INTO movimentacao (iduser, tipo, valor, descricao, created_at) VALUES ($1, $2, $3, $4, $5)', [id, tipo, valorString, descricao, created_at]);
        const responseSelect = await client.query('SELECT id FROM movimentacao WHERE iduser = $1 AND tipo = $2 AND valor = $3 AND created_at = $4', [id, tipo, valorString, created_at]);

        const movimentacao = await getMovimentacao(responseSelect.rows[0].id);

        let saldoAtual = (await getUser(id)).saldo;
        saldoAtual = parseFloat(saldoAtual);

        let novoSaldo = (tipo == '1' ? (saldoAtual + valor) : (saldoAtual - valor));
        novoSaldo = novoSaldo.toString();

        const user = await editUser(id, "saldo", novoSaldo);

        return {
            movimentacao: movimentacao,
            user: user
        }

    }catch(error){
        throw error;
    }

}

module.exports = {
    createMovimentacao
}