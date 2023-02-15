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
let Embed = psc.Embed;

let emb = new Embed("a");

console.log(emb);
