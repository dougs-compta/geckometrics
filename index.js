var express = require('express');
// var bodyParser = require('body-parser');

var app = express();
// app.use(bodyParser.json());

function bodyParser(req, res, next) {
    if (!req.is('application/logplex-1')) {
        res.send(500, 'invalid');
        return;
    }

    req.logplexLogs = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        req.logplexLogs += chunk;
    });
    req.on('end', next);
}

app.use(bodyParser);

app.post('/drain/fet7jr4ho98tf3', function (req, res) {
    console.log(req.logplexLogs);
    return res.send(200);
});

var port = process.env.PORT || 3000
app.listen(port, function () {
      console.log('Example app listening on port ' + port);
});
