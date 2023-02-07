/* THIS RELIES ON DISCORD.PS VERSION 0.5 WHICH IS NOT CURRENTLY AVAILABLE */

const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const psc = new PSClient({ client: client, prefix: "!" });

const config = require('./config.json');


psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "purge", cooldown: 30}, async (ctx, cmd) => {
    if (cmd.onCooldown) return ctx.reply("Command is on cooldown.");
    
    let amount = cmd.args[0];
    
    if (psc.user.hasPermissions(["manageMessages"])) {
        psc.channel.purge(amount);
        
        await psc.channel.send(`Purged ${amount} messages.`, {deleteAfter: 3});
    }
    else {
        await psc.channel.send(`You don't have permission to run this command.`, {deleteAfter: 3});
    }
});


client.login(config.token);
