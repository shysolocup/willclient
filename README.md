---

<div align="center" text-align="center">
	<br />
	<img src="https://github.com/nuttmegg/discordpps/blob/main/assets/logo_white.png">
	<br />
	<a href="https://www.npmjs.com/package/discordpps"><img src="https://img.shields.io/npm/v/discordpps?style=flat&color=red&logo=npm&logoColor=white" alt="package version" />
	<a href="https://nodejs.org/en/"><img src="https://img.shields.io/node/v/discord.js?logo=node.js&logoColor=white" alt="package version" />
	<a href="https://discord.js.org/"><img src="https://img.shields.io/badge/discord.js-v14.7.1-blue?style=flat&color=7289da&logo=discord&logoColor=white" alt="discord.js version" /></a>
	<a href="https://github.com/nuttmegg/discordpps/discussions"><img src="https://img.shields.io/github/discussions/nuttmegg/discordpps?logo=wechat&logoColor=white" alt="discussions" />
	<a href="https://github.com/nuttmegg/discordpps/issues"><img src="https://img.shields.io/github/issues/nuttmegg/discordpps" alt="issues" />
	

Discord+PS is a combination of [Discord.JS](https://discord.js.org/) and [Discord.PY](https://github.com/Rapptz/discord.py) made in [Node.JS](https://nodejs.org/en/) to solve most of the annoying parts of Discord.JS and possibly welcome Discord.PY users into Node.JS

<br>

*__THIS IS A VERY EARLY VERSION AND I WILL UPDATE IT OVER TIME__*<br><br>

for a look at some examples check out the [examples folder](https://github.com/nuttmegg/discordpps/tree/main/examples)<br>
for a full look at everything go check out the [wiki pages](https://github.com/nuttmegg/discordpps/wiki)

</div>

<br><br>

---

<br>

## Installation
```console
npm i discordpps
```

<br>

## Setting Up
### **Discord.JS Client**
Discord+PS is built off of Discord.JS so for it to work you need Discord.JS.
```js
const { Client } = require('discord.js');
const client = new Client({
	// your stuff here
});
```
### **Discord+PS Client**
once you have your Discord.JS client you can add in Discord+PS.<br>
*(prefix is optional)*
```js
const { PSClient } = require('discordpps');
const psc = new PSClient({
	client: client,
	prefix: "!" 
});
```
once you have your ps client set up and working you can run it using either of these:
```js
client.login(token); // normal discord.js

psc.run(token); // optional alternative
```
<br>

## Disclaimer
This mod is not associated with the creators of [Discord](https://discord.com), [Discord.JS](https://discord.js.org), or [Discord.PY](https://github.com/Rapptz/discord.py) this was created out of love for Discord bot development because I wanted to make things easier for people. I do not condone harassment of the original developers and or anyone else involved in the creation of them.<br><br>
I am not responsible for anything made with this mod and be sure to follow [Discord's terms of service](https://discord.com/terms) and their [community guildlines](https://discord.com/guidelines) while developing.
