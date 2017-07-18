// 多页面抓取
// async 模块控制并发量

var express = require("express");
var cheerio = require("cheerio");
var superagent = require("superagent");
var async = require("async");


// 需要爬的网址
function getUrls() {
  var urls = [];
  var baseUrl  = "http://acm.hdu.edu.cn/statistic.php?pid=";

  for (var i = 1000; i < 1100; i++) {
    var tmp = baseUrl + i;
    urls.push(tmp);
  }

  return urls;
}

// 页面解析，返回需要的内容
function analyze(page) {
  var $ = cheerio.load(page);
  var postTime = $('.table_text').eq(0).find('td').eq(6).text();
  return postTime;
}

// 抓取网页内容
function fetchUrl(url, callback) {
  superagent.get(url)
    .end(function (err,res) {
      var page = res.text;

      // 页面分析，返回需要的数据
      var postTime =  analyze(page);
      // postTime 加入到了 result 数组中
      callback(null, postTime);
    });
}

// start
var app = express();

app.get('/', function (req, res, next) {
  var urls = getUrls();

  // 并发量控制为 5
  // 对每个元素执行第三个回调
  // 全部执行完后执行第四个回调
  // 参数 callback 与 mapLimit 方法第四个参数有关，callback 会往 result 参数里存放数据
async.mapLimit(urls, 5, function (url, callback) {
    fetchUrl(url, callback);
  }, function (err, result) {
    res.send(result);
  });
});

// listen
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});


