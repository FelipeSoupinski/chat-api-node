const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error }) }

        conn.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [req.body.email],
            (error, result) => {
                if (error) { return res.status(500).send({ error }) }

                if (result.length > 0) {
                    return res.status(409).send({
                        mensagem: 'Email já cadastrado'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({ error: errBcrypt });
                        }
                        conn.query(
                            'INSERT INTO usuarios (email, password) VALUES (?, ?)',
                            [req.body.email, hash],
                            (error, result) => {
                                conn.release();

                                if (error) { return res.status(500).send({ error }) }

                                const response = {
                                    mensagem: 'Usuario criado com sucesso',
                                    usuario: {
                                        id_usuario: result.insertId,
                                        email: req.body.email
                                    }
                                };

                                return res.status(201).send(response);
                            }
                        );
                    });
                }
            }
        );
    });
};

exports.login = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [req.body.email],
            (error, results, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error }) }
                if (results.length == 0) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                bcrypt.compare(req.body.password, results[0].password, (error, result) => {
                    if (error) {
                        return res.status(401).send({ mensagem: 'Falha na autenticação' });
                    }
                    if (result) {
                        const token = jwt.sign({
                            id_usuario: results[0].id_usuario,
                            email: results[0].email
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
            }
        );
    });
};
