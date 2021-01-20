const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todos produtos'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto criado'
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).send({
        mensagem: `GET produto ${id}`,
        id
    });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).send({
        mensagem: 'Produto editado',
        id
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).send({
        mensagem: 'Produto deletado',
        id
    });
});

module.exports = router;
