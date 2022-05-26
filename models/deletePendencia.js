const database = require('./database');
const { editUser } = require('./editUser');
const { getPendencia } = require('./getPendencia');
const { getUser } = require('./getUser');

async function deletePendencia(id, iduser){

    try{

        let pendenciaAtual = await getPendencia(id);

        let pendenciasAtual = (await getUser(iduser)).pendencias;
        pendenciasAtual = parseFloat(pendenciasAtual);
        pendenciasAtual = (pendenciaAtual.tipo == 'receita' ? (pendenciasAtual - parseFloat(pendenciaAtual.valor)) : (pendenciasAtual + parseFloat(pendenciaAtual.valor)));
        pendenciasAtual = pendenciasAtual.toString();

        const client = await database();
        await client.query('DELETE FROM pendencia WHERE id = $1', [id]);

        return await editUser(iduser, "pendencias", pendenciasAtual);

    }catch(error){
        throw error;
    }

}

module.exports = {
    deletePendencia
}