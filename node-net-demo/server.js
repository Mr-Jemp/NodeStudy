const net = require('net')

const server = net.createServer(socket => {
  console.log('server is connected')

  socket.write('我是服务器，我给你发送了一条消息')
  socket.on('data', (data) => {
    console.log('server get client data: ', data.toString())
  })

  socket.on('close', () => {
    console.log('client is close')
  })
})

server.listen(3000, '127.0.0.1', () => {
  console.log('server is running')
})