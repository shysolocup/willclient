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
### Events
Discord.PS is a combination of Discord.JS and Discord.PY so both work for the most part.
```js
// Discord.JS
client.on("ready", (ctx) => {
	console.log(`Logged in as ${ctx.user.tag}.`);
});
```
```js
// Discord.PS
client.event("ready", (ctx) => {
	console.log(`Logged in as ${ctx.user.tag}.`);
});
```
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
### Ugly Documentation

#### Client.login() `None`
login with a token<br>
takes a token as a string
```js
client.login(token);
```

#### Client.command() `Object`
creates a new command
```js
client.command( {name: "name", alises: ["aliases"], cooldown: 5}, async (ctx, cmd) => {
	// do stuff
});
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

#### Client.executeCommand() `Function`
mostly used for parts of the api but you can use it if you want<br>
used to execute commands with script instead of with messages
```js
client.executeCommand(name, ctx, cmd);
```

#### Client.commandFormat() `Object`
to format a command you can use this<br>
takes a string
```js
// message: "!test a b c"
let format = client.commandFormat(message);
console.log(format.name); // "test"
console.log(format.args); // ["a", "b", "c"]
```

#### Client.commandHandler() `None`
mostly used for parts of the api but you can use it if you want<br>
used to handle commands from messages
```js
discordClient.on("messageCreate", async (ctx) => {
	Holder = [client, discordClient, ctx];
	client.commandHandler(ctx);
});
```

#### Client.commandList `Array`
returns an array of all the commands for the bot
```js
console.log(client.commandList);
```

#### Client.eventList `Object`
returns an array of all the events
```js
console.log(client.eventList);
```

#### Client.event() `Function`
does something when an event happens
```js
client.event("join", async (ctx) => {
	console.log("user joined!");
});
```

#### Client.colors `Object`
for a full list of colors you can either go to [here](https://github.com/TheFlameZEternal/Discord.PS/blob/main/colorList.txt) or do this:
```js
console.log(client.colors);
```
```js
let embed = client.Embed({
	description: "a",
	color: client.colors.blurple
});
```

#### Client.colorFormat() `Number`
converts a hex color into an 0x int color for use in embeds
```js
client.colorFormat(client.colors.blurple); // 0x7289da
```

#### Client.Embed() `Object`
edited version of the normal message embeds for more simplicity<br>
for all of the ones that have url removed you can still use it especially for things like footer
```js
let embed = client.Embed({
	name: "name",
	description: "description",
	color: client.colors.blurple,
	
	image: "url",
	thumbnail: "url",
	
	// the normal {url: "url"} for image and thumbnail still work if you want to use them
	
	fields: [
		{name: "test", value: "a b c", inline: true},
		{name: "test2", value: "d e f", ineline: false}
	],
	
	footer: "a"
	
	// footer: {name: "a"}
	// footer: {text: "a", icon: "url"}
	// footer: {text: "a", iconURL: "url"}
	
	timestamp: client.time.now.embed
});

client.channel.send({embeds: [embed]});
```

#### Client.Button `Object`
edited version of the normal message buttons for way more simplicity<br>
for more info on buttons and button styles go [here](https://discord.com/developers/docs/interactions/message-components#buttons)
```js
let button = client.Button({
	id: "id",
	label: "label",
	emoji: "emoji", // even tho pretty sure emoji and label can't be in the same button but eh
	style: "primary"
});
```

#### Client.buttonStyle() `Number`
takes a string and converts it into the cooresponding number
```js
console.log(client.buttonStyle("primary")); // 1
```

#### Client.Selection() `Object`
edited version of the normal message select menus for way more simplicity<br>
for more info on select menus go [here](https://discord.com/developers/docs/interactions/message-components#select-menus)

#### Client.ActionRow() `Object`
takes an array and returns a new action row<br>
used for buttons and stuff
```js
let button1 = client.Button({ /* button stuff */});
let button2 = client.Button({ /* button stuff */});

let row = client.ActionRow([button1, button2]);

client.channel.send({ components: [row] });
```

#### Client.fetchUser() `User`
takes an id or @mention and gets user info from the bot's user cache
```js
let user = client.fetchUser("id");

console.log(user.tag);
```

#### Client.fetchGuildUser() `User`
takes an id or @mention and gets user info from a guild's users
```js
let user = client.fetchGuildUser("id");

console.log(user.tag);
```

#### Client.fetchChannel() `Channel`
takes an id or #channel mention and gets channel info from the bot's channel cache
```js
let channel = client.fetchChannel("id");

console.log(channel.name);
```

#### Client.fetchGuildChannel() `Channel`
takes an id or #channel mention and gets channel info from a guild's channels
```js
let channel = client.fetchGuildChannel("id");

console.log(channel.name);
```

#### Client.fetchGuildRole() `Role`
takes an id or @role mention and gets role info from a guild's roles
```js
let role = client.fetchGuildRole("id");

console.log(role.name);
```

#### Client.time `String`
outputs a string with a timestamp that can be used by discord
for more info on how timestamps work go [here](https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa)<br>
```js
let embed = client.Embed({
	description: "a",
	timestamp: client.time.now.embed
});

client.channel.send(client.time.now.relative, {embeds: [embed]});
```
##### Types:
- Set: takes a given time and turns it into a usable time for discord *(ex: client.time.set.default("28 November 2018 09:01"))*<br>
- Now: uses the current time and turns it into a usable time for discord *(ex: client.time.set.relative)*
##### Times:
- embed: time for embeds
- default: default time
- shortTime: shorter version of the time
- longTime: longer version of the time
- shortDate: shorter version of the date
- longDate: longer version of the date
- shortDT: shorter version of the date and time
- longDT: longer version of the date and time
- relative: time relative to the current time

#### Client.channel.send() `CTX`
sends a message to a channel<br>
takes message content and an extras object
```js
let message = await client.channel.send("abc", {embeds: [embed], components: [row]});
```

#### Client.reply() `CTX`
replies to a message<br>
takes message content and an extras object
```js
let message = await client.reply("abc", {embeds: [embed], components: [row]});
```

#### Client.channel.purge() `None`
purges a channel for a given amount of messages<br>
channel is optional and defaults to the ctx channel if not given
```js
client.channel.purge(5, channel);
```

#### Client.channel.lock() `None`
locks a channel making it so the @everyone role can't speak<br>
channel is optional and defaults to the ctx channel if not given
```js
client.channel.lock(channel);
```

#### Client.channel.unlock() `None`
unlocks a channel making it so the @everyone role can speak again<br>
channel is optional and defaults to the ctx channel if not given
```js
client.channel.unlock(channel);
```

#### Client.voice.lock() `None`
mutes and deafens everyone in a voice channel<br>
takes a channel
```js
client.voice.lock(channel)
```

#### Client.voice.unlock() `None`
unmutes and undeafens everyone in a voice channel<br>
takes a channel
```js
client.voice.unlock(channel)
```

#### Client.voice.join(channel) `None`
makes the bot join a voice channel<br>
takes a channel
```js
client.voice.join(channel)
```

#### Client.voice.leave(channel) `None`
makes the bot leave a voice channel<br>
takes a channel
```js
client.voice.leave(channel)
```

#### Client.guild.memberCount `Number`
returns the amount of members a guild has
```js
client.guild.memberCount
```

#### Client.guild.roleCount `Number`
returns the amount of roles a guild has
```js
client.guild.roleCount
```

#### Client.guild.channelCount `Number`
returns the amount of channels a guild has
```js
client.guild.channelCount
```

#### Client.guild.emojiCount `Number`
returns the amount of emojis a guild has
```js
client.guild.emojisCount
```

#### Client.guild.stickerCount `Number`
returns the amount of stickers a guild has
```js
client.guild.stickerCount
```

#### Client.guild.members() `Function`
lets you get every member in a server
```js
client.guild.members( (members) => {
	members.forEach( (member) => {
		// do stuff
	});
});
```

#### Client.guild.roles() `Function`
lets you get every role in a server
```js
client.guild.roles( (roles) => {
	roles.forEach( (role) => {
		// do stuff
	});
});
```

#### Client.guild.channels() `Function`
lets you get every channel in a server
```js
client.guild.channels( (channels) => {
	channels.forEach( (channel) => {
		// do stuff
	});
});
```

#### Client.guild.emojis() `Function`
lets you get every emoji in a server
```js
client.guild.emojis( (emojis) => {
	emojis.forEach( (emoji) => {
		// do stuff
	});
});
```

#### Client.guild.stickers() `Function`
lets you get every sticker in a server
```js
client.guild.stickers( (stickers) => {
	stickers.forEach( (sticker) => {
		// do stuff
	});
});
```
