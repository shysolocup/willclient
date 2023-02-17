<div align="center">
	<br />
	<img src="https://github.com/nuttmegg/discord.ps/blob/main/assets/documentation%20logo.png">
</div>

## Installation
```
npm i nuttmegg/discord.ps

npm i discord.ps (this is not currently available)
```
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
once you have your ps client set up and working you can run it using these:
```js
client.login(token); // normal discord.js

psc.run(token); // optional alternative
```
