const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discordpps');
const psc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "ping", cooldown: 5}, async (ctx, cmd) => {
    if (cmd.onCooldown) {
        return ctx.reply(`Command is on cooldown for ${cmd.cooldown.time} seconds!`);
    }
    
    ctx.reply("Ping! Command is not on cooldown!");
});

client.login(config.token);
