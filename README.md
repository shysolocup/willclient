# Discord.PS
Discord.PS is a combination of Discord.JS and Discord.PY APIs made in Node JS made to solve most of the annoying parts of Discord.JS and possibly welcome Discord.PY users into Node JS.<br><br>
for a a full look go check out the docs [here](https://github.com/TheFlameZEternal/Discord.PS/blob/main/docs.md)
## Installation
```npm
npm i discord.ps
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
