// 单侧步骤：
// 第一步，安装依赖：yarn add -D mocha power-assert nyc supertest
//        选择mocha作为测试框架
//        选择power-assert作为断言库，配合mocha做单元测试，与chai类似
//        选择nyc做覆盖测试
//        选择supertest作为客户端代理，向服务发起request请求
// 第二步，修改package.json的scripts脚本test命令
//        "test": "mocha 'test/**/*.test.js' --exit"
//        使用mocha执行test目录下的所有文件，后缀为.test.js，--exit表示执行完就退出，否则会一直占用服务
// 第三步，具体单侧代码如下
// 第四步，使用nyc做覆盖测试，在package.json的scripts脚本添加cov命令
//        "cov": "nyc mocha 'test/**/*.test.js' --exit"
// 覆盖测试结果如下：
/*
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   85.48 |       50 |      90 |   85.48 |
server             |     100 |      100 |     100 |     100 |
index.js           |     100 |      100 |     100 |     100 |
server/middleware  |   64.29 |       50 |   66.67 |   64.29 |
api.js             |   64.29 |       50 |   66.67 |   64.29 | 18-28
server/model       |     100 |      100 |     100 |     100 |
template.js        |     100 |      100 |     100 |     100 |
server/routes      |   85.19 |       50 |     100 |   85.19 |
template.js        |   85.19 |       50 |     100 |   85.19 | 23,37,52,64
-------------------|---------|----------|---------|---------|-------------------
*/

/**
 * mocha文档：https://mochajs.cn/
 * supertest文档：https://github.com/visionmedia/supertest
 * power-assert文档：https://github.com/power-assert-js/power-assert
 * nyc文档：https://github.com/istanbuljs/nyc#readme
 */


// 写测试用例大概的意思就是描述一个场景，描述完之后断言它应该怎样，如果没有按断言的结果就给它报错，否则测试通过
// 具体步骤如下：

// 引入app服务
const app = require('../server/index')
// 引入代理，向app服务发起请求
const request = require('supertest')(app)

// 具体命令执行
describe('# test index.js', function () {
  it('should GET /api 404', function (done) {
    request
      .get('/api')
      .expect(404, done)
  });
})
