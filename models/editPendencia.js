const { AppError } = require('../errors/AppError');
const database = require('./database');
const { editUser } = require('./editUser');
const { getPendencia } = require('./getPendencia');
const { getUser } = require('./getUser');

async function editPendencia(id, iduser, column, data){

    if(column == 'id' || column == 'created_at' || column == 'iduser') throw new AppError('Forbiden: Este campo não pode ser alterado', 403);

    if(column != 'tipo' && column != 'valor' && column != 'descricao' && column != 'previsao') throw new AppError('Bad Request: Este campo não existe', 400);

    if(!(typeof data === 'string' || data instanceof String)) throw new AppError('Bad Request: A informação precisar ser uma string', 400);

    if(column == 'tipo'){

        if(data != 'receita' && data != 'divida') throw new AppError('Bad Request: O parâmetro "tipo" deve ser definido como "receita" ou "divida"', 400);

        data = (data == 'receita' ? '1' : '0');

    }

    try{

        let pendenciaAtual = await getPendencia(id);

        let pendenciasAtual = (await getUser(iduser)).pendencias;
        pendenciasAtual = parseFloat(pendenciasAtual);
        pendenciasAtual = (pendenciaAtual.tipo == 'receita' ? (pendenciasAtual - parseFloat(pendenciaAtual.valor)) : (pendenciasAtual + parseFloat(pendenciaAtual.valor)));

        const client = await database();
        const responseUpdate = await client.query('UPDATE pendencia SET ' + column + ' = $1 WHERE id = $2', [data, id]);

        const pendencia = await getPendencia(id);

        let novaPendencias = (pendencia.tipo == 'receita' ? (pendenciasAtual + parseFloat(pendencia.valor)) : (pendenciasAtual - parseFloat(pendencia.valor)));
        novaPendencias = novaPendencias.toString();

        const user = await editUser(iduser, "pendencias", novaPendencias);

        return {
            user: user,
            pendencia: pendencia
        };

    }catch(error){
        throw error;
    }

}

module.exports = {
    editPendencia
}