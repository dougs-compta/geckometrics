# Geckometrics
Expose Heroku metrics as a Geckoboard dashboard widget compatible API :chart_with_upwards_trend:

## How?
Deploy Geckometrics some where (for instance on Heroku), redirect the [log drain](https://devcenter.heroku.com/articles/log-drains) of the app you want to monitor to your geckometrics instance.

Set up some custom geckoboard widgets polling your geckometrics instance. You have your average response time, your request throughput and your dynos memory in realtime on your dashboard. Voila !

If anyone is interested, we can provide a bit more guidance on how to set up this (open an issue here or ping us on twitter [@dougscompta](https://twitter.com/dougscompta)).

Our lovely realtime Heroku monitoring:
![Image of our dashboard](http://i.imgur.com/dIrzMWZ.png)
