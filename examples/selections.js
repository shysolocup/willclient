const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const wc = new WillClient({ client: client, prefix: "!" });

const config = require('./config.json');

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "selections"}, async (ctx, cmd) => {
    let select = new wc.Selection({
        id: "question",
        placeholder: "Choose wisely..",
        min: 1,
        max: 1,
        options: [
            { label: "A", value: "a", description: "Option A" },
            { label: "B", value: "b", description: "Option B" },
            { label: "C", value: "c", description: "Option C" },
            { label: "D", value: "d", description: "Option D" }
        ]
    });
    
    let row = new wc.ActionRow([select]);
    
    ctx.reply({components: [row]});
});

/* selection event */

wc.selectionAction(async (ctx) => {
    if (ctx.customId == "question") {
        if (ctx.values[0] == "a") {
            ctx.reply("You picked Option A!");
        }
        if (ctx.values[0] == "b") {
            ctx.reply("You picked Option B!");
        }
        if (ctx.values[0] == "c") {
            ctx.reply("You picked Option C!");
        }
        if (ctx.values[0] == "d") {
            ctx.reply("You picked Option D!");
        }
    }
});

client.login(config.token);
