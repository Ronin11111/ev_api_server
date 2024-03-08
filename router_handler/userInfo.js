// 导入数据库
const db = require('../db/index')
//  bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs')

// 1.用户信息查询
exports.getUserInfo = function (req, res) {
    const sql = 'select * from where id=?'
    db.query(sql, req.user.id, (err, res) => {
        if (err) return res.error(err.message)
        if (res.length !== 1) return res.error('用户信息获取失败!')
        res.send({
            status: 0,
            data: res[0],
            message: '用户信息获取成功！'
        })
    })
}

// 2.用户信息更新
exports.updateInfo = (req, res) => {
    // 2.1.校验格式是否合法
    const sql = 'update users set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, res) => {
        if (err) return res.error(err)
        if (res.length !== 1) return res.error('用户信息修改失败!')
        // 当做send（）调用！！！
        return res.error('用户信息更信成功', 0)
    })
}

// 3.重置密码
exports.resetPsd = (res, req) => {
    // 1.查询是否有用户id
    const sql = 'select * from users where id=?'
    db.query(sql, res.body.id, (err, res) => {
        if (err) return res.error(err)
        if (res.length !== 1) return res.error('用户不存在!')
        // 2.判断原密码是否正确
        if(bcrypt.compareSync(req.body.oldPwd,res[0].password)){
            return res.error('密码错误！')
        }
        // 3.校验密码格式
        // 4.新密码加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 5.更新密码
        const sql1 = 'update users set ? where id=?'
        db.query(sql1, [newPwd, req.body.id], (err, res) => {
            if (err) return res.error(err)
            if (res.length !== 1) return res.error('用户信息修改失败!')
            // 当做send（）调用！！！
            return res.error('密码修改成功', 0)
        })
    })
}

// 4.更新用户头像
exports.updateAvatar=(req,res)=>{
    const sql='update users set ? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.error(err)
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.error('更新头像失败！')      
        // 更新用户头像成功
        return res.error('更新头像成功！', 0)
      })
}