// 创建数据库连接对象
const mysql = require('msq')

const db=mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01',
})

module.exports=db