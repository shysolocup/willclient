const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discord.ps');
const psc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "ping"}, async (ctx, cmd) => {
    return ctx.reply("Pong!");
});

client.login(config.token);
