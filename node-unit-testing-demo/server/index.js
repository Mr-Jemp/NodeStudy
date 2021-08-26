const express = require('express')
const mongoose = require('mongoose')
const templateRouter = require('./routes/template')
const api = require('./middleware/api')
const bodyParser = require('body-parser')

const app = express()

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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(api)

app.use('/xhr/v1', templateRouter)

/*app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})*/

app.listen(8080, () => {
  console.log('server is running on http://localhost:8080')
})

module.exports = app
