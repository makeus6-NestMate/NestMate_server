const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'dungiapp.ctezwyeyfqua.ap-northeast-2.rds.amazonaws.com',
    user: 'dungiapp',
    port: '3306',
    password: 'dungiapp',
    database: 'dungiapp'
});

module.exports = {
    pool: pool
};

