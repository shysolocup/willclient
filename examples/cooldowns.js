const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "ping", cooldown: 5}, async (ctx, cmd) => {
    if (cmd.onCooldown) {
        return client.reply(`Command is on cooldown for ${cmd.cooldown.time} seconds!`);
    }
    
    client.reply("Ping! Command is not on cooldown!");
});

client.login(config.token);
