var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');

var app = express();
app.get('/', function (req, res, next) {
  superagent
    .get('http://cnblogs.com/')
    .end(function (err, sres) {
      // 常规错误处理
      if (err) {
        return next(err);
      }

      // sres.text 里面存放着网页的 html 内容，将它传给 cheerio.load 之后就可以得到一个实现了 jQuery 接口的变量，我们
      // 习惯性地将它命名为 `$`，剩下的就是jquery的内容了
      var $ = cheerio.load(sres.text);
      var ans = [];
      $('.titlelnk').each(function (index, item) {
        var $item = $(item);
        // 如果用 $item.html() 会得到 HTML 实体编码
        ans.push($item.text());
      });

      // 将内容呈现到页面上
      res.send(ans);
    })
});

app.listen(3000, function () {
  console.log('app is listening on port 3000');
});
