const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const config = require('./config.json');

const wc = new WillClient({ client: client, prefix: "!", token: config.token });

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "embed"}, async (ctx, cmd) => {
    let embed = new wc.Embed({
        title: "title",
        description: "description",
        color: wc.colors.blurple,
        
        fields: [
            {name: "Field A", value: "value", inline: true},
            {name: "Field B", value: "value", inline: true}
        ],
        
        footer: "footer",
        timestamp: wc.time.now.embed
    });
    
    ctx.reply( {embeds: [embed]} );
});

client.login(config.token);
