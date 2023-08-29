const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const config = require('./config.json');

const wc = new WillClient({ client: client, prefix: "!", token: config.token });

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "relative"}, async (ctx, cmd) => {
    if (cmd.args.length > 0) {
        return ctx.reply(wc.time.set.relative(cmd.args.join(" ")));
    }
    else {
        return ctx.reply(wc.time.now.relative);
    }
});

wc.command( {name: "embeds"}, async (ctx, cmd) => {
    let embed = new wc.Embed({
        description: "this is the time right now:",
        timestamp: wc.time.now.embed
    });
    
    return ctx.reply({embeds: [embed]});
});

client.login(config.token);
