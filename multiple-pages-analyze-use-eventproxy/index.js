// eventproxy 控制模块并发

var express = require('express');
var cheerio = require('cheerio');
var install = require('superagent-charset');
var request = require('superagent');
var superagent = install(request);
var eventproxy = require('eventproxy');

// 需要爬的网址
function getUrls() {
  var urls = [];
  var baseUrl = 'http://acm.hdu.edu.cn/statistic.php?pid=';
  for (var i = 1000; i < 1010; i++) {
    var tmp = baseUrl + i;
    urls.push(tmp);
  }
  return urls;
}

// 页面解析，返回需要的内容
function analyze(page) {
  var $ = cheerio.load(page);
  var userId = $('.table_text').eq(0).find('a').text();
  return userId;
}

// 抓取网页内容
function fecthUrl(url, ep) {
  superagent.get(url).charset('gb2312')
    .end(function (err, res) {
      // 抛出 `curl` 事件
      ep.emit('curl', res.text);
    })
}

// start
var app = express();
app.get('/', function (req, res, next) {
  var urls = getUrls();
  // 得到一个 eventproxy 实例
  var ep = new eventproxy();
  var result = [];

  // eq 重复监听 `curl` 事件 urls.length 次后，执行回调函数
  ep.after('curl', urls.length, function (pages) {
    // pages是个数组，包含了10次 ep.emit('curl', page)中的那 10 个 page
    pages.map(function (page) {
      result.push(analyze(page));
    });
    // 将内容呈现到页面上
    res.send(result);
  });

  urls.forEach(function (item) {
    fecthUrl(item, ep);
  });
});

// listen
app.listen(3000, function () {
  console.log('app is listening on port 3000');
});