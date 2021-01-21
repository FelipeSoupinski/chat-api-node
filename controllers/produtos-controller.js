const mysql = require('../mysql');

exports.getProdutos = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * from produtos;")
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
    } catch (error) {
        return res.status(500).send({ error });
    }
};

exports.postProdutos = async (req, res, next) => {
    try {
        const result = await mysql.execute(
            "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?);", 
            [req.body.nome, req.body.preco, req.file.path]
        );
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
    } catch (error) {
        return res.status(500).send({ error });
    }
};

exports.getProduto = async (req, res, next) => {
    try {
        const result = await mysql.execute(
            "SELECT * from produtos WHERE id_produto = ?;",
            [req.params.id]
        );
        if (result.length == 0) {
            return res.status(404).send({ mensagem: 'Produto não encontrado' });
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
    } catch (error) {
        return res.status(500).send({ error });
    }
}

exports.updateProduto = async (req, res, next) => {
    try {
        await mysql.execute(
            "UPDATE produtos SET nome = ?, preco = ?, imagem_produto = ? WHERE id_produto = ?;",
            [req.body.nome, req.body.preco, req.file.path, req.body.id_produto]
        );
        const response = {
            mensagem: 'Produto atualizado com sucesso',
            request: {
                tipo: 'PATCH',
                descricao: 'Edita um produto'
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error });
    }
}

exports.deleteProdutos = async (req, res, next) => {
    try {
        await mysql.execute(
            "DELETE FROM produtos WHERE id_produto = ?;",
            [req.body.id_produto]
        );
        const response = {
            mensagem: 'Produto deletado com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Remove um produto'
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error });
    }
}
