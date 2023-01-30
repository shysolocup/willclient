const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "embed"}, async (ctx, cmd) => {
    let embed = client.Embed({
        title: "title",
        description: "description",
        color: client.colors.blurple,
        
        fields: [
            {name: "Field A", value: "value", inline: true},
            {name: "Field B", value: "value", inline: true}
        ],
        
        footer: "footer",
        timestamp: client.time.now.embed
    });
    
    client.reply( {embeds: [embed]} );
});

client.login(config.token);
