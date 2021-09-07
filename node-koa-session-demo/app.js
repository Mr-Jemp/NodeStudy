const Koa = require('koa')
const session = require('koa-session')

const app = new Koa()

const sessionConfig = {
  key: 'koa:session',  // 这个key表示cookie的前缀，可在浏览器NetWork面板查看
  maxAge: 86400000,    // 过期时间，默认是一天
  overwrite: true,     // 是否会被重写，默认是true
  httpOnly: true,      // 表示这个cookie只能被服务端修改，默认值true
  signed: true,        // 生成的sessionId是否要加密，默认值true
  rolling: true,       // 强制在每个响应上设置会话标识符 cookie。到期重置为原来的maxAge，重置到期倒计时。默认值false
  renew: true,        // 当会话即将过期时更新会话，因此我们可以始终保持用户登录。默认为 false
}

// 给app添加一个key，这个key表示服务的唯一ID
app.keys = ['koa node js']

// 使用session中间件
// 传入config配置和app实例
app.use(session(sessionConfig, app))

app.use(ctx => {
  // 获取请求访问的次数
  let num = ctx.session.views || 0
  ctx.session.views = ++num
  // 返回更新后的访问次数
  ctx.body = num + ' views'
})

app.listen(3000, () => {
  console.log('Server is running on http://127.0.0.1:3000')
})