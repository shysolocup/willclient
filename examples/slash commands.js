const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const config = require('./config.json');

const wc = new WillClient({ client: client, prefix: "!", token: config.token });

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.slashCommand("ping", "Replies with pong!", async (ctx, cmd) => {
    ctx.reply("Pong!");
});


client.login(config.token);
