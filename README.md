---

<div align="center" text-align="center">
	<br />
	<img src="https://github.com/paigeroid/willclient/blob/main/assets/willclient-logo.png">
	<br />
	<a href="https://www.npmjs.com/package/willclient"><img src="https://img.shields.io/npm/v/willclient?style=flat&color=red&logo=npm&logoColor=white" alt="version" />
	<a href="https://www.npmjs.com/package/willclient"><img src="https://img.shields.io/npm/dt/willclient?style=flat&color=green&logo=docusign&logoColor=white" alt="downloads" />
	<a href="https://discord.js.org/"><img src="https://img.shields.io/badge/discord.js-v14.13.0-blue?style=flat&color=7289da&logo=discord&logoColor=white" alt="discord.js version" /></a>
	<a href="https://github.com/paigeroid/willclient/discussions"><img src="https://img.shields.io/github/discussions/paigeroid/willclient?logo=google%20chat&logoColor=white" alt="discussions" />
	<a href="https://github.com/paigeroid/willclient/issues"><img src="https://img.shields.io/github/issues/paigeroid/willclient" alt="issues" />
 	<a href="https://npmjs.com/package/stews"><img src="https://custom-icon-badges.demolab.com/badge/Stews-v1.7.1-orange.svg?logo=stew&logoColor=white" alt="stews"></a>
	

WillClient (WC) is a custom Discord API mod that combines elements from [Discord.JS](https://discord.js.org/) and [Discord.PY](https://github.com/Rapptz/discord.py) made in [Node.JS](https://nodejs.org/en/) to solve most of the annoying parts of Discord.JS and possibly welcome users into Node.JS

<br>

*__THIS IS A VERY EARLY VERSION AND I WILL UPDATE IT OVER TIME__*<br><br>

for a look at some examples check out the [examples folder](https://github.com/paigeroid/willclient/tree/main/examples)<br>
for a full look at everything go check out the [wiki pages](https://github.com/paigeroid/willclient/wiki)

</div>

<br><br>

---

<br>
		
## Usage
WillClient simplifies prefix commands and is heavily inspried by the design and functionality of Discord.PY while still being made with Discord.JS
```js
// willclient
wc.command( "ping", async (ctx) => {
	await ctx.reply("Pong!");		
});
```
```py
# discord.py
@bot.command()
async def ping(ctx):
	await ctx.reply("Pong!")
```
It also has aliases for commands
```js
// works with avatar or av
wc.command( {name: "avatar", aliases: ["av"]}, (ctx) => {
	ctx.reply(wc.author.avatar());	
});
```
It has built in arguments or parameters whatever you prefer to call them that you can use
```js
// tagify <@id> or id
wc.command( "tagify", (ctx, cmd) => {
	let user = await wc.fetchUser(cmd.args[0]);
	
	ctx.reply(user.tag);
});
```
And built in cooldowns
```js
wc.command( {name: "ping", cooldown: "30s"}, (ctx, cmd) => {
	if (cmd.onCooldown) return wc.reply("Command is on cooldown!", {deleteAfter: "3s"});
	
	ctx.reply("Pong!");
});
```
		
<br>

## Installation
```console
npm i willclient
```
```console
npm i paigeroid/willclient
```

<br>

## Setting Up
### **Discord.JS Client**
WC is built off of Discord.JS so for it to work you need Discord.JS.
```js
const { Client } = require('discord.js');
const client = new Client({
	// your stuff here
});
```
### **WC Client**
once you have your Discord.JS client you can add in WC
```js
const { WillClient } = require('willclient');
const wc = new WillClient({
	client: client,
	prefix: "!" 
});
```
once you have your client set up and working you can run it using either of these:
```js
client.login(token); // normal discord.js

wc.run(token); // optional alternative
```
<br>

## Disclaimer
This mod is not associated with the creators of [Discord](https://discord.com), [Discord.JS](https://discord.js.org), or [Discord.PY](https://github.com/Rapptz/discord.py) this was created out of love for Discord bot development because I wanted to make things easier for people. I do not condone harassment of the original developers and or anyone else involved in the creation of them.<br><br>
I am not responsible for anything made with this mod and be sure to follow [Discord's terms of service](https://discord.com/terms) and their [community guildlines](https://discord.com/guidelines) while developing.
