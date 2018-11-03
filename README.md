# Geckometrics
Expose Heroku metrics as a dataset in Geckoboard :chart_with_upwards_trend:

## Why?
Our online accounting SAAS app [www.dougs.fr](https://www.dougs.fr) runs on Heroku. While Heroku natively provides interesting monitoring metrics, there is no off the shelf solution to display them in a [Geckoboard](https://www.geckoboard.com/) dashboard, so we made it.

## How?
1. Deploy Geckometrics somewhere (for instance on an Heroku free hobby dyno):

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. Redirect the [log drain](https://devcenter.heroku.com/articles/log-drains) of the app you want to monitor to your geckometrics instance, for example:

```
heroku drains:add https://YOUR_GECKOMETRICS.herokuapp.com/drains/TOKEN -a YOUR_APP
```

3. Set up some custom geckoboard widgets using the `heroku.metrics` dataset.

If anyone is interested, we can provide a bit more guidance on how to set up this (open an issue here or ping us on twitter [@dougscompta](https://twitter.com/dougscompta)).

Our lovely realtime Heroku monitoring:
![Image of our dashboard](https://i.imgur.com/tHpnZHo.png)
