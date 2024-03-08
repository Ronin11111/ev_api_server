// 用户信息路由模块
const express=require('express')
const router=express.Router()
// 导入用户信息处理函数
const userInfoHandler=require('../router_handler/userInfo')
const expressJoi = require('@escook/express-joi')
// 导入规则校验
const login_schema=require('../schema/user')

// 1.获取用户的基本信息
router.get('/userinfo',userInfoHandler.getUserInfo)

// 2.更新用户信息
// 注意：可使用
router.post('/userinfo',expressJoi(login_schema),userInfoHandler.updateInfo)

// 3.重置密码
router.post('/resetPsd',expressJoi(login_schema),userInfoHandler.resetPsd)

// 4.更新用户头像
router.post('/userinfo/avatar',expressJoi(login_schema),userInfoHandler.updateAvatar)

module.exports=router