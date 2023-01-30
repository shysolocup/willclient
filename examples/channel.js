const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "purge"}, async (ctx, cmd) => {
    let amount = parseInt(cmd.args[0]);
    
    client.channel.purge(amount, ctx.channel); // channel is optional and defautls to ctx.channel
    
    client.reply(`Purged ${amount} messages!`);
});

client.login(config.token);
