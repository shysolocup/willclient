class PSClient {
    Embed = class {
        constructor(thing=null) {
            if (!thing) {
                
            }
            else {
                return {"a": "b"};
            }
        }
    }
}

let psc = new PSClient();

let embed = new psc.Embed("a");

console.log(embed);
