# Discord.PS Documentation
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
Discord.PS expands mostly on event names as there are a lot more names for events<br><br>

for a full list of all event names either go to [here](https://github.com/TheFlameZEternal/Discord.PS/blob/main/eventList.txt) or do this:
```js
console.log(client.eventList);
```
### Commands
same as events all Discord.JS commands will still function the same even if you use things from Discord.PS client
```js
// Discord.JS
client.on("messageCreate", async (ctx) => {
	console.log(ctx.content);
});
```
however, Discord.PS has an entirely different command system that's similar to Discord.PY<br>
***keep in mind that command names, aliases, and prefixes are automatically made to be lowercase so do not use capital letters.***
```js
// Discord.PS
client.command( {name: "test"}, async (ctx) => {
	console.log(ctx.content);
});
```
#### **== Args N Stuffs ==**
Command Info:
- **name**:  the name of the command `String`
- **aliases**: secondary names for the command `Array`
- **cooldown**: how long until a user can run a command (uses seconds) `Number`

Command Function:
- **ctx**: command context (ctx.content)
- **cmd**: command info (cmd.name, cmd.args, cmd.cooldown)

Command Info (CMD):
- **cmd.name**: name of the command `String`
- **cmd.args**: array of the command's arguments `Array`
- **cmd.cooldown**: cooldown time (false if cooldown is not set) `Number`

```js
// message: !test a b c
client.command( {name: "test", aliases: ["testcommand", "commandtest"], cooldown: 5 }, async (ctx, cmd) => {
	console.log(ctx.content); // "!test a b c"
	console.log(cmd.name); // "test"
	console.log(cmd.args); // ["a", "b", "c"]
	console.log(cmd.cooldown); // 5
});
```
if you want a full list of the bot's commands you can do this:
```js
console.log(client.commandList);
```

#### Client.fetchCommand() `Object`
to fetch a command you can use this<br>
takes a command name and a function *(optional)*
```js
let command = client.fetchCommand("test");
console.log(command.name);
```
or
```js
client.fetchCommand("test", (command) => {
	console.log(command.name);
});
```

#### Client.commandExists() `Boolean`
to check if a command exists you can use this<br>
takes a command name
```js
let exists = client.commandExists("test");
```

#### Client.removeCommand() `None`
removes a command from the bot's command list<br>
takes a command name
```js
client.removeCommand("test");
```
