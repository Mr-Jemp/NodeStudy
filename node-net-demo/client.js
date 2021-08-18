const net = require('net')

const client = net.createConnection(3000, '127.0.0.1')

client.on('connect', () => {
  console.log('client is connected');
})

client.on('data', (data) => {
  console.log('client get server data: ', data.toString())
  client.end('我是客户端，我收到你的消息了，现在我要关闭连接')
})

client.on('close', () => {
  console.log('客户端已经关闭')
})