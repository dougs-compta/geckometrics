var express = require('express');
var bodyParser = require('bodyParser');

var app = express();
app.use(bodyParser.json());

app.post('/drain/fet7jr4ho98tf3', function (req, res) {
    console.log(req);
    return res.send(200);
});

var port = process.env.PORT || 3000
app.listen(port, function () {
      console.log('Example app listening on port ' + port);
});
