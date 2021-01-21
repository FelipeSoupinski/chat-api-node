const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.cadastrarUsuario = async (req, res, next) => {
    try {
        const result = await mysql.execute(
            "SELECT * FROM usuarios WHERE email = ?;",
            [req.body.email]
        );
        if (result.length > 0) {
            return res.status(409).send({
                mensagem: 'Email já cadastrado'
            });
        } else {
            bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
                if (errBcrypt) {
                    return res.status(500).send({ error: errBcrypt });
                }
                const insert = await mysql.execute(
                    "INSERT INTO usuarios (email, password) VALUES (?, ?);",
                    [req.body.email, hash]
                );
                const response = {
                    mensagem: 'Usuario criado com sucesso',
                    usuario: {
                        id_usuario: insert.insertId,
                        email: req.body.email
                    }
                };
                return res.status(201).send(response);
            });
        }
    } catch (error) {
        return res.status(500).send({ error });
    }
}

exports.login = async (req, res, next) => {
    try {
        const result = await mysql.execute(
            "SELECT * FROM usuarios WHERE email = ?;",
            [req.body.email]
        );
        if (result.length == 0) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' });
        }
        bcrypt.compare(req.body.password, result[0].password, (error, results) => {
            if (error) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            }
            if (results) {
                const token = jwt.sign({
                    id_usuario: result[0].id_usuario,
                    email: result[0].email
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "6h"
                });
                return res.status(200).send({ 
                    mensagem: 'Logado com sucesso',
                    token
                });
            }
            return res.status(401).send({ mensagem: 'Falha na autenticação' });
        });
    } catch (error) {
        return res.status(500).send({ error });
    }
}
