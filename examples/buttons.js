const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discord.ps');
const psc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "buttons"}, async (ctx, cmd) => {
    let trueButton = new psc.Button({
        id: "true",
        label: "True",
        style: "primary"
    });
    
    let falseButton = new psc.Button({
        id: "false",
        label: "False",
        style: "Danger"
    });
    
    let row = new psc.ActionRow([trueButton, falseButton]);
    
    psc.reply("Choose wisely..", { components: [row]});
});

/* button event */

psc.buttonAction(async (ctx) => {
    let id = ctx.customId;
        
    if (id == "true") {
        return ctx.reply("You clicked true!");
    }
    if (id == "false") {
        return ctx.reply("You clicked false!");
    }
});


client.login(config.token);
