var express = require('express');
var app = express();
app.get('/', function (res, req) {
  req.send('这是首页');
});
app.listen(3000);

