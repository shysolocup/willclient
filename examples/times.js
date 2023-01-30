const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "relative"}, async (ctx, cmd) => {
    if (cmd.args.length > 0) {
        return client.reply(client.time.set.relative(cmd.args.join(" ")));
    }
    else {
        return client.reply(client.time.now.relative);
    }
});

client.command( {name: "embeds"}, async (ctx, cmd) => {
    let embed = client.Embed({
        description: "this is the time right now:",
        timestamp: client.time.now.embed
    });
    
    return client.reply({embeds: [embed]});
});

client.login(config.token);
