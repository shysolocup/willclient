class PSClient {
    Embed = class {
        constructor(thing=null) {
            return {"color": thing.color};
        }
    }
}

let psc = new PSClient();

let embed = new psc.Embed({
    color: "color1"
    
});

console.log(embed.color); // "color1"

embed.color = "color2";

console.log(embed.color); // "color2"
