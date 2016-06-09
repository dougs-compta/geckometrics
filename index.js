'use strict';

const express = require('express');

const app = express();

function bodyParser(req, res, next) {
    if (!req.is('application/logplex-1')) return res.send(500);

    req.logLine = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        req.logLine += chunk;
    });
    req.on('end', next);
}

app.use(bodyParser);

app.post('/drain/fet7jr4ho98tf3', function (req, res) {
    res.send(200);

    console.log(req.logLine);

    const line = req.logLine;
    if (line.includes('heroku router') && line.includes('service=') && line.includes('status=')) {
        // 2016-06-09T07:32:15.360608+00:00 app[web.1]: 239 <158>1 2016-06-09T07:32:14.500838+00:00 host heroku router - at=info method=POST path="/login" host=app.dougs.fr request_id=7f4e29d2-e2f1-42d0-b47b-9150b2b1183a fwd="46.246.28.90" dyno=web.2 connect=1ms service=129ms status=200 bytes=5016
        let service = 0;
        let match = line.match(/service=(\d+)/);
        if (match) service = match[1];

        let status = 0;
        match = line.match(/status=(\d+)/);
        if (match) status = match[1];

        const metric = { type: 'router', service, status } 
        console.log(metric);
    } else if (line.includes('heroku web') && line.includes('source=') && line.includes('memory_total=')) {
        // 2016-06-09T07:32:16.527056+00:00 app[web.1]: 339 <45>1 2016-06-09T07:32:16.163266+00:00 host heroku web.2 - source=web.2 dyno=heroku.32934028.9646d93e-977a-421a-a5ef-02adc583e5b5 sample#memory_total=247.22MB sample#memory_rss=204.91MB sample#memory_cache=41.48MB sample#memory_swap=0.82MB sample#memory_pgpgin=2377742pages sample#memory_pgpgout=2339192pages sample#memory_quota=1024.00MB
        let source = 0;
        let match = line.match(/source=(\w+.\d+)/);
        if (match) source = match[1];

        let memory = 0;
        match = line.match(/memory_total=(\d+)/);
        if (match) memory = match[1];

        let memoryQuota = 0;
        match = line.match(/memory_quota=(\d+)/);
        if (match) memoryQuota = match[1];

        const metric = { type: 'web', source, memory, memoryQuota };
        console.log(metric);
    } else if (line.includes('heroku-postgres') && line.includes('source=') && line.includes('load-avg-15m=')) {
        // 2016-06-09T07:53:07.315320+00:00 app[web.1]: 531 <134>1 2016-06-09T07:52:53+00:00 host app heroku-postgres - source=DATABASE sample#current_transaction=48441 sample#db_size=247529644.0bytes sample#tables=28 sample#active-connections=3 sample#waiting-connections=0 sample#index-cache-hit-rate=0.99991 sample#table-cache-hit-rate=0.99994 sample#load-avg-1m=0.055 sample#load-avg-5m=0.035 sample#load-avg-15m=0.025 sample#read-iops=0 sample#write-iops=0.29701 sample#memory-total=3786332.0kB sample#memory-free=531500kB sample#memory-cached=2685020.0kB sample#memory-postgres=52128kB
        let source = 0;
        let match = line.match(/source=(\w+.\d+)/);
        if (match) source = match[1];

        let load = 0;
        match = line.match(/load-avg-15m=(\d+)/);
        if (match) load = match[1];

        const metric = { type: 'postgres', source, load };
        console.log(metric);
    }
});

var port = process.env.PORT || 3000
app.listen(port, function () {
      console.log('Example app listening on port ' + port);
});
