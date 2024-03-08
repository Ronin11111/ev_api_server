// 开启服务器

// 1.1.导入
const express=require('express');
//  1.2.实例化
const app=new express()

// 2.1.开启cors跨域
const cors=require('cors')
// 2.2.注册
app.use(cors())

// 3.1.配置开启表单中间件
app.use(express.urlencoded({extended:false}))
// 3.2.表单规则验证中间件
const joi = require('@hapi/joi')

// 5.自定义返回错误结果中间件
// 作用：将res返回的错误结果抽离封装
// 做法：注册全局中间件，在中间件中绑定res.err方法
app.use(function(req,res,next){
  // 设置status=1，1则错误，0为成功
  res.error=function(err,status=1){
    res.send({
      status,
      // 判断时错误对象还是字符串
      err:err instanceof Error?err.message:err
    })
  }
  // 切记：中间件必有next（）
  next()
})

// 7.配置解析token的中间件
const config=require('./config')
const expressJWT = require('express-jwt')
// 7.1.解密，并设置那些接口无需携带token
app.use(expressJWT(({ secret: config.jwtSecretKey })).unless(/^\/api\//))

// 4.导入user路由模块
const router=require('./router/user')
app.use('/api', userRouter)  //为路由模板添加api前缀名

// 8.导入userInfo模块
const userInfoRouter=require('./router/userInfo')
app.use('/my',userInfoRouter)

// 9.导入article模块
const articleRouter=require('./router/article')
app.use('/article',articleRouter)

// 6.定义全局错误级别中间件
// 注意：错误级别中间件放在代码最后
// 作用：捕获错误，并将错误返回给前端
app.use(function(err,req,res,next){
  // 6.1.数据验证失败
  if(err instanceof joi.ValidationError){
    return res.error(err)
  }
  // 6.2.捕获身份认证错误（即token错误）
  if(err.name==='UnauthorizedError'){
    return res.error('身份认证错误！')
  }
  // 6.3.未知错误
  return res.error(err)
})

// 1.3.开启服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
  })