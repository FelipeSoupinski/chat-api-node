const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * from produtos',
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos'
                            }
                        }
                    })
                }

                return res.status(200).send(response);
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
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    mensagem: 'Produto criado com sucesso',
                    produto: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco
                    },
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto'
                    }
                }

                return res.status(201).send(response);
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
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    });
                }

                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna um produto'
                    }
                }

                return res.status(200).send(response);
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
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produto: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco
                    },
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Edita um produto'
                    }
                }

                return res.status(202).send(response);
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

                const response = {
                    mensagem: 'Produto deletado com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Remove um produto'
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
