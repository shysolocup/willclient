const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discordpps');
const psc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "embed"}, async (ctx, cmd) => {
    let embed = new psc.Embed({
        title: "title",
        description: "description",
        color: psc.colors.blurple,
        
        fields: [
            {name: "Field A", value: "value", inline: true},
            {name: "Field B", value: "value", inline: true}
        ],
        
        footer: "footer",
        timestamp: psc.time.now.embed
    });
    
    ctx.reply( {embeds: [embed]} );
});

client.login(config.token);
