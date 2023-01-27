# Discord.PS Documentation
## Setting Up
**== Discord.JS Client ==**<br>
Discord.PS is built off of Discord.JS so for it to work you need Discord.JS.
```js
const { Client } = require('discord.js');
const discordClient = new Client({
	// your stuff here
});
```
**== Discord.PS Client ==**<br>
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
## Basics
Discord.PS is a combination of Discord.JS and Discord.PY so both work for the most part.
```js
// Discord.JS
client.on("ready", (ctx) => {
	console.log(`Logged in as ${ctx.user.tag}.`);
});
```
```js
// Discord.PY
client.event("ready", (ctx) => {
	console.log(`Logged in as ${ctx.user.tag}.`);
});
```
### Events
as shown before events function similar to the already existing client.on() from Discord.JS<br>
Discord.PS expands mostly on event names as there are a lot more names for events
