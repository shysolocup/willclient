const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const wc = new WillClient({ client: client, prefix: "!" });

const config = require('./config.json');

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "avatar", aliases: ["av"], cooldown: 5}, (ctx, cmd) => {
    if (cmd.onCooldown) return wc.reply("Command is on cooldown!", {deleteAfter: 3});
    
    if (cmd.args[0]) {
        let user = wc.fetchUser(cmd.args[0]);
        return ctx.reply(wc.user.avatar(user));
    }
    else {
        return ctx.reply(wc.user.avatar());
    }
});


client.login(config.token);
