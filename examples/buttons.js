const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const config = require('./config.json');

const wc = new WillClient({ client: client, prefix: "!", token: config.token });

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "buttons"}, async (ctx, cmd) => {
    let trueButton = new wc.Button({
        id: "true",
        label: "True",
        style: "primary"
    });
    
    let falseButton = new wc.Button({
        id: "false",
        label: "False",
        style: "Danger"
    });
    
    let row = new wc.ActionRow([trueButton, falseButton]);
    
    wc.reply("Choose wisely..", { components: [row]});
});

/* button event */

wc.buttonAction( async (ctx) => {
    let id = ctx.customId;
        
    if (id == "true") {
        return ctx.reply("You clicked true!");
    }
    if (id == "false") {
        return ctx.reply("You clicked false!");
    }
});


client.login(config.token);
