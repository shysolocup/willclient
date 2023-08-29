const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const config = require('./config.json');

const wc = new WillClient({ client: client, prefix: "!", token: config.token });

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "ping", cooldown: "5s"}, async (ctx, cmd) => {
    if (cmd.onCooldown) {
        return ctx.reply(`You can use this command again in ${cmd.cooldown.relative}`);
    }
    
    ctx.reply("Ping! Command is not on cooldown!");
});

client.login(config.token);
