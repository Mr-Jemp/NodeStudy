// 注意require('koa-router')返回的是函数
const router = require("koa-router")()

const Template = require('../model/template')

router.prefix('/xhr/v1')

// 对于任何请求，app将调用该异步函数处理请求
// 每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。那为什么需要调用await next()呢？
// 原因是koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数，此处我们把每个async函数称为中间件。
router.get('/demo', async (ctx, next) => {
  var name = 'node koa';
  ctx.response.body = `<h1>Hello, ${name}!</h1>`;
})

// 命令：http GET :8080/xhr/v1/template
router.get('/template', async (ctx, next) => {
  // 使用find方法查找MongoDB template数据库中的数据并返回
  const temps = await Template.find({}).sort({update_at: -1})
  // 将执行结果包装好发给前端
  ctx.response.$success(temps)
})

// 增（C）
// 命令：http POST :8080/xhr/v1/template name="张三" template="<h2>hello koa</h2>" data="{name: 'koa'}"
router.post('/template', async (ctx, next) => {
  try {
    // 先取到req.body（需要在入口处use body-parser中间件）
    // 再使用create方法创建一条数据并插入到MongoDB template数据库中
    const temps = await Template.create(ctx.request.body)
    // 将执行结果包装好发给前端
    ctx.response.$success(temps)
  } catch (e) {
    // 如果插入失败就报错
    ctx.response.$fail(e)
  }
})

// 查（R）
// 命令：http GET :8080/xhr/v1/template/6126f85795cdeca7b83b5e19
router.get('/template/:id', async (ctx, next) => {
  // 先通过req.params.id获取请求的id参数
  // 再通过findById方法查询对应的数据
  const temps = await Template.findById({_id: ctx.params.id})
  if (temps) {
    ctx.response.$success(temps)
  }else {
    // 查询结果不存在应该返回封装好的格式，保持前后端格式统一
    // 204状态码表示我已经帮你查了，但是没有查到内容
    ctx.response.$success({}, 204)
  }
})

// 改（U）
// 命令：http PUT :8080/xhr/v1/template/6126f85795cdeca7b83b5e19
router.put('/template/:id', async (ctx, next) => {
  // 先通过req.params.id获取请求的id参数
  // 然后取到req.body（需要在入口处use body-parser中间件）
  // 再通过findByIdAndUpdate方法修改对应的数据，第三个参数表示如果没有这条数据则创建
  const temps = await Template.findByIdAndUpdate({_id: ctx.params.id}, ctx.request.body, {new: true})
  if (temps) {
    ctx.response.$success(temps)
  }else {
    // 查询结果不存在应该返回封装好的格式，保持前后端格式统一
    // 404状态码表示资源没找到，一般是客户端输错地址
    ctx.response.$success('更新失败', 404)
  }
})

// 删（D）
// 命令：http DELETE :8080/xhr/v1/template/6126f85795cdeca7b83b5e19
router.delete('/template/:id', async (ctx, next) => {
  // 先通过req.params.id获取请求的id参数
  // 再通过findByIdAndUpdate方法删除对应的数据
  try {
    await Template.findByIdAndDelete({_id: ctx.params.id})
    ctx.response.$success('删除成功')
  }catch (e) {
    ctx.response.$fail(e)
  }
})

module.exports = router
