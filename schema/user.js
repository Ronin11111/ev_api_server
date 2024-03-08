// 用户信息验证模块

// @hapi/joi 包，为表单中携带的每个数据项，定义验证规则：
const joi = require('@hapi/joi')

/**校验规则方法：
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
//  1.定义username的规则
const username = joi.string().alphanum().min(2).max(12).required()

// 2.定义password的规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const id = joi.number().integer().min(1).required()
const nickname = joi.string().min(2).max(10).required()
const email = joi.string().email().required()
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar=joi.string().dataUri().required()

// 3.验证username，password规则
exports.login_schema = {
    //!!! 对 req.body 中的数据进行验证
    body: {
        username,
        oldPwd:password,
        id,
        nickname,
        email,
        avatar,
        // 新密码
        // ①joi.ref(psd)-即与psd密码一致
        // ②concat()-即将not（）[不与原密码一致]和原密码的规则合并
        newPwd:joi.not(joi.ref(password)).concat(password)
    }
}