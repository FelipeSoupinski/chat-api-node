const mysql = require('../mysql').pool;

exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * FROM pedidos INNER JOIN produtos ON pedidos.id_produto = produtos.id_produto',
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            }
                        }
                    }),
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos'
                    }
                }
                
                return res.status(200).send(response);
            }
        );
    });
};

exports.postPedidos = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * from produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, field) => {
                
                if (error) { return res.status(500).send({ error }) }
            
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    });
                } 

                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, field) => {
                        conn.release();
        
                        if (error) { return res.status(500).send({ error }) }
        
                        const response = {
                            mensagem: 'Pedido criado com sucesso',
                            pedido: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade
                            },
                            request: {
                                tipo: 'POST',
                                descricao: 'Insere um pedido'
                            }
                        }
        
                        return res.status(201).send(response);
                    }
                );
            }
        );
    });
};

exports.getPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * from pedidos WHERE id_pedido = ?',
            [req.params.id],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    });
                }

                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna um pedido'
                    }
                }

                return res.status(200).send(response);
            }
        )
    });
};

exports.deletePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [req.body.id],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error }) }

                const response = {
                    mensagem: 'Pedido deletado com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Remove um pedido'
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
};
