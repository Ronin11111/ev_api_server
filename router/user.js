// 用户路由模块
const express = require('express');

// 1.创建路由对象
const router=express.Router()

// 4.导入用户路由处理函数模块
const userHandler=require('../router_handler/user')

// 5.1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 5.2. 导入需要的验证规则对象
const { login_schema } = require('../schema/user')

// 2.挂载具体路由
// 2.1.注册新用户
// 2.1.1.注册判断进入全局中间件，判断是否有错误并抛出处理
// 2.2.2.中间件通过后，进入表单校验，判读字段
router.post('/reguser', expressJoi(login_schema),userHandler.regUser)

// 2.2.登录
router.post('/login',expressJoi(login_schema),userHandler.login)

// 3.向外共享路由对象
module.exports=router