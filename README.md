---

<div align="center" text-align="center">
	<br />
	<img src="https://github.com/nuttmegg/discord.ps/blob/main/assets/logo%20white%20smaller.png">

Discord.PS is a combination of [Discord.JS](https://discord.js.org/) and [Discord.PY](https://github.com/Rapptz/discord.py) made in [Node.JS](https://nodejs.org/en/) to solve most of the annoying parts of Discord.JS and possibly welcome Discord.PY users into Node.JS.

<br>

*__THIS IS A VERY EARLY VERSION AND I WILL UPDATE IT OVER TIME__*<br><br>

for a look at some examples check out the [examples folder](https://github.com/TheFlameZEternal/Discord.PS/tree/main/examples)<br>
for a full look at everything go check out the [wiki pages](https://github.com/nuttmegg/discord.ps/wiki)

</div>

<br>

---

## Installation
```console
npm i nuttmegg/discord.ps
```
*⬇⬇ This one is not currently available ⬇⬇*
```console
npm i discord.ps
```

<br>

## Setting Up
### **Discord.JS Client**
Discord.PS is built off of Discord.JS so for it to work you need Discord.JS.
```js
const { Client } = require('discord.js');
const client = new Client({
	// your stuff here
});
```
### **Discord.PS Client**
once you have your discord.js client you can add in Discord.PS.<br>
*(prefix is optional)*
```js
const { PSClient } = require('discord.ps');
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
This mod is not associated with the creators of Discord, Discord.JS, or Discord.PY this was created out of love for Discord bot development because I wanted to make things easier for people. I do not condone harassment of the original developers and or anyone else involved in the creation of them.<br><br>
I am not responsible for anything made with this mod and be sure to follow [Discord's terms of service](https://discord.com/terms) and their [community guildlines](https://discord.com/guidelines) while developing.
