const mysql = require('../mysql');

exports.getPedidos = async (req, res, next) => {
    try {
        const result = await mysql.execute(
            "SELECT * FROM pedidos INNER JOIN produtos ON pedidos.id_produto = produtos.id_produto;"
        );
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
    } catch (error) {
        return res.status(500).send({ error });
    }
};

exports.postPedidos = async (req, res, next) => {
    try {
        const produto = await mysql.execute(
            "SELECT * from produtos WHERE id_produto = ?;",
            [req.body.id_produto]
        );
        if (produto.length == 0) {
            return res.status(404).send({
                mensagem: 'Produto não encontrado'
            });
        }
        const result = await mysql.execute(
            "INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?);",
            [req.body.id_produto, req.body.quantidade]
        );
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
    } catch (error) {
        res.status(500).send({ error });
    }
};

exports.getPedido = async (req, res, next) => {
    try {
        const result = await mysql.execute(
            `SELECT * from pedidos 
                INNER JOIN produtos 
                ON pedidos.id_produto = produtos.id_produto 
                WHERE id_pedido = ?;`,
            [req.params.id]
        );
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado pedido com este ID'
            });
        }
        const response = {
            pedido: {
                id_pedido: result[0].id_pedido,
                quantidade: result[0].quantidade,
                produto: {
                    id_produto: result[0].id_produto,
                    nome: result[0].nome,
                    preco: result[0].preco
                }
            },
            request: {
                tipo: 'GET',
                descricao: 'Retorna um pedido'
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error });
    }
};

exports.deletePedido = async (req, res, next) => {
    try {
        await mysql.execute(
            "DELETE FROM pedidos WHERE id_pedido = ?;",
            [req.body.id_pedido]
        );
        const response = {
            mensagem: 'Pedido deletado com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Remove um pedido'
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error });;
    }
};
