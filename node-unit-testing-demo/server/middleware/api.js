module.exports = (req, res, next) => {
  res.$success = function (data, code = 200) {
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
    res.json(_data) // 将数据返回
  }
  res.$fail = function (err, code = 500) {
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
    res.json(_data) // 将数据返回
  }
  
  next()
}
