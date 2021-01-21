const mysql = require('mysql');

const pool = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});

exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, conn) => {
            if (error) { 
                reject(error);
            } else {
                pool.query(query, params, (error, result, fields) => {
                    conn.release();
                    if (error) { 
                        reject(error); 
                    } else {
                        resolve(result);
                    }
                });
            }
            
        });
    });
}

exports.pool = pool;
