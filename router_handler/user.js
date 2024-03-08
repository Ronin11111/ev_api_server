// 用户路由处理函数，提供给user router调用

// 3.导入db模块
const db=require('../db/index')
const sql='select * from users where username=?'

// 4.导入密码加密包
const bcrypt = require('bcryptjs')

// 2.4.2. 生成 Token 字符串的包
const jwt = require('jsonwebtoken')

// 2.4.3.导入加密和解密的jwtSecretKey
const jwtSecretKey=require('../config')
const config = require('../config')

// 通过exports.挂载属性和方法，以供模块外使用
// 1.注册用户的处理函数
exports.regUser = (req, res) => {
  // 1.1.检测表单数据是否合法
  const userinfo=req.body
  if(!userinfo.username||!userinfo.password){
    return res.send({ status: 1, message: '用户名或密码不能为空！'})
  }

  // 1.2.监测用户名是否被占用
  db.query(sql,[userinfo.username],(err,res)=>{
    if(err){
      return res.send({ status: 1, message: err.message })
    }
    if(res.length>0){
      return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
    }
  })

  // 1.3.对用户密码进行加密
  userinfo.password=bcrypt.hashSync(userinfo.password,10)

  // 1.4.插入新用户
  const insert='insert into from users set ?'
  db.query(insert,{username: userinfo.username, password: userinfo.password },(err,res)=>{
    if(err){
      return res.send({status:1,message:err.message})
    }
    // 1.4.1.插入成功，但影响行数不为1
    if(res.affectedRow!==1){
      return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
    }
    return res.send({status:0,message:'注册成功!'})
  })
    // res.send('reguser OK')
  }

// 2.登录的处理函数
exports.login = (req, res) => {
    const userinfo=req.body
    // 2.1.查询用户
    const sql1='select * from users where username=?'
    db.query(sql1,[userinfo.username],function(err,res){
      if(err) return res.error()
      if(res.affectedRow!==1) return res.error()
    })

    // 2.2.判断用户输入密码是否正确
    // 核心：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码)
    const compare=bcrypt.compareSync(userinfo.password,res[0].password)
    if(!compare){
      return res.send('密码错误，登录失败！')
    }

    // 2.3.生成JWT的加密字符串
    // 2.3.1.注意：携带的字符中，需要剔除密码和头像
    const user={...res[0],password:'',user_pic: ''}
    // 2.3.4.生成token字符串
    const Token=jwt.sign(user,config.jwtSecretKey,{
      // token 有效期为 10 个小时 
        expiresIn: '10h',      
    })
    // 2.3.5.将token响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
    })
}