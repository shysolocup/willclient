const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "ping"}, async (ctx, cmd) => {
    return client.reply("Pong!");
});

/* you would have to make ctx and cmd separately */

client.executeCommand("ping", ctx, cmd);

client.login(config.token);
