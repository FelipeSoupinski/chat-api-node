const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {
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
                            imagem_produto: prod.imagem_produto  
                        }
                    }), 
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos'
                    }
                }

                return res.status(200).send(response);
            }
        )
    });
};

exports.postProdutos = (req, res, next) => { 
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    mensagem: 'Produto criado com sucesso',
                    produto: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path
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
};

exports.getProduto = (req, res, next) => {
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
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto
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
};

exports.updateProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'UPDATE produtos SET nome = ?, preco = ?, imagem_produto = ? WHERE id_produto = ?;',
            [req.body.nome, req.body.preco, req.file.path, req.body.id],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Edita um produto'
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
};

exports.deleteProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, fields) => {
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
};
