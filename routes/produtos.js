const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * from produtos',
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                res.status(200).send({
                    resultado
                });
            }
        )
    });
});

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                res.status(201).send({
                    mensagem: 'Produto criado com sucesso',
                    id_produto: resultado.insertId
                });
            }
        );
    });
});

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * from produtos WHERE id_produto = ?',
            [req.params.id],
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                res.status(200).send({
                    resultado
                });
            }
        )
    });
});

router.patch('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?;',
            [req.body.nome, req.body.preco, req.body.id],
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                res.status(202).send({
                    mensagem: 'Produto editado com sucesso'
                });
            }
        )
    });
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [req.body.id],
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                res.status(202).send({
                    mensagem: 'Produto removido com sucesso',
                    resultado
                });
            }
        )
    });
});

module.exports = router;
