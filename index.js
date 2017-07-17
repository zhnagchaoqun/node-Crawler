var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('这是首页');
});
app.get('/singlePageCrawler',function (req, res) {
  res.send('单页抓取');
});
app.listen(3000);

