# Discord.PS
Discord.PS is a combination of Discord.JS and Discord.PY APIs made in Node JS to solve most of the annoying parts of Discord.JS and possibly welcome Discord.PY users into Node JS.<br><br>
*__THIS IS A VERY EARLY VERSION AND I WILL UPDATE IT OVER TIME__*<br><br>
for a look at some examples check out the examples folder [here](https://github.com/TheFlameZEternal/Discord.PS/tree/main/examples)<br>
for a full look go check out the docs [here](https://github.com/TheFlameZEternal/Discord.PS/blob/main/docs.md)
## Installation
```
npm i nuttmegg/Discord.PS

npm i discord.ps (this is not currently available)
```
## Setting Up
#### **== Discord.JS Client ==**
Discord.PS is built off of Discord.JS so for it to work you need Discord.JS.
```js
const { Client } = require('discord.js');
const discordClient = new Client({
	// your stuff here
});
```
#### **== Discord.PS Client ==**
once you have your discord.js client you can add in Discord.PS.<br>
*(prefix is optional)*
```js
const { PSClient } = require('discord.ps');
const client = new PSClient({
	client: discordClient,
	prefix: "!" 
});
```
once you have your ps client set up and working you can run it using this:
```js
client.login(token);
```
