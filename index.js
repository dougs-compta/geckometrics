'use strict';

const express = require('express');
const rp = require('request-promise');

const auth = {user: process.env.GB_API_KEY + ':', pass: ''};

async function main() {
    const app = express();

    await rp.put('https://api.geckoboard.com/datasets/heroku.metrics', {
        auth,
        json: true,
        body: {
            id: 'heroku.metrics',
            fields: {
                type: {
                    type: 'string',
                    name: 'Type'
                },
                date: {
                    type: 'datetime',
                    name: 'Date',
                },
                source: {
                    type: 'string',
                    name: 'Source'
                },
                status: {
                    type: 'number',
                    name: 'Status'
                },
                service: {
                    type: 'number',
                    name: 'Service'
                },
                memory: {
                    type: 'number',
                    name: 'Memory'
                },
                memoryquota: {
                    type: 'number',
                    name: 'Memory Quota'
                },
                load: {
                    type: 'number',
                    name: 'Load'
                }
            }
        }
    });

    function bodyParser(req, res, next) {
        if (!req.is('application/logplex-1')) return next();

        req.logLine = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            req.logLine += chunk;
        });
        req.on('end', next);
    }

    app.use(bodyParser);

    const stack = [];
    let lastPutAt = new Date();
    app.post('/drain/' + process.env.TOKEN, function (req, res) {
        res.sendStatus(200);

        if (!req.logLine) return console.log('Error: No log line parsed.');

        const datePattern = /(\d{4}-\d{2}-\d{2}T\d{2}[\d:.+]*) host/;
        const line = req.logLine;
        let metric = null;
        if (line.includes('heroku router') && line.includes('service=') && line.includes('status=')) {
            // 2016-06-09T07:32:15.360608+00:00 app[web.1]: 239 <158>1 2016-06-09T07:32:14.500838+00:00 host heroku router - at=info method=POST path="/login" host=app.dougs.fr request_id=7f4e29d2-e2f1-42d0-b47b-9150b2b1183a fwd="46.246.28.90" dyno=web.2 connect=1ms service=129ms status=200 bytes=5016

            /* Skip websocket requests. */
            if (line.search('path="/websockets') !== -1 || line.seach('path="/socket.io') !== -1)  return;

            let date = new Date();
            let match = line.match(datePattern);
            if (match) date = new Date(match[1]);

            let service = 0;
            match = line.match(/service=(\d+)/);
            if (match) service = match[1];

            let status = 0;
            match = line.match(/status=(\d+)/);
            if (match) status = match[1];

            metric = {type: 'router', date, service, status}
        } else if (line.includes('heroku web') && line.includes('source=') && line.includes('memory_total=')) {
            // 2016-06-09T07:32:16.527056+00:00 app[web.1]: 339 <45>1 2016-06-09T07:32:16.163266+00:00 host heroku web.2 - source=web.2 dyno=heroku.32934028.9646d93e-977a-421a-a5ef-02adc583e5b5 sample#memory_total=247.22MB sample#memory_rss=204.91MB sample#memory_cache=41.48MB sample#memory_swap=0.82MB sample#memory_pgpgin=2377742pages sample#memory_pgpgout=2339192pages sample#memory_quota=1024.00MB
            let date = new Date();
            let match = line.match(datePattern);
            if (match) date = new Date(match[1]);

            let source = '';
            match = line.match(/source=(\w+.\d+)/);
            if (match) source = match[1];

            let memory = 0;
            match = line.match(/memory_total=(\d+)/);
            if (match) memory = match[1];

            let memoryquota = 0;
            match = line.match(/memory_quota=(\d+)/);
            if (match) memoryquota = match[1];

            metric = {type: 'web', date, source, memory, memoryquota};
        } else if (line.includes('heroku-postgres') && line.includes('source=') && line.includes('load-avg-15m=')) {
            // 2016-06-09T07:53:07.315320+00:00 app[web.1]: 531 <134>1 2016-06-09T07:52:53+00:00 host app heroku-postgres - source=DATABASE sample#current_transaction=48441 sample#db_size=247529644.0bytes sample#tables=28 sample#active-connections=3 sample#waiting-connections=0 sample#index-cache-hit-rate=0.99991 sample#table-cache-hit-rate=0.99994 sample#load-avg-1m=0.055 sample#load-avg-5m=0.035 sample#load-avg-15m=0.025 sample#read-iops=0 sample#write-iops=0.29701 sample#memory-total=3786332.0kB sample#memory-free=531500kB sample#memory-cached=2685020.0kB sample#memory-postgres=52128kB
            let date = new Date();
            let match = line.match(datePattern);
            if (match) date = new Date(match[1]);

            let source = '';
            match = line.match(/source=(\w+.\d+)/);
            if (match) source = match[1];

            let load = 0;
            match = line.match(/load-avg-15m=(\d+)/);
            if (match) load = match[1];


            metric = {type: 'postgres', date, source, load};
        }

        if (metric) {
            stack.push({
                type: metric.type || null,
                date: metric.date || new Date(),
                source: metric.source || '',
                status: Number(metric.status || 0),
                service: Number(metric.service || 0),
                memory: Number(metric.memory || 0),
                memoryquota: Number(metric.memoryquota || 0),
                load: Number(metric.load || 0)
            });

            if ((new Date() - lastPutAt) > 1000 && stack.length > 0) {
                console.log(`Pushing ${stack.length} items to geckoboard...`);
                rp.post('https://api.geckoboard.com/datasets/heroku.metrics/data', {
                    auth,
                    json: true,
                    body: {data: stack}
                }).catch(err => err && console.log(err.error));
                stack.length = 0;
                lastPutAt = new Date();
            }
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('listening on port ' + port);
    });
}

main().catch(err => {
    console.log(err);
    process.exit(1);
});
