# Geckometrics
Expose Heroku metrics as a Geckoboard dashboard widget compatible API :chart_with_upwards_trend:

## Why?
Our online accounting SAAS app [www.dougs.fr](https://www.dougs.fr) runs on Heroku. While Heroku natively provides interesting monitoring metrics, there is no off the shelf solution to display them in a [Geckoboard](https://www.geckoboard.com/) dashboard, so we made it.

## How?
Deploy Geckometrics somewhere (for instance on an Heroku free hobby dyno), redirect the [log drain](https://devcenter.heroku.com/articles/log-drains) of the app you want to monitor to your geckometrics instance.

Set up some custom geckoboard widgets polling your geckometrics instance. You have your average response time, your request throughput and your dynos memory in realtime on your dashboard. Voila !

If anyone is interested, we can provide a bit more guidance on how to set up this (open an issue here or ping us on twitter [@dougscompta](https://twitter.com/dougscompta)).

Our lovely realtime Heroku monitoring:
![Image of our dashboard](http://i.imgur.com/dIrzMWZ.png)

## Nitty gritty
The database schema used by geckometrics, in PostgreSQL dialect:
```sql
CREATE TABLE metrics
(
  id          INTEGER DEFAULT nextval('metrics_id_seq' :: REGCLASS) NOT NULL
    CONSTRAINT metrics_pkey
    PRIMARY KEY,
  type        TEXT                                                  NOT NULL,
  date        TIMESTAMP                                             NOT NULL,
  source      TEXT,
  status      INTEGER,
  service     DOUBLE PRECISION,
  memory      DOUBLE PRECISION,
  memoryquota DOUBLE PRECISION,
  load        DOUBLE PRECISION
);
CREATE INDEX metrics_type_index
  ON metrics (type);
CREATE INDEX metrics_date_index
  ON metrics (date);
```
