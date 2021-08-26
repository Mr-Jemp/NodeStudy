const express = require('express')
const Template = require('../model/template')

const router = express.Router()

router.get('/template', async (req, res) => {
  // 使用find方法查找MongoDB template数据库中的数据并返回
  const temps = await Template.find({}).sort({update_at: -1})
  // 将执行结果包装好发给前端
  res.$success(temps)
})

// 增（C）
router.post('/template', async (req, res) => {
  try {
    // 先取到req.body（需要在入口处use body-parser中间件）
    // 再使用create方法创建一条数据并插入到MongoDB template数据库中
    const temps = await Template.create(req.body)
    // 将执行结果包装好发给前端
    res.$success(temps)
  } catch (e) {
    // 如果插入失败就报错
    res.$fail(e)
  }
})

// 查（R）
router.get('/template/:id', async (req, res) => {
  // 先通过req.params.id获取请求的id参数
  // 再通过findById方法查询对应的数据
  const temps = await Template.findById({_id: req.params.id})
  if (temps) {
    res.$success(temps)
  }else {
    // 查询结果不存在应该返回封装好的格式，保持前后端格式统一
    // 204状态码表示我已经帮你查了，但是没有查到内容
    res.$success({}, 204)
  }
})

// 改（U）
router.put('/template/:id', async (req, res) => {
  // 先通过req.params.id获取请求的id参数
  // 然后取到req.body（需要在入口处use body-parser中间件）
  // 再通过findByIdAndUpdate方法修改对应的数据，第三个参数表示如果没有这条数据则创建
  const temps = await Template.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true})
  if (temps) {
    res.$success(temps)
  }else {
    // 查询结果不存在应该返回封装好的格式，保持前后端格式统一
    // 404状态码表示资源没找到，一般是客户端输错地址
    res.$success('更新失败', 404)
  }
})

// 删（D）
router.delete('/template/:id', async (req, res) => {
  // 先通过req.params.id获取请求的id参数
  // 再通过findByIdAndUpdate方法删除对应的数据
  try {
    await Template.findByIdAndDelete({_id: req.params.id})
    res.$success('删除成功')
  }catch (e) {
    res.$fail(e)
  }
})

module.exports = router
