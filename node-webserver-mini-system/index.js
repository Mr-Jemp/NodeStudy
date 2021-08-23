/**
 * 一个web server需要具备的基本能力：
 *
 * 1、路由管理能力，根据不同URL的请求返回对应的网络资源
 * 2、静态文件托管，对网络请求的静态资源进行响应
 * 3、响应HTTP请求的能力（GET/POST/PUT/...）
 * 4、文件数据存储，将请求数据存到文件或数据库中
 */

const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')
const qs = require('querystring')

function notFound(req, res) {
  let pathName = path.resolve(__dirname, '404.html');
  fs.readFile(pathName, (err, data) => {
    if (err) {
      res.write(404, 'not found')
    }else {
      res.writeHead(404, {"Content-Type": "text/html;charset='utf-8'"})
      res.write(data)
      res.end()
    }
  })
}

// 写入文件/存储数据库能力
function writeDb(chunk) {
  fs.appendFile(path.resolve(__dirname, 'db'), chunk, (err) => {
    if (err) throw err
    
    console.log('db insert', chunk && chunk.toString())
  })
}

// 响应http请求能力
function handleMethods(method, req, res) {
  const methods = {
    GET() {
      // GET请求先从url上解析query，再将数据组装好返回给客户端
      const query = qs.parse(url.parse(req.url).query) // &a=1&b=2
      const resData = {
        code: 200,
        msg: 'success',
        data: query
      }
      res.end(JSON.stringify(resData))
    },
    POST() {
      // POST请求先解析请求类型，再将数据返回给客户端
      const contentType = req.headers['content-type'];
      if (contentType === 'application/json') {
        // 如果是就取客户端传过来的数据——Buffer
        let postData = ''
        req.on('data', chunk => {
          // 因为是流式数据，所以不是一次性传完的
          // 要将每一个chunk都进行拼接
          postData += chunk
          // POST请求时写入db
          writeDb(chunk)
        })
        
        // 当客户端数据传完时再进行响应
        req.on('end', () => {
          res.end(postData)
        })
      }
    }
  }
  
  return methods[method]()
}

http.createServer((req, res) => {
  // 获取pathname，此时访问localhost:3000是 /
  // （解析路由）
  let pathName = url.parse(req.url).pathname
  
  // 解析index.html路径
  if (pathName === '/') {
    pathName = path.resolve(__dirname, 'index.html')
  }
  
  // 如果是请求/api
  if (pathName.startsWith('/api')) {
    // 获取请求方式
    const method = req.method
    // 处理不同的请求
    handleMethods(method, req, res)
  }
  
  // 获取pathname扩展名
  let extname = path.extname(pathName)
  
  // 如果访问的是html文件则返回对应的文件内容
  // （静态资源托管）
  if (extname === '.html') {
    fs.readFile(pathName, (err, data) => {
      if (err) {
        notFound(req, res)
      }else {
        // 书写响应头
        res.writeHead(200, {'Content-Type': "text/html;charset='utf-8'"})
        // 返回文件内容
        res.write(data)
        // 结束本次请求
        res.end()
      }
    })
  }
  
}).listen(3000)



