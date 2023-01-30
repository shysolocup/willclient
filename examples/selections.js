const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "selections"}, async (ctx, cmd) => {
    let select = client.Selection({
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
    
    let row = client.ActionRow([select]);
    
    client.reply({components: [row]});
});

/* selection event */

client.event("interaction", async (ctx) => {
    if (ctx.isSelectMenu()) {
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
    }
});

client.login(config.token);
