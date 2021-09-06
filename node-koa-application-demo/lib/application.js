// application源码核心功能：
// 1、支持new创建实例：const app = new Koa()
// 2、支持监听server：app.listen(port, () => {})
// 3、支持使用中间件：app.use(middleware)
const http = require('http')
module.exports = class Application {
  middleware() {}
  constructor() {
  }
  // 封装HTTP模块
  listen(port, cb) {
    const server = http.createServer((req,  res) => {
      this.middleware(req, res) // 一旦使用use传入中间件就会在这里进行调用并把参数传回去
    })
    
    server.listen(port, cb)
  }
  use(middleware) {
    this.middleware = middleware // 将use方法传进来的中间件赋值给this.middleware
    return this // 支持链式调用的关键
  }
}
