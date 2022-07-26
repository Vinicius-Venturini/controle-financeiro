const express = require('express');
const router = express.Router();
const { AppError } = require('../errors/AppError');
const { basicAuth } = require('../middlewares/basicAuth');
const { createMovimentacao } = require('../models/createMovimentacao');
const { createPendencia } = require('../models/createPendencia');
const { deleteMovimentacao } = require('../models/deleteMovimentacao');
const { deletePendencia } = require('../models/deletePendencia');
const { deleteUser } = require('../models/deleteUser');
const { editMovimentacao } = require('../models/editMovimentacao');
const { editPendencia } = require('../models/editPendencia');
const { editUser } = require('../models/editUser');
const { getAllMovimentacao } = require('../models/getAllMovimentacao');
const { getAllPendencias } = require('../models/getAllPendencias');
const { getMovimentacao } = require('../models/getMovimentacao');
const { getPendencia } = require('../models/getPendencia');
const { getUser } = require('../models/getUser');
const { register } = require('../models/register');

router.get('/:id', basicAuth, async (req, res) => {

    try{
        const user = await getUser(req.params.id);
        return res.status(200).json({
            user: user
        });
    }catch(error){
        throw error;
    }

});

router.post('/', async (req, res) => {

    if(!req.body.nome) throw new AppError('Bad Request: Parâmetro "nome" não especificado!', 400);
    if(!req.body.senha) throw new AppError('Bad Request: Parâmetro "senha" não especificado!', 400);

    try{
        const newUser = await register(req.body.nome, req.body.senha);
        return res.status(201).json({
            user: newUser
        });
    }catch(error){
        throw error;
    }

});

router.delete('/:id', basicAuth, async (req, res) => {

    try{
        await deleteUser(req.params.id);
        return res.status(200).json({
            message: "OK: Usuário removido com sucesso"
        });
    }catch(error){
        throw error;
    }

});

router.patch('/:id', basicAuth, async (req, res) => {

    if(Object.keys(req.body).length < 1) throw new AppError('Bad Request: O campo a ser alterado não foi fornecido', 400);
    if(Object.keys(req.body).length > 1) throw new AppError('Forbiden: Só pode se alterar um campo do usuário por requisição', 403);

    try{
        let user;
        for(let key in req.body){
            user = await editUser(req.params.id, key, req.body[key]);
        }
        return res.status(200).json({
            user: user
        });
    }catch(error){
        throw error;
    }
    
});

router.get('/:id/movimentacao', basicAuth, async (req, res) => {

    if(req.query.from){
        if(!(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(req.query.from))) throw new AppError('Bad Request: A data deve seguir o modelo YYYY-MM-DD', 400);
    }
    if(req.query.to){
        if(!(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(req.query.to))) throw new AppError('Bad Request: A data deve seguir o modelo YYYY-MM-DD', 400);
    }

    try{
        const movimentacoes = await getAllMovimentacao(req.params.id, req.query.from, req.query.to);
        return res.status(200).json({
            movimentacoes: movimentacoes
        });
    }catch(error){
        throw error;
    }

});

router.get('/:id/movimentacao/:idMovimentacao', basicAuth, async (req, res) => {

    if(!(/^\d+$/.test(req.params.idMovimentacao))) throw new AppError('Not Found: Movimentacao nao encontrada', 404);

    try{
        const movimentacao = await getMovimentacao(req.params.idMovimentacao);
        return res.status(200).json({
            movimentacao: movimentacao
        });
    }catch(error){
        throw error;
    }

});

router.post('/:id/movimentacao', basicAuth, async (req, res) => {

    // Entrada = true / Saída = false
    if(!req.body.tipo) throw new AppError('Bad Request: Parâmetro "tipo" não especificado!', 400);
    if(!req.body.valor) throw new AppError('Bad Request: Parâmetro "valor" não especificado!', 400);
    if(!req.body.descricao) throw new AppError('Bad Request: Parâmetro "descricao" não especificado!', 400);
    if(req.body.tipo != 'entrada' && req.body.tipo != 'saida') throw new AppError('Bad Request: O parâmetro "tipo" deve ser definido como "entrada" ou "saida"', 400);
    const tipo = (req.body.tipo == 'entrada' ? '1' : '0');

    try{
        const resposta = await createMovimentacao(req.params.id, tipo, req.body.valor, req.body.descricao);
        return res.status(201).json({
            user: resposta.user,
            movimentacao: resposta.movimentacao
        });
    }catch(error){
        throw error;
    }

});

router.patch('/:id/movimentacao/:idMovimentacao', basicAuth, async (req, res) => {

    if(Object.keys(req.body).length < 1) throw new AppError('Bad Request: O campo a ser alterado não foi fornecido', 400);
    if(Object.keys(req.body).length > 1) throw new AppError('Forbiden: Só pode se alterar um campo da movimentação por requisição', 403);

    try{
        let movimentacao;
        for(let key in req.body){
            movimentacao = await editMovimentacao(req.params.idMovimentacao, req.params.id, key, req.body[key]);
        }
        return res.status(200).json({
            user: movimentacao.user,
            movimentacao: movimentacao.movimentacao
        });
    }catch(error){
        throw error;
    }
    
});

router.delete('/:id/movimentacao/:idMovimentacao', basicAuth, async (req, res) => {

    try{
        const user = await deleteMovimentacao(req.params.idMovimentacao, req.params.id);
        return res.status(200).json({
            message: "OK: Movimentacao removida com sucesso",
            user: user
        });
    }catch(error){
        throw error;
    }

});

router.get('/:id/pendencia', basicAuth, async (req, res) => {

    if(req.query.from){
        if(!(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(req.query.from))) throw new AppError('Bad Request: A data deve seguir o modelo YYYY-MM-DD', 400);
    }
    if(req.query.to){   
        if(!(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(req.query.to))) throw new AppError('Bad Request: A data deve seguir o modelo YYYY-MM-DD', 400);
    }

    try{
        const pendencias = await getAllPendencias(req.params.id, req.query.from, req.query.to);
        return res.status(200).json({
            pendencias: pendencias
        });
    }catch(error){
        throw error;
    }

});

router.get('/:id/pendencia/:idPendencia', basicAuth, async (req, res) => {

    if(!(/^\d+$/.test(req.params.idPendencia))) throw new AppError('Not Found: Pendencia nao encontrada', 404);

    try{
        const pendencia = await getPendencia(req.params.idPendencia);
        return res.status(200).json({
            pendencia: pendencia
        });
    }catch(error){
        throw error;
    }

});

router.post('/:id/pendencia', basicAuth, async (req, res) => {

    // Receita = true / Dívida = false
    if(!req.body.tipo) throw new AppError('Bad Request: Parâmetro "tipo" não especificado!', 400);
    if(!req.body.valor) throw new AppError('Bad Request: Parâmetro "valor" não especificado!', 400);
    if(!req.body.descricao) throw new AppError('Bad Request: Parâmetro "descricao" não especificado!', 400);
    if(req.body.previsao){
        if(!(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(req.body.previsao))) throw new AppError('Bad Request: A data deve seguir o modelo YYYY-MM-DD', 400);
    }
    if(req.body.tipo != 'receita' && req.body.tipo != 'divida') throw new AppError('Bad Request: O parâmetro "tipo" deve ser definido como "receita" ou "divida"', 400);
    const tipo = (req.body.tipo == 'receita' ? '1' : '0');

    try{
        const resposta = await createPendencia(req.params.id, tipo, req.body.valor, req.body.descricao, req.body.previsao);
        return res.status(201).json({
            user: resposta.user,
            pendencia: resposta.pendencia
        });
    }catch(error){
        throw error;
    }

});

router.patch('/:id/pendencia/:idPendencia', basicAuth, async (req, res) => {

    if(Object.keys(req.body).length < 1) throw new AppError('Bad Request: O campo a ser alterado não foi fornecido', 400);
    if(Object.keys(req.body).length > 1) throw new AppError('Forbiden: Só pode se alterar um campo da pendencia por requisição', 403);

    try{
        let pendencia;
        for(let key in req.body){
            pendencia = await editPendencia(req.params.idPendencia, req.params.id, key, req.body[key]);
        }
        return res.status(200).json({
            user: pendencia.user,
            pendencia: pendencia.pendencia
        });
    }catch(error){
        throw error;
    }
    
});

router.delete('/:id/pendencia/:idPendencia', basicAuth, async (req, res) => {

    try{
        const user = await deletePendencia(req.params.idPendencia, req.params.id);
        return res.status(200).json({
            message: "OK: Pendencia removida com sucesso",
            user: user
        });
    }catch(error){
        throw error;
    }

});

module.exports = router;