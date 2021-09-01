// 导入koa，和koa 1.x不同，在koa2中，导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')
const mongoose = require('mongoose')
const BodyParser = require('koa-bodyparser');

const templateRouter = require('./routes/template')
const api = require('./middleware/api')
const bodyparser = new BodyParser();

// 创建一个Koa对象表示web app本身
const app = new Koa()

// 通过connect方法连接MongoDB
// 地址：通过mongo命令查看connecting to:后面的地址+端口（还需要在地址后面拼接要连接的数据库）
//      show dbs命令查看MongoDB中已存在的数据库，没有则要创建
//      使用数据库之前需要指定数据库，使用use <数据库名称>命令，如 use template
//      可通过show collections命令查看已经指定的数据库
mongoose.connect('mongodb://127.0.0.1:27017/template')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('mongodb is connected')
});

// middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上
app.use(bodyparser);

app.use(api)

app.use(templateRouter.routes());

// 在端口8080监听
app.listen(8080, () => {
  console.log('server is running on http://localhost:8080')
})
