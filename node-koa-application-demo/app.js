const Koa = require('./lib/application')

const app = new Koa()

app.use((req, res) => {
  res.writeHead(200)
  res.end('Hello My Koa')
})

app.listen(3000, () => {
  console.log('Server is running on http://127.0.0.1:3000')
})
