const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discordpps');
const psc = new PSClient({ client: client, prefix: "!" });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "avatar", aliases: ["av"], cooldown: 5}, (ctx, cmd) => {
    if (cmd.onCooldown) return psc.reply("Command is on cooldown!", {deleteAfter: 3});
    
    if (cmd.args[0]) {
        let user = psc.fetchUser(cmd.args[0]);
        return ctx.reply(psc.user.avatar(user));
    }
    else {
        return ctx.reply(psc.user.avatar());
    }
});


client.login(config.token);
