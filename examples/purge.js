const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const config = require('./config.json');

const wc = new WillClient({ client: client, prefix: "!", token: config.token });

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "purge", cooldown: 30}, async (ctx, cmd) => {
    if (cmd.onCooldown) return wc.reply("Command is on cooldown.", {deleteAfter: 3});
    
    let amount = parseInt(cmd.args[0]);
    
    if (wc.author.hasPermissions(["manageMessages"])) {
        wc.channel.purge(amount);
        
        await wc.channel.send(`Purged ${amount} messages.`, {deleteAfter: 3});
    }
    else {
        await wc.channel.send(`You don't have permission to run this command.`, {deleteAfter: 3});
    }
});


client.login(config.token);
