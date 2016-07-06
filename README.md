# ZingBot
ZingBot-Your Stock Assistant
Zing Bot is a stock assistant bot on Slack ,deployed on Heroku and uses Mashapes Mutual Fund NAV api.

Zing bot lets you search for Stocks ,and returns current information to you instantly.This bot is based on Howdy botkit and is coded in node.js.


##Tutorial

1.Install npm and node on ur system
You will easily find tutorials to install node and npm online
For Linux**sudo apt-get install nodejs node-dev**

**sudo apt-get install npm**

2.Clone this repository

3.Change your directory to this repository and initialise node**npm init**

Then it will ask you to fill a json,keep on pressing enter and save it

4.You will need following node dependencies installed:
**botkit**
**express**
**unirest**
5.To install dependencies type:**npm install --save <pkg-name>**

6.Now go to slack and in integrations ,create a bot.
Gets it s API key/Token and use it in the app.js ,where slack token is needed

7.Now go to https://market.mashape.com/nviror/mutual-funds-nav-india ,create a app here and get api key for mutual funds nav
Use this key in app.js below the comment mentioned in the code

8.Your app.js is ready!!

#Deploy!
===========================================================
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Go to Heroku and create an app.You can deploy your app via dropbox,github or heroku on git.
We will use Heroku on git
Follow the instructions mentioned to use heroku on git,and initialise the heroku git in your directory
**heroku buildpacks:set heroku/nodejs**
Commit the changes and push to git.
Voila!!There you go your App is running on heroku and ur bot is live on slack!

