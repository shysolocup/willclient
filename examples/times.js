const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discord.ps');
const psc = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "relative"}, async (ctx, cmd) => {
    if (cmd.args.length > 0) {
        return ctx.reply(psc.time.set.relative(cmd.args.join(" ")));
    }
    else {
        return ctx.reply(psc.time.now.relative);
    }
});

psc.command( {name: "embeds"}, async (ctx, cmd) => {
    let embed = new psc.Embed({
        description: "this is the time right now:",
        timestamp: psc.time.now.embed
    });
    
    return ctx.reply({embeds: [embed]});
});

client.login(config.token);
