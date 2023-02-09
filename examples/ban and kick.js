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

psc.command( {name: "ban", cooldown: 5}, async (ctx, cmd) => {
    if (cmd.onCooldown) return psc.reply("Command is on cooldown.", {deleteAfter: 3});
    
    let user = await psc.fetchGuildUser(cmd.args[0]);
    let time = psc.time.parse(cmd.args[1]);
    
    if (psc.user.hasPermissions(["ban"])) {
        psc.user.ban(user, time);
        
        await psc.channel.send(`Banned ${user}`, {deleteAfter: 5});
    }
    else {
        await psc.channel.send(`You don't have permission to run this command.`, {deleteAfter: 3});
    }
});


client.login(config.token);
