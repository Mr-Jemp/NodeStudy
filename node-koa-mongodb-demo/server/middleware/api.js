module.exports = async (ctx, next) => {
  ctx.response.$success = function (data, code = 200) {
    // 参数适配
    let _data = {
      code,
      msg: 'success'
    }
    if (typeof data === 'object') {
      _data.data = data
    }else {
      // 报错则将报错数据信息给msg
      _data.msg = data
    }
    ctx.body = _data // 将数据返回给前端
    return ctx.body
  }
  ctx.response.$fail = function (err, code = 500) {
    // 参数适配
    let _data = {
      code,
      msg: 'error'
    }
    if (typeof data === 'object') {
      _data.data = JSON.stringify(err)
    }else {
      // 报错则将报错数据信息给msg
      _data.msg = err
    }
    ctx.body = _data // 将数据返回给前端
    return ctx.body
  }
 
  await next()
}
