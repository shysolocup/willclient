const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "buttons"}, async (ctx, cmd) => {
    let trueButton = client.Button({
        id: "true",
        label: "True",
        style: "primary"
    });
    
    let falseButton = client.Button({
        id: "false",
        label: "False",
        style: "Danger"
    });
    
    let row = client.ActionRow([trueButton, falseButton]);
    
    client.reply("Choose wisely..", { components: [row]});
});

client.event("interaction", async (ctx) => {
    if (ctx.isButton()) {
        let id = ctx.customId;
        
        if (id == "true") {
            return ctx.reply("You clicked true!");
        }
        if (id == "false") {
            return ctx.reply("You clicked false!");
        }
    }
});

client.login(config.token);
