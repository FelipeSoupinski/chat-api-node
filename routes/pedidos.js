const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todos pedidos'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido criado'
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).send({
        mensagem: `GET pedido ${id}`,
        id
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).send({
        mensagem: 'Pedido deletado',
        id
    });
});

module.exports = router;
