const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString + file.originalname);
    }
});
 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB tamanho máximo de imagem 
    },
    fileFilter: fileFilter
}); 

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
});

router.post('/', upload.single('produto_imagem'), (req, res, next) => {
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
});

module.exports = router;
