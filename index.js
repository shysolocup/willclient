/*
	:: WillClient :: Version 1.0.1 | 09/10/23 ::
	https://github.com/paigeroid/willclient

*/

/* :: Created by @paigeroid using :: *//*
	- Stews: https://github.com/paigeroid/stews
	- NutFL: https://github.com/paigeroid/nutfl
*/


// Imports
const { ActivityType, REST, Routes } = require('discord.js');
const voice = require('@discordjs/voice');
const { Stew, Soup, Noodle, random } = require('stews');
var fs = require('fs');

import('node-fetch');


// String Functions
String.prototype.colorFormat = function() {
	if (this.startsWith("#")) { var a = this.replace("#", "0x"); return parseInt(a); } else { return 0x5865F2; }
};

String.prototype.codeBlock = function(language=null) {
	return (language) ? `\`\`\`${language}\n${this}\`\`\`` : `\`\`\`${this}\`\`\``;
};


// Error Handling
class CoolError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}


// Holder
var Holder;


// Main
class WillClient {
    constructor(settings) {
    	this.client = settings.client;
    	this.prefix = settings.prefix;

		console.log("willclient started");

		
		// prefix commands
		this.client.on("messageCreate", async (ctx) => {
			Holder = [this, this.client, ctx, null];
			await this.commandHandler(ctx);
		});
	
		
		// slash commands
		this.client.on("interactionCreate", async (ctx) => {
			if (ctx.isChatInputCommand()) {
				Holder = [this, this.client, ctx, null];
				await this.slashCommandHandler(ctx);
			}
		});


		// applying slash commands
		this.client.on("ready", async (ctx) => {

			if (!settings.token && this.slashCommandList.length <= 0) {
				throw new CoolError("Slash Command Registering", "You must include your bot's token in the settings object for slash commands to register properly\n\nEx: { client: client, prefix: prefix, token: token }");
			}


			var jsonCommands = this.slashCommandList.values.map( (command) => {
				let info = command.info.copy()
				
				// removing cooldown because it breaks it because it's stupid
				if (info.has("cooldown")) info.delete("cooldown");
	
				return info.toJSON()
				
			});
	
			this.rest = new REST().setToken(settings.token)
			fetch('https://discordapp.com/api/oauth2/applications/@me', {
				headers: {
					authorization: `Bot ${settings.token}`,
				},
			})
	
				.then(result => result.json())
				.then( async (response) => {
					const { id } = response;
					
					await this.rest.put(
						Routes.applicationCommands(id),
						{ body: jsonCommands }
					);
			})
			.catch(console.error);
		});

		
		// Function Maker
		Object.defineProperties(this, {
    		"Function": { value: WCFunctionMaker }, "function": { value: WCFunctionMaker },
    		"Func": { value: WCFunctionMaker }, "func": { value: WCFunctionMaker}
		});


		// Property Maker
		Object.defineProperties(this, {
    		"Property": { value: WCPropertyMaker }, "property": { value: WCPropertyMaker },
    		"Prop": { value: WCPropertyMaker }, "prop": { value: WCPropertyMaker }
		});
    }
	
    /* configurations */
    setPrefix(prefix) {
        this.prefix = prefix;
    }


	setToken(token) {
		this.token = token;
		this.rest = new REST().setToken(this.token)
	}


	build(path, ignore=["index.js", "index.ts"], action=(path, file) => { require(`../../${path}/${file}`); }) {
		let files = fs.readdirSync(`${path}`).filter(file => ((file.endsWith('.js') || file.endsWith('.ts')) && !ignore.includes(file) ));
		files.forEach( (file) => { action(path, file) } );
	}


	compile(path, ignore=["index.js"], action=(path, file, compiled, name) => { compiled.push(name, require(`../../${path}/${file}`)); }, json=true) {
		let files = fs.readdirSync(`${path}`).filter(file => ((file.endsWith('.js') || file.endsWith('.ts') || (json && file.endsWith(".json"))) && !ignore.includes(file) ));
		let stuff = new Soup(Object);
		
		files.forEach( (file) => {
			let name = (file.endsWith(".js")) ? file.split(".js")[0] : (file.endsWith('.ts')) ? file.split('.ts')[0] : (file.endsWith(".json")) ? file.split(".json")[0] : file;
			action(path, file, stuff, name);
		});

		return stuff;
	}


	addon(call, path, ignore=[], action=(path) => { 
			try {
				return require(`../../${path}`); 
			} catch(e) {
				try {
					return require(path); 
				} catch(e) {
					throw new CoolError("Plugins", `Invalid plugin path: ${path}`);
				}
			}
		}) {

		this[call] = action(path)
	}
    
    
    
    /* variables */
    commandList = new Stew(Object);
	slashCommandList = new Stew(Object);
	cooldownHandles = new Soup(Array);
	handlerActive = false;


	get ctx() {
		var [wc, client, ctx] = Holder;
		return ctx
	}


	get cmd() {
		var [wc, client, ctx, cmd] = Holder;
		return cmd
	}
	
	
	globalCooldown = {
		data: new Set(),
    	active: true,
    	time: 0,
    	
    	handle: function(user=null) {
			var [wc, client, ctx] = Holder;

			user = (user) ? user : (ctx.author) ? ctx.author : ctx.user;
					
        	if (!this.data.has(user.id)) {
            	this.data.add(user.id);
            	
            	setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        	}
    	},
    	
    	
    	fetch: function(user=null) {
			var [wc, client, ctx] = Holder;

			user = (user) ? user : (ctx.author) ? ctx.author : ctx.user;

			return (this.data.has(user.id)) ? true : false;
    	}
	};
	
	
	setCooldown(time) {
		time = this.time.parse(time);

		if (typeof time != "number") {
			throw new CoolError("Global Cooldown", "Cooldown has to be an integer (seconds)");
		}

		this.globalCooldown.time = time
		this.globalCooldown.timestamp = this.time.set.relative( Math.abs(this.time.parse(time)*1000 + (Date.now())) );
		this.globalCooldown.active = true;


		Object.defineProperties(this.globalCooldown, {
			
			relative: { get() {
				var [wc, client, ctx] = Holder;
				let now = parseInt(wc.time.now.relative.split(":")[1]);
				let raw = Math.abs( time + parseInt(now) );
				return `<t:${raw}:R>`;
			}},
			
			
			raw: { get() {
				var [wc, client, ctx] = Holder;
				let now = parseInt(wc.time.now.relative.split(":")[1]);
				return Math.abs( time + parseInt(now) );
			}}
			
		});
	}
	
	
	deleteCooldown() {
		this.globalCooldown.active = false;
	}
    
    
    
    /* commands */
    command(info={name:null, aliases:null, cooldown:null}, data) {
		if (typeof info == "string") {
			let thing = info;
			info = { name: thing, aliases: null, cooldown: null};
		}
		
		
		var [name, aliases] = [info.name, info.aliases];
		
		
		if (info.cooldown && typeof info.cooldown == "number") { var time = info.cooldown; }
		else if (info.cooldown && typeof info.cooldown == "string") { var time = this.time.parse(info.cooldown); }
		else if (info.cooldown) { throw new CoolError("Command Creation", 'Invalid cooldown. ( cooldown: 3 | cooldown: "3s" )'); }
		
		
		if (!name || typeof name != "string" || name.length <= 0) {
			throw new CoolError("Command Creation", "Invalid command name.\n\nPossible reasons:\n    • doesn't exist\n    • not a string\n    • blank string\n\nActual error stuff:");
		}
		
		
		if (this.commandExists(name)) {
			throw new CoolError("Command Creation", "Command with that name already exists.");
		}
		
		
		if (info.cooldown) {
			if (typeof time != "number") {
				throw new CoolError("Command Creation", "Cooldown has to be an integer (seconds)");
			}
			
			
			info.cooldown = {
    			data: new Set(),
    			active: true,
    			time: time,
				
				get relative() {
					var [wc, client, ctx] = Holder;
					let now = parseInt(wc.time.now.relative.split(":")[1]);
					let raw = Math.abs( info.cooldown.time + parseInt(now) );
					return `<t:${raw}:R>`;
				},
				
				
				get raw() {
					var [wc, client, ctx] = Holder;
					let now = parseInt(wc.time.now.relative.split(":")[1]);
					return Math.abs( info.cooldown.time + parseInt(now) );
				},
				
    			
    			handle(user=null) {
					var [wc, client, ctx] = Holder;

					user = (user) ? user : ctx.author;
					
        			if (!this.data.has(user.id)) {
            			this.data.add(user.id);
            			
            			setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        			}
    			},
    			
    			
    			fetch(user=null) {
					var [wc, client, ctx] = Holder;
					return (this.data.has( (user) ? user.id : ctx.author.id )) ? true : false;
    			}
			};
		}
		
        let newCMD = {"info": Soup.from(info), "data": data};
        this.commandList.push(info.name, newCMD);
        
		return newCMD;
    }


	commandExists(name) {
		var exists;
		
		try {
			
        	for (let i = 0; i < this.commandList.length; i++) {
        	    let info = this.commandList.get(i).info;
        		if (info.get("name") == name || (info.get("aliases") && info.get("aliases").includes(name)) ) { throw true; }
        	}
        	
        	throw false;
        	
        } catch(has) {
            exists = has;
        }
		
		return exists;
	}

	CMDExists(name, func) { return this.CommandExists(name); }
    
    
    fetchCommand(name, func=null) {
        var index;
        
        try {
        	for (let i = 0; i < this.commandList.length+1; i++) {
        	    var info = this.commandList.get(i).info;
        		if (info.get("name") == name || (info.get("aliases") && info.get("aliases").includes(name)) ) { throw i; }
        	}
        	throw null;
        	
        } catch(has) {
            if (has == null) throw new CoolError("Command Fetch Error", "Invalid command name.");
            else index = has;
        }
        
        
        let command = this.commandList.get(index);
		
		let returns = {
			
			name: command.info.get("name"),
			aliases: command.info.get("aliases"),
			cooldown: command.info.get("cooldown"),
			data: command.data
		
		};
        
        return (!func) ? returns : func(returns);
    }
    
    fetchCMD(name, func=null) { return this.fetchCommand(name,func); }
    
    
    async executeCommand(name, ctx, cmd) {
		var onCooldown; var cooldown; var cooldownType
    	var command = this.fetchCommand(name);

		
    	if (command.cooldown && command.cooldown.active) {
			if (command.cooldown.fetch()) {
				cooldown = command.cooldown;
				cooldownType = "commandCooldown";
				onCooldown = true;
			}
			
			command.cooldown.handle();
    	}
    	
    	else if (this.globalCooldown && this.globalCooldown.active) {
			if (this.globalCooldown.fetch()) {
				cooldown = this.globalCooldown;
				cooldownType = "globalCooldown";
				onCooldown = true;
			}
			
			this.globalCooldown.handle();
    	}
    	
		else {
			
			cooldown = {};
			onCooldown = false;
			cooldownType = null;
			
		}
    	
    	cmd.onCooldown = (onCooldown) ? onCooldown : false;
		cmd.cooldownType = (cooldownType) ? cooldownType : null;
		cmd.cooldown = (cooldown) ? cooldown : {};


		if (cmd.onCooldown) {
			this.cooldownHandles.forEach( (handle) => {
				handle(ctx, cmd)
			});
		}

		Holder[3] = cmd;
    	
    	
    	return await command.data(ctx, cmd);
    }
    
    executeCMD(name, ctx, cmd) { return this.executeCommand(name, ctx, cmd); }


	commandFormat(string, prefix) {
		let res = {};
		let pos = (prefix) ?
			
			string.toLowerCase().indexOf(prefix.toLowerCase())
			: 0;
		
		
		res["name"] = (prefix) ?
		
			string.toLowerCase().replace(prefix.toLowerCase(), "").split(" ")[pos]
			: string.toLowerCase().split(" ")[pos];
			

		let soup = new Soup(string.split(" "));
		delete soup[pos];
		
		res["args"] = soup.pour();
		
		
		return res;
	}


	async commandHandler(ctx) {
		if (ctx.author.bot || ctx.author.id == this.client.user.id) return;
		
		let prefix = (this.prefix instanceof Object && this.prefix[ctx.guild.id] ) ? this.prefix[ctx.guild.id] : (this.prefix instanceof Object) ? this.prefix.default : this.prefix;
		
		if (prefix && (!ctx.content.startsWith(prefix) || (ctx.content.endsWith(prefix) && ctx.content.startsWith(prefix)))) return;
		
		let cmd = this.commandFormat(ctx.content, prefix);
		
		if (this.commandExists(cmd.name)) {
			await this.executeCommand(cmd.name, ctx, cmd);
		}
	}

	
	slashCommand(info={name:null, description:null, options:null, cooldown:null, nsfw:false}, dataA, dataB=null) {
		if (typeof info == "string") {
			let thing = info;
			info = { name: thing, description:null, options:null, cooldown:null, nsfw:false };
		}

		if (info.options && info.options instanceof Array) {
			var options = Soup.from(info.options)

			options = options.map( (v) => {
				v.type = this.optionType(v.type);
				if (v.desc && !v.description) v.description = v.desc;
				return v;
			})
		}

		if (info.desc && !info.description) info.description = info.desc

		var data
		if (typeof dataA == "string" && !info.description) {
			info.description = dataA
			data = dataB
		}
		else if (info.description) {
			data = dataA
		}
 		
		
		var [name, description] = [info.name, info.description];
		
		
		if (info.cooldown && typeof info.cooldown == "number") { var time = info.cooldown; }
		else if (info.cooldown && typeof info.cooldown == "string") { var time = this.time.parse(info.cooldown); }
		else if (info.cooldown) { throw new CoolError("Slash Command Creation", 'Invalid cooldown. ( cooldown: 3 | cooldown: "3s" )'); }
		
		
		if (!name || typeof name != "string" || name.length <= 0) {
			throw new CoolError("Slash Command Creation", "Invalid slash command name.\n\nPossible reasons:\n    • doesn't exist\n    • not a string\n    • blank string\n\nActual error stuff:");
		}

		if (!description || typeof description != "string" || description.length <= 0) {
			throw new CoolError("Slash Command Creation", "Invalid slash command description.\n\nPossible reasons:\n    • not a string\n    • blank string\n\nActual error stuff:");
		}
		
		
		if (info.cooldown) {
			if (typeof time != "number") {
				throw new CoolError("Slash Command Creation", "Cooldown has to be an integer (seconds)");
			}
			
			
			info.cooldown = {
				data: new Set(),
				active: true,
				time: time,
				
				get relative() {
					var [wc, client, ctx] = Holder;
					let now = parseInt(wc.time.now.relative.split(":")[1]);
					let raw = Math.abs( info.cooldown.time + parseInt(now) );
					return `<t:${raw}:R>`;
				},
				
				
				get raw() {
					var [wc, client, ctx] = Holder;
					let now = parseInt(wc.time.now.relative.split(":")[1]);
					return Math.abs( info.cooldown.time + parseInt(now) );
				},
				
				
				handle(user=null) {
					var [wc, client, ctx] = Holder;
	
					user = (user) ? user : ctx.user;
					
					if (!this.data.has(user.id)) {
						this.data.add(user.id);
						
						setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
					}
				},
				
				
				fetch(user=null) {
					var [wc, client, ctx] = Holder;
					return (this.data.has( (user) ? user.id : ctx.user.id )) ? true : false;
				}
			};
		}
		
		let newCMD = {"info": Soup.from(info), "data": data};
		this.slashCommandList.push(info.name, newCMD);

		return newCMD;
	}


	optionType(type) {
		return (typeof type == "number")
			? type
		: ( ["sub_command", "sub_com", "sub"].includes(type.toLowerCase()) )
			? 1
		: ( ["sub_command_group", "sub_com_group", "sub_group"].includes(type.toLowerCase()) )
			? 2
		: ( ["string", "str"].includes(type.toLowerCase()) )
			? 3
		: ( ["integer", "int"].includes(type.toLowerCase()) )
			? 4
		: ( ["boolean", "bool"].includes(type.toLowerCase()) )
			? 5
		: ( ["user", "member"].includes(type.toLowerCase()) )
			? 6
		: (type.toLowerCase() == "channel")
			? 7
		: (type.toLowerCase() == "role")
			? 8
		: ( ["mentionable", "mention"].includes(type.toLowerCase())  )
			? 9
		: ( ["number", "num"].includes(type.toLowerCase()) )
			? 10
		: ( ["attachment", "file"].includes(type.toLowerCase()) )
			? 5
		: null;
	}


	async executeSlashCommand(name, ctx, cmd) {
		var onCooldown; var cooldown; var cooldownType
    	var command = this.slashCommandList.get(name);
    	
    	
    	if (command.info.cooldown && command.info.cooldown.active) {
			if (command.info.cooldown.fetch()) {
				cooldown = command.info.cooldown;
				cooldownType = "commandCooldown";
				onCooldown = true;
			}
			
			command.info.cooldown.handle();
    	}
    	
    	else if (this.globalCooldown && this.globalCooldown.active) {
			if (this.globalCooldown.fetch()) {
				cooldown = this.globalCooldown;
				cooldownType = "globalCooldown";
				onCooldown = true;
			}
			
			this.globalCooldown.handle();
    	}
    	
		else {
			
			cooldown = {};
			onCooldown = false;
			cooldownType = null;
			
		}
    	
    	cmd.onCooldown = (onCooldown) ? onCooldown : false;
		cmd.cooldownType = (cooldownType) ? cooldownType : null;
		cmd.cooldown = (cooldown) ? cooldown : {};
    	

		if (cmd.onCooldown) {
			this.cooldownHandles.forEach( (handle) => {
				handle(ctx, cmd)
			});
		}


		Holder[3] = cmd;

    	
    	return await command.data(ctx, cmd);
    }
    
    async executeSlashCMD(name, ctx, cmd) { return this.executeSlashCommand(name, ctx, cmd); }


	fetchSlashCommand(name, func=null) {
        var index;
        
        try {
        	for (let i = 0; i < this.slashCommandList.length+1; i++) {
        	    var info = this.slashCommandList.get(i).info;
        		if (info.get("name") == name ) { throw i; }
        	}
        	throw null;
        	
        } catch(has) {
            if (has == null) throw new CoolError("Slash Command Fetch Error", "Invalid slash command name.");
            else index = has;
        }
        
        
        let command = this.slashCommandList.get(index);
		
		let returns = {
			
			name: command.info.get("name"),
			description: command.info.get("description"),
			cooldown: command.info.get("cooldown"),
			options: command.info.get("options"),
			nsfw: command.info.get("nsfw"),
			data: command.data
		
		};
        
        return (!func) ? returns : func(returns);
    }

    fetchSlashCMD(name, func=null) { return this.fetchSlashCommand(name,func); }


	slashCommandExists(name) {
		var exists;
		
		try {
			
        	for (let i = 0; i < this.slashCommandList.length; i++) {
        	    let info = this.slashCommandList.get(i).info;
        		if (info.get("name") == name) { throw true; }
        	}
        	
        	throw false;
        	
        } catch(has) {
            exists = has;
        }
		
		return exists;
	}

	slashCMDExists(name) { return this.slashCommandExists(name); }


	async slashCommandHandler(ctx) {
		if (!ctx.isChatInputCommand()) return;

		if (this.slashCommandExists(ctx.commandName)) {
			let cmd = Soup.from(this.fetchSlashCommand(ctx.commandName)).copy().pour()
			cmd.args = ctx.options.data;
			ctx.author = ctx.user;

			await this.executeSlashCommand(ctx.commandName, ctx, cmd)
		}
	}
    
    
    
    /* events */
    eventList = {
    	
    	// run bot
    	"start": "ready",
    	"run": "ready",
    	"login": "ready",
		"ready": "ready",
		
		
		
		/* :: MESSAGES :: */
		
			// message
			"message": "message",
			
			// message sent
			"createMessage": "messageCreate",
			"newMessage": "messageCreate",
			"messageSent": "messageCreate",
			"send": "messageCreate",
			
			// edit message
			"updateMessage": "messageUpdate",
			"edit": "messageUpdate",
			"editMessage": "messageUpdate",
			"messageEdit": "messageUpdate",
			
			// delete message
			"deleteMessage": "messageDelete",
			
			// bulk delete
			"bulkDelete": "messageDeleteBulk",
			"deleteBulk": "messageDeleteBulk",
			"purge": "messageDeleteBulk",
			
			// pin message
			"pin": "channelPinsUpdate",
			"newPin": "channelPinsUpdate",
			"pinsUpdate": "channelPinsUpdate",
			"updatePins": "channelPinsUpdate",
		
		
		
		/* :: MEMBERS ** */
		
			// member join
			"join": "guildMemberAdd",
			"joinGuild": "guildMemberAdd",
			"joinServer": "guildMemberAdd",
			"newMember": "guildMemberAdd",
			"memberAdd": "guildMemberAdd",
			"memberJoin": "guildMemberAdd",
			"newUser": "guildMemberAdd",
			"userAdd": "guildMemberAdd",
			"userJoin": "guildMemberAdd",
			
			// member update
			"updateUser": "userUpdate",
			"editUser": "userUpdate",
			"userEdit": "userUpdate",
			"updateMember": "userUpdate",
			"editMember": "userUpdate",
			"memberEdit": "userUpdate",
		
			// guild member update
			"updateGuildMember": "guildMemberUpdate",
			"editGuildMember": "guildMemberUpdate",
			"guildMemberEdit": "guildMemberUpdate",
			"updateGuildUser": "guildMemberUpdate",
			"editGuildUser": "guildMemberUpdate",
			"guildUserEdit": "guildMemberUpdate",
			"guildUserUpdate": "guildMemberUpdate",
			
			// member leave
			"leave": "guildMemberRemove",
			"leaveGuild": "guildMemberRemove",
			"userLeave": "guildMemberRemove",
			"memberLeave": "guildMemberRemove",
			"memberRemove": "guildMemberRemove",
			"userRemove": "guildMemberRemove",
			"removeMember": "guildMemberRemove",
			"removeUser": "guildMemberRemove",
			
			// member ban
			"ban": "guildBanAdd",
			"banUser": "guildBanAdd",
			"banMember": "guildBanAdd",
			"banAdd": "guildBanAdd",
			"addBan": "guildBanAdd",
			
			// member unban
			"unban": "guildBanRemove",
			"unbanUser": "guildBanRemove",
			"unbanMember": "guildBanRemove",
			"removeBan": "guildBanRemove",
			"banRemove": "guildBanRemove",
			
			// member typing
			"typing": "typingStart",
			"userTyping": "typingStart",
			"memberTyping": "typingStart",
			
			// member available
			"memberAvailable": "guildMemberAvailable",
			"userAvailable": "guildMemberAvailable",
			
			// member chunk
			"memberChunk": "guildMemberChunk",
			"userChunk": "guildMemberChunk",
		
		
		
		/* :: SLASH COMMAND :: */
			
			// create slash command
			"newCommand": "applicationCommandCreate",
			"commandCreate": "applicationCommandCreate",
			"createCommand": "applicationCommandCreate",
			
			// delete slash command
			"commandDelete": "applicationCommandDelete",
			"deleteCommand": "applicationCommandDelete",
			
			// update slash command
			"commandUpdate": "applicationCommandUpdate",
			"updateCommand": "applicationCommandUpdate",
			"commandEdit": "applicationCommandUpdate",
			"editCommand": "applicationCommandUpdate",

			// run slash command 
			"commandRan": "interactionCreate",
			"command": "interactionCreate",
		
		
		
		/* :: CHANNELS :: */
			
			// create channel
			"newChannel": "channelCreate",
			"createChannel": "channelCreate",
			
			// delete channel
			"deleteChannel": "channelDelete",
			
			// update channel
			"updateChannel": "channelUpdate",
			"editChannel": "channelUpdate",
			"channelEdit": "channelUpdate",
			"chanelUpdate": "channelUpdate",
			
			
		
		/* :: GUILDS :: */
		
			// create guild
			"newGuild": "guildCreate",
			"createGuild": "guildCreate",
			
			// update guild
			"updateGuild": "guildUpdate",
			"editGuild": "guildUpdate",
			"guildEdit": "guildUpdate",
			
			// delete guild
			"deleteGuild": "guildDelete",
			
			// guild unavailable
			"guildUnavailable": "guildUnavailable",
			
			
			
		/* :: ROLES :: */
		
			// create role
			"createRole": "roleCreate",
			"newRole": "roleCreate",
			
			// update role
			"updateRole": "roleUpdate",
			"editRole": "roleUpdate",
			"roleEdit": "roleUpdate",
			
			// delete role
			"deleteRole": "roleDelete",
			
			
			
		/* :: EMOJIS :: */
		
			// create emoji
			"newEmoji": "emojiCreate",
			"createEmoji": "emojiCreate",
			
			// update emoji
			"updateEmoji": "emojiUpdate",
			"editEmoji": "emojiUpdate",
			"emojiEdit": "emojiUpdate",
			
			// delete emoji
			"deleteEmoji": "emojiDelete",
			"removeEmoji": "emojiDelete",
			
			
			
		/* :: STICKERS :: */
		
			// create sticker
			"newSticker": "stickerCreate",
			"createSticker": "stickerCreate",
			
			// update sticker
			"updateSticker": "stickerUpdate",
			"editSticker": "stickerUpdate",
			"stickerEdit": "stickerUpdate",
			
			// delete sticker
			"deleteSticker": "stickerDelete",
			"removeSticker": "stickerDelete",
			
			
			
		/* :: REACTIONS :: */
			
			// add reaction
			"reaction": "messageReactionAdd",
			"newReaction": "messageReactionAdd",
			"reactionAdd": "messageReactionAdd",
			"createReaction": "messageReactionAdd",
			"reactionCreate": "messageReactionAdd",
			"Addreaction": "messageReactionAdd",
			
			// remove reaction
			"removeReaction": "messageReactionRemove",
			"reactionRemove": "messageReactionRemove",
			
			// remove all reactions
			"removeAllReactions": "messageReactionRemoveAll",
		
			// remove reaction emoji
			"removeReactionEmoji": "messageReactioRemoveEmoji",
			
			
			
		/* :: BUTTONS :: */
		
			"button": "interactionCreate",
			"buttonPress": "interactionCreate",
			"buttonPressed": "interactionCreate",
		
		
		
		/* :: SELECT MENUS :: */
		
			"selection": "interactionCreate",
			"select": "interactionCreate",
			"selectMenu": "interactionCreate",
			"submitSelection": "interactionCreate",
			"submitSelectMenu": "interactionCreate",
			"selectSubmit": "interactionCreate",
			"selectMenuSubmit": "interactionCreate",
			"selectionSubmit": "interactionCreate",


		
		/* :: COOLDOWNS :: */

			"cooldown": "onCooldown",
			
			
			
		/* :: INTERACTIONS :: */
		
			// create interaction
			"interaction": "interactionCreate",
			"createInteraction": "interactionCreate",
			"newInteraction": "interactionCreate",
			
			
			
		/* :: VOICE :: */
		
			// voice state update
			"voiceUpdate": "voiceStateUpdate",
			"updateVoice": "voiceStateUpdate",
			"updateVoiceState": "voiceStateUpdate",
			"theVoices": "voiceStateUpdate",
			
			
		
		/* :: THREADS :: */
		
			// create thread
			"newThread": "threadCreate",
			"createThread": "threadCreate",
			
			// update thread
			"updateThread": "threadUpdate",
			"editThread": "threadUpdate",
			"threadEdit": "threadUpdate",
			
			// delete thread
			"deleteThread": "threadDelete",
			
			// thread list sync
			"threadListSync": "threadListSync",
			
			// thread member update
			"threadMemberUpdate": "threadMemberUpdate",
			
			// thread members update
			"threadMembersUpdate": "threadMembersUpdate",
			
			
			
		/* :: STAGES :: */
		
			// create stage
			"newStage": "stageInstanceCreate",
			"createStage": "stageInstanceCreate",
			"stageCreate": "stageInstanceCreate",
			"newStageInstance": "stageInstanceCreate",
			"createStageInstance": "stageInstanceCreate",
			
			
			// update stage
			"updateStage": "stageInstanceUpdate",
			"stageUpdate": "stageInstanceUpdate",
			"updateStageInstance": "stageInstanceUpdate",
			"editStage": "stageInstanceUpdate",
			"stageEdit": "stageInstanceUpdate",
			"editStageInstance": "stageInstanceUpdate",
			
			
			// delete stage
			"deleteStage": "stageInstanceDelete",
			"stageDelete": "stageInstanceDelete",
			"deleteStageInstance": "stageInstanceDelete",
		
		
		
		/* :: INVITES :: */
			
			// create invite
			"invite": "inviteCreate",
			"newInvite": "inviteCreate",
			"createInvite": "inviteCreate",
			
			// delete invite
			"deleteInvite": "inviteDelete",
			
			
			
		/* :: WEBHOOKS :: */
		
			// webhook update
			"updateWebhook": "webhookUpdate",
			"editWebhook": "webhookUpdate",
			"webhookEdit": "webhookUpdate",
		
		
		
		/* :: PRESENCE :: */
		
			// update presence
			"updatePresence": "presenceUpdate",
			"editPresence": "presenceUpdate",
			"presenceEdit": "presenceUpdate",
		
		
		
		/* :: INTEGRATIONS :: */
		
			// update integration
			"updateIntegrations": "guildIntegrationsUpdate",
			"integrationsUpdate": "guildIntegrationsUpdate",
			
			
		/* :: RATE LIMIT/SLOWMODE :: */
		
			"rateLimit": "rateLimit",
			"slowmode": "rateLimit",
			
			
		
		/* :: SHARD :: */
		
			"shardDisconnect": "shardDisconnect",
			"shardError": "shardError",
			"shardReady": "shardReady",
			"shardReconnecting": "shardReconnecting",
			"shardResume": "shardResume",
		
		
		
		/* :: DEBUG :: */
		
			"debug": "debug",
			
			// warn
			"warn": "warn",
			
			// error
			"error": "error",
			
			// invalid request warning
			"invalidRequestWarning": "invalidRequestWarning",
			
			// invalidated
			"invalidated": "invalidated",
			
	};
    
    
    event(name, func) {
		let eventName = (Object.keys(this.eventList).includes(name))
			? this.eventList[name]
		: (Object.values(this.eventList).includes(name))
			? name
		: function() { throw new CoolError("Event Error", "Invalid event name.") }();
		
		let noodName = new Noodle(name);

		if (eventName == "onCooldown") {
			return this.cooldownHandles.push(func)
		}
		
		this.client.on(eventName, function (/**/) {
			if (eventName == "interactionCreate") {
				if (ctx.isButton() && noodName.equalTo("button", "buttonPress", "buttonPressed") ) {
					return func(...Array.from(arguments));
				}
				if (ctx.isStringSelectMenu() && noodName.equalTo("selection", "select", "selectMenu", "submitSelection", "submitSelectMenu", "selectSubmit", "selectMenuSubmit", "selectionSubmit") ) {
					return func(...Array.from(arguments));
				}
				if (ctx.isChatInputCommand() && noodName.equalTo("commandRan", "command") ) {
					return func(...Array.from(arguments));
				}
			}
			return func(...Array.from(arguments));
		});
    }
	on(name, func) { return this.event(name, func); }
	action(name, func) { return this.event(name, func); }


	commandAction(func, func2=null) {
		this.client.on("interactionCreate", async function (ctx) {
			if (ctx.isChatInputCommand()) {
				if (typeof func == "string" && ctx.commandName == func && func2) {
					return await func2(...Array.from(arguments));
				}
				else if (typeof func == "function") {
					return await func(...Array.from(arguments));
				}
			}
		});
	}
	
	
	buttonAction(func, func2=null) {
		this.client.on("interactionCreate", async function (ctx) {
			if (ctx.isButton()) {
				if (typeof func == "string" && ctx.customId == func && func2) {
					return await func2(...Array.from(arguments));
				}
				else if (typeof func == "function") {
					return await func(...Array.from(arguments));
				}
			}
		});
	}
	
	
	selectionAction(func, func2=null) {
		this.client.on("interactionCreate", async function (ctx) {
			if (ctx.isStringSelectMenu()) {
				if (typeof func == "string" && ctx.customId == func && func2) {
					return await func2(...Array.from(arguments));
				}
				else if (typeof func == "function") {
					return await func(...Array.from(arguments));
				}
			}
		});
	}


	selectMenuAction(func, func2=null) {
		this.client.on("interactionCreate", async function (ctx) {
			if (ctx.isStringSelectMenu()) {
				if (typeof func == "string" && ctx.customId == func && func2) {
					return await func2(...Array.from(arguments));
				}
				else if (typeof func == "function") {
					return await func(...Array.from(arguments));
				}
			}
		});
	}
	
	
	rowAction(func, func2=null) {
		this.client.on("interactionCreate", async function (ctx) {
			if (ctx.isButton() || ctx.isStringSelectMenu()) {
				if (typeof func == "string" && ctx.customId == func && func2) {
					return await func2(...Array.from(arguments));
				}
				else if (typeof func == "function") {
					return await func(...Array.from(arguments));
				}
			}
		});
	}


	reaction(message, settings={ emoji:"🧍‍♂️", remove:false }, func) {
		let emoji = (typeof settings == "string") ? settings : settings.emoji;
		
		message.react(emoji);
		
		this.client.on("messageReactionAdd", async (ctx, user) => {
			if (
				user.id == this.client.user.id || 
				ctx.message.id != message.id || 
				ctx._emoji.name != emoji
			) return

			await func(ctx, user);

			if (settings.remove) ctx.users.remove(user.id);
		});
	}


	/* embeds */
	colors = {
		white:"#FFFFFF",
		black:'#000000',
		teal:'#1abc9c',
		dark_teal:'#11806a',
		green:'#2ecc71',
		dark_green:'#1f8b4c',
		blue:'#3498db',
		dark_blue:'#206694',
		purple:'#9b59b6',
		dark_purple:'#71368a',
		magenta:'#e91e63',
		dark_magenta:'#ad1457',
		gold:'#f1c40f',
		dark_gold:'#c27c0e',
		orange:'#e67e22',
		dark_orange:'#a84300',
		red:'#e74c3c',
		dark_red:'#992d22',
		lighter_grey:'#95a5a6',
		dark_grey:'#607d8b',
		light_grey:'#979c9f',
		darker_grey:'#546e7a',
		blurple:'#7289da',
		greyple:'#99aab5',
		clam:'#FF523A',
		dynastio:'#852C34',
		boobie:'#B00B1E',
		fish:'#EA7E00',
		water:'#2F99E3',
		nut:"#FFEC67"
	};
	
	
	colorFormat(hexColor) {
		if (hexColor.startsWith("#")) { var a = hexColor.replace("#", "0x"); return parseInt(a); } else { return 0x5865F2; }
	}
	
	
	Embed = class {
		constructor(obj) {
			if (obj.color) { obj.color = obj.color.colorFormat(); }
			if (obj.author) {
				if (obj.author.icon) { obj.author.icon_url = obj.author.icon; }
				else if (obj.author.iconURL) { obj.author.icon_url = obj.author.iconURL; }
			}
			if (typeof obj.thumbnail == "string") {
				let thumbnail = obj.thumbnail;
				obj.thumbnail = { url: thumbnail };
			}
			if (obj.fields) {
				let fixFields = [];
				
				obj.fields.forEach( (field) => {
					fixFields.push(field);
					if (field.newline) { fixFields.push({ name:"** **", value: "** **", inline: false}); }
				});
	
				obj.fields = fixFields;
			}
			if (typeof obj.image == "string") {
				let image = obj.image;
				obj.image = { url: image };
			}
			if (obj.timestamp) {
				if (obj.timestamp.toLowerCase() == "current" || obj.timestamp.toLowerCase() == "now") obj.timestamp = new Date().toISOString();
			}
			if (obj.footer) {
				if (typeof obj.footer == "string") {
					let footer = obj.footer;
					obj.footer = { text: footer };
				}
				
				if (obj.footer.name) { obj.footer.text = obj.footer.name; }
				if (obj.footer.icon) { obj.footer.icon_url = obj.footer.icon; }
				else if (obj.footer.iconURL) { obj.footer.icon_url = obj.footer.iconURL; }
			}
			
			return obj;
		}
	}


	buttonStyle(style) {
		return (typeof style == "number")
			? style
		: (style.toLowerCase() == "primary")
			? 1
		: (style.toLowerCase() == "secondary")
			? 2
		: (style.toLowerCase() == "success")
			? 3
		: (style.toLowerCase() == "danger")
			? 4
		: (style.toLowerCase() == "link")
			? 5
		: null;
	}


	ActionRow = class {
		constructor(array) {
			return { type: 1, components: array };
		}
	}
	Row = this.ActionRow;


	Button = class {
		constructor(obj) {
			var [wc] = Holder;
			obj.type = 2;
			if (obj.id) {
				obj.custom_id = obj.id;
			}
			if (obj.style) {
				obj.style = wc.buttonStyle(obj.style);
			}
			
			return obj;
		}
	}


	Selection = class {
		constructor(obj) {
			obj.type = 3;
			if (obj.id) {
				obj.custom_id = obj.id;
			}
			if (obj.label || obj.text) {
				obj.placeholder = (obj.label) ? obj.label : obj.text;
			}
			if (obj.minimum || obj.min) {
				obj.min_values = (obj.minimum) ? obj.minimum : obj.min;
			}
			if (obj.maximum || obj.max) {
				obj.max_values = (obj.maximum) ? obj.maximum : obj.max;
			}
	
			return obj;
		}
	}

	SelectMenu = this.Selection;
	
	

	/* fetches */
	fetchUser(id) { if (!id) return null; let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = this.client.users.fetch(mention).catch(e=>{}); return (!user) ? null : user; }
	
	fetchMember(id) { return this.fetchUser(id); }
	
	
	
	fetchGuildUser(id, guild=null) { if (!id) return null; var [wc, client, ctx] = Holder; let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = (guild) ? guild.members.fetch(mention).catch(e=>{}) : ctx.guild.members.fetch(mention).catch(e=>{}); return (!user) ? null : user; }
	
	fetchGuildMember(id, guild=null) { return this.fetchGuildUser(id, guild); }
	
	
	
	fetchChannel(id) { if (!id) return null; let rawChannel = id; if (rawChannel.startsWith('<#') && rawChannel.endsWith('>')) {rawChannel = rawChannel.slice(2, -1); } rawChannel = rawChannel.split("").join(""); let channel = this.client.channels.fetch(rawChannel).catch(e=>{}); return (!channel) ? null : channel; }
	
	fetchGuildChannel(id, guild=null) { if (!id) return null; var [wc, client, ctx] = Holder; let rawChannel = id; if (rawChannel.startsWith('<#') && rawChannel.endsWith('>')) {rawChannel = rawChannel.slice(2, -1); } rawChannel = rawChannel.split("").join(""); let channel = (guild) ? guild.channels.fetch(rawChannel).catch(e=>{}) : ctx.guild.channels.fetch(rawChannel).catch(e=>{}); return (!channel) ? null : channel; }



	fetchRole(id, guild=null) { if (!id) return null; var [wc, client, ctx] = Holder; let rawRole = id; if (rawRole.startsWith('<@') && rawRole.endsWith('>')) {rawRole = rawRole.slice(2, -1); if (rawRole.startsWith('&')) {rawRole = rawRole.slice(1); }} rawRole = rawRole.split("").join(""); let role = (guild) ? guild.roles.fetch(rawRole).catch(e=>{}) : ctx.guild.roles.fetch(rawRole).catch(e=>{}); return (!role) ? null : role; }
	
	fetchGuildRole(id, guild=null) { return this.fetchRole(id, guild); }
	
	
	
	fetchGuild(id) { if (!id) return null; let guild = this.client.guilds.fetch(id).catch(e=>{}); return (!guild) ? null : guild; }



	fetchMessage(id, channel=null) { if (!id) return null; var [wc, client, ctx] = Holder; let message = (channel) ? channel.messages.fetch(id).catch(e=>{}) : ctx.channel.messages.fetch(id).catch(e=>{}); return (!message) ? null : message; }



	fetchReply(message=null) { var [wc, client, ctx] = Holder; let msg = (message) ? message : ctx; let reply = (msg.reference) ? msg.channel.messages.fetch(msg.reference.messageId).catch(e=>{}) : null; return (!reply) ? null : reply; }
	
	
	
	parseEmoji(emoji, fileType=null) {
		if (!emoji) return null;
		var emojiInfo = {};

		if ((emoji.startsWith("<:") || emoji.startsWith("<a:")) && emoji.endsWith(">")) {
			var animated = (emoji.startsWith("<:") || emoji.startsWith(":")) ? false : true;
			
			emoji = emoji.slice(2, -1);
			
			if (emoji.startsWith(":")) { emoji = emoji.split(""); emoji.shift(); emoji = emoji.join(""); }

			if (emoji.includes(":")) {
				emoji = emoji.split(":");

				emojiInfo.name = emoji[0];
				emojiInfo.id = emoji[1];
			}

			emojiInfo.animated = animated
			emojiInfo.url = `https://cdn.discordapp.com/emojis/${emojiInfo.id}.${ 
                (fileType) ? fileType : 
                ((animated) ? "gif" : "png")
            }`;

			return emojiInfo;
		}
	}
	
	
	parseSticker(sticker) {
		if (!sticker) return null;

		let thing = {
			id: sticker.id,
			name: sticker.name,
			description: sticker.description,
			animated: (sticker.format == 2) ? true : false,
			url: `https://cdn.discordapp.com/stickers/${sticker.id}.png`
		};

		return thing;
	}


	
	/* sleeps */
	sleep(time) { return new Promise(resolve => setTimeout(resolve, time*1000)); }
	
	sleepMs(time) { return new Promise(resolve => setTimeout(resolve, time)); }


	
	/* random */
	random = new class {
		number(min, max) {
			return Math.floor(Math.random() * (max - min + 1) ) + min;
		}
		
		int(min, max) { return this.number(min, max); }

		choice(array) {
			return array[Math.floor(Math.random() * (Number(array.length)))];
		}
	}



	/* time */
	time = new class {
		set = new class {
			embed(date) { return new Date(date).toISOString(); }
			default(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}>` }
			shortTime(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:t>` }
			longTime(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:T>` }
			shortDate(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:d>` }
			longDate(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:D>` }
			shortDT(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:f>` }
			longDT(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:F>` }
			relative(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:R>` }
		}
		
		now = new class {
			get embed() { return new Date().toISOString(); }
			get default() { return `<t:${Math.round(new Date().getTime() / 1000)}>` }
			get shortTime() { return `<t:${Math.round(new Date().getTime() / 1000)}:t>` }
			get longTime() { return `<t:${Math.round(new Date().getTime() / 1000)}:T>` }
			get shortDate() { return `<t:${Math.round(new Date().getTime() / 1000)}:d>` }
			get longDate() { return `<t:${Math.round(new Date().getTime() / 1000)}:D>` }
			get shortDT() { return `<t:${Math.round(new Date().getTime() / 1000)}:f>` }
			get longDT() { return `<t:${Math.round(new Date().getTime() / 1000)}:F>` }
			get relative() { return `<t:${Math.round(new Date().getTime() / 1000)}:R>` }
		}
		
		parse(string) {
			if (typeof string != "string") {
				return parseFloat(string);
			}
    		let t = string.split("");
    		let thing = t.pop();
    
    		if (thing == "s") { return parseFloat(t.join("")); }
			else if (thing == "ms") { return parseFloat(t.join(""))*1000; }
    		else if (thing == "m") { return parseFloat(t.join(""))*60; }
    		else if (thing == "h") { return parseFloat(t.join(""))*60*60; }
    		else if (thing == "d") { return parseFloat(t.join(""))*60*60*24; }
    		else if (thing == "w") { return parseFloat(t.join(""))*60*60*24*7; }
    		else if (thing == "y") { return parseFloat(t.join(""))*60*60*24*365; }
    		else { return parseFloat(string); }
		}
		
		format(string) {
    		let t = string.split("");
    		let thing = t.pop();
    
    		if (thing == "s") { return `${t.join("")} seconds`; }
			else if (thing == "ms") { return `${t.join("")} milliseconds`; }
    		else if (thing == "m") { return `${t.join("")} minutes`; }
    		else if (thing == "h") { return `${t.join("")} hours`; }
    		else if (thing == "d") { return `${t.join("")} days`; }
    		else if (thing == "w") { return `${t.join("")} weeks`; }
    		else if (thing == "y") { return `${t.join("")} years`; }
		}
	}
	
	date = this.time;
	times = this.time;
	
	
	
	/* voice */
	voice = new class {
		fetch = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let vcs = await wc.guild.VCs(guild);
			for (let i = 0; i < vcs.length; i++) {
				let channel = vcs[i];

				if (channel.members.has(user.id)) return channel;
			}
			return null;
		}
		
		find(user, func) { return this.fetch(user, func); }
		
		mute = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let channel = await wc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(true);
			}
		}

		unmute = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let channel = await wc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(false);
			}
		}

		deafen = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let channel = await wc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setDeaf(true);
			}
		}

		undeafen = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let channel = await wc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setDeaf(false);
			}
		}

		lockUser = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let channel = await wc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(true);
				vcUser.voice.setDeaf(true);
			}
		}

		unlockUser = async function(user, guild=null) {
			var [wc, client, ctx] = Holder;
			let channel = await wc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(false);
				vcUser.voice.setDeaf(false);
			}
		}
		
		lock = async function(channel, guild=null) {
			var [wc, client, ctx] = Holder;
			let vc = (guild) ? await ctx.guild.channels.fetch(channel.id) : await ctx.guild.channels.fetch(channel.id);
			vc.members.forEach( (user) => {
				user.voice.setMute(true);
				user.voice.setDeaf(true);
			});
		}

		unlock = async function(channel, guild=null) {
			var [wc, client, ctx] = Holder;
			let vc = (guild) ? await ctx.guild.channels.fetch(channel.id) : await ctx.guild.channels.fetch(channel.id);
			vc.members.forEach( (user) => {
				user.voice.setMute(false);
				user.voice.setDeaf(false);
			});
		}
		
		join = async function(channel) {
			voice.joinVoiceChannel({
            	channelId: channel.id,
            	guildId: channel.guild.id,
            	adapterCreator: channel.guild.voiceAdapterCreator
        	});
		}
		
		leave = async function(channel) {
			const connection = voice.getVoiceConnection(channel.guild.id);
			try { connection.destroy(); } catch(err) {}
		}
	}
	
	
	
	/* guild */
	guild = new class {
		memberCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.members(guild);
			return stuff.length;
		}

		userCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.users(guild);
			return stuff.length;
		}

		botCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.bots(guild);
			return stuff.length;
		}
		
		roleCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.roles(guild);
			return stuff.length;
		}

		stuffCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.stuff(guild);
			return stuff.length;
		}
		
		channelCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.channels(guild);
			return stuff.length;
		}

		textChannelCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.textChannels(guild);
			return stuff.length;
		}
		TCCount = async function(guild=null) { return this.textChannelCount(guild); }

		voiceChannelCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.voiceChannels(guild);
			return stuff.length;
		}
		VCCount = async function(guild=null) { return this.voiceChannelCount(guild); }

		threadChannelCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.threadChannels(guild);
			return stuff.length;
		}
		threadCount = async function(guild=null) { return this.threadChannelCount(guild); }

		categoryCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.categories(guild);
			return stuff.length;
		}
		
		emojiCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.emojis(guild);
			return stuff.length;
		}
		
		stickerCount = async function(guild=null) {
			var [wc, cilent, ctx] = Holder;
			let stuff = await wc.guild.stickers(guild);
			return stuff.length;
		}

		members = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.members.fetch());
			else return Soup.from(await guild.members.fetch());
		}

		users = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var members;
			
			if (!guild) members = Soup.from(await ctx.guild.members.fetch());
			else members = Soup.from(await guild.members.fetch());

			return members.filter( (id) => {
				return !wc.fetchUser(id).bot;
			});
		}

		bots = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var members;
			
			if (!guild) members = Soup.from(await ctx.guild.members.fetch());
			else members = Soup.from(await guild.members.fetch());

			return members.filter( (id) => {
				return wc.fetchUser(id).bot;
			});
		}

		roles = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.roles.fetch());
			else return Soup.from(await guild.roles.fetch());
		}

		stuff = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.channels.fetch());
			else return Soup.from(await guild.channels.fetch());
		}

		channels = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type != 4;
			});
		}

		categories = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 4;
			});
		}

		textChannels = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 0;
			});
		}
		TCs = async function(guild=null) { return this.textChannels(guild); }

		voiceChannels = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 2;
			});
		}
		VCs = async function(guild=null) { return this.voiceChannels(guild); }

		threadChannels = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 11;
			});
		}
		threads = async function(guild=null) { return this.threadChannels(guild); }
		
		emojis = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.emojis.fetch());
			else return Soup.from(await guild.emojis.fetch());
		}

		stickers = async function(guild=null) {
			var [wc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.stickers.fetch());
			else return Soup.from(await guild.stickers.fetch());
		}
	}
	server = this.guild;


	reply(content, extras=null) {
		return Fuck();
		async function Fuck() {
			var [wc, client, ctx] = Holder;
			if (content && extras) {
				extras["content"] = content; var message = await ctx.reply(extras);
			}
			else if (typeof content == "object") {
				extras = content; var message = await ctx.reply(extras);
			}
			else {
				var message = await ctx.reply(content, extras);
			}
			if (extras && extras.deleteAfter) {
				setTimeout( () => { message.delete().catch(e=>{}); }, wc.time.parse(extras.deleteAfter)*1000);
			}
			return message;
		}
	}
	
		
	send(content, extras=null) {
		return Fuck();
		
		async function Fuck() {
			var [wc, client, ctx] = Holder;
			if (content && extras) {
				extras["content"] = content; var message = await ctx.channel.send(extras);
			}
			else if (typeof content == "object") {
				extras = content; var message = await ctx.channel.send(extras);
			}
			else {
				var message = await ctx.channel.send(content, extras);
			}
			if (extras && extras.deleteAfter) {
				setTimeout( () => { message.delete().catch(e=>{}); }, wc.time.parse(extras.deleteAfter)*1000);
			}
			return message;
		}
	}
	
	
	
	/* channel */
	channel = new class {
		permissions = new class {
			sync(channel=null) {
				var [wc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.lockPermissions();
				} else {
					channel.lockPermissions();
				}
			}

			set(array, channel=null) {
				var [wc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.permissionOverwrites.set(array);
				} else {
					channel.permissionOverwrites.set(array);
				}
			}

			edit(id, permissions, channel=null) {
				var [wc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.permissionOverwrites.edit(id, permissions);
				} else {
					channel.permissionOverwrites.edit(id, permissions);
				}
			}

			delete(id, channel=null) {
				var [wc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.permissionOverwrites.delete(id);
				} else {
					channel.permissionOverwrites.delete(id);
				}
			}
		}
		
		send(content, extras=null) {
			return Fuck();
			
			async function Fuck() {
				var [wc, client, ctx] = Holder;
				if (content && extras) {
					extras["content"] = content; var message = await ctx.channel.send(extras);
				}
				else if (typeof content == "object") {
					extras = content; var message = await ctx.channel.send(extras);
				}
				else {
					var message = await ctx.channel.send(content, extras);
				}
				if (extras && extras.deleteAfter) {
					setTimeout( () => { message.delete(); }, wc.time.parse(extras.deleteAfter)*1000);
				}
				return message;
			}
		}
		
		purge(amount, channel=null) {
			var [wc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.bulkDelete(amount);
			} else {
				channel.bulkDelete(amount);
			}
		}
		
		lock(channel=null) {
			var [wc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: false });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: false });
			}
		}

		unlock(channel=null) {
			var [wc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: true });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: true });
			}
		}
		
		setSlowmode(time, channel=null) {
			var [wc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.setRateLimitPerUser(time);
			} else {
				channel.setRateLimitPerUser(time);
			}
		}

		removeSlowmode(channel=null) {
			var [wc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.setRateLimitPerUser(0);
			} else {
				channel.setRateLimitPerUser(0);
			}
		}
		noSlowmode(channel=null) { return this.removeSlowmode(channel); }

		async messages(channel=null, limit=100) {
			var [wc, client, ctx] = Holder;
			
			if (!channel) return Soup.from(await ctx.channel.messages.fetch({ limit: limit }));
			else return Soup.from(await channel.members.fetch({ limit: limit }));
		}
	}



	/* users and permissions */
	permissionList = {
		
		/* :: ADMINISTRATOR :: */
			"administrator": "Administrator",
			"admin": "Administrator",
			
			
			
		/* :: MESSAGES :: */
		
			// send messages
			"sendMessages": "SendMessages",
			"send": "SendMessages",
			"message": "SendMessages",
			
			// send tts messages
			"sendTTSMessages": "SendTTSMessages",
			"sendTTS": "SendTTSMessages",
			
			// manage messages
			"manageMessages": "ManageMessages",
			
			
			
		/* :: EMBEDS :: */
		
			// embed links
			"embedLinks": "EmbedLinks",
			"links": "EmbedLinks",
			
			// attach files
			"attachFiles": "AttachFiles",
			"sendFiles": "AttachFiles",
			"files": "AttachFiles",
			
			
		
		/* :: MENTION :: */
		
			"mentionEveryone": "MentionEveryone",
			"pingEveryone": "MentionEveryone",
			"everyone": "MentionEveryone",
			
			
			
		/* :: NICKNAMES :: */
		
			// change nickname
			"changeNickname": "ChangeNickname",
			"changeNick": "ChangeNickname",
			"nickname": "ChangeNickname",
			"nick": "ChangeNickname",
		
			// manage nicknames
			"manageNicknames": "ManageNickname",
			"manageNickname": "ManageNickname",
			"manageNicks": "ManageNickname",
			"manageNick": "ManageNickname",
			"nicknames": "ManageNickname",
			"nicks": "ManageNickname",
		
		
		
		/* :: MEMBERS :: */
		
			// ban members
			"banMembers": "BanMembers",
			"banUsers": "BanMembers",
			"ban": "BanMembers",
			
			// kick members
			"kickMembers": "KickMembers",
			"kickUsers": "KickMembers",
			"kick": "KickMembers",
		
			// moderate members
			"moderateMembers": "ModerateMembers",
			"moderateUsers": "ModerateMembers",
			"moderate": "ModerateMembers",
			
			
		
		/* :: CHANNELS :: */
		
			// manage channel
			"manageChannels": "ManageChannels",
			
			// view channel
			"viewChannel": "ViewChannel",
			
			
		
		/* :: ROLES :: */
			
			"manageRoles": "ManageRoles",
			"roles": "ManageRoles",
			
			
		
		/* :: MESSAGE HISTORY :: */
		
			"readMessageHistory": "ReadMessageHistory",
			"readHistory": "ReadMessageHistory",
			"viewMessageHistory": "ReadMessageHistory",
			"viewHistory": "ReadMessageHistory",
		
			
		
		/* :: GUILD :: */
			
			// manage guild
			"manageGuild": "manageGuild",
			
			// guild insights
			"viewGuildInsights": "ViewGuildInsights",
			"guildInsights": "ViewGuildInsights",
			"insights": "ViewGuildInsights",
			
			
			
			
		/* :: REACTIONS :: */
		
			"addReactions": "AddReactions",
			"reactions": "AddReactions",
			"react": "AddReactions",
			
			
		
		/* :: EMOJIS & STICKERS :: */
			
			// use external emojis
			"useExternalEmojis": "UseExternalEmojis",
			"externalEmojis": "UseExternalEmojis",
			"useEmojis": "UseExternalEmojis",
			
			// manage emojis and stickers
			"manageEmojisAndStickers": "ManageEmojisAndStickers",
			"emojisAndStickers": "ManageEmojisAndStickers",
			
			// manage emojis
			"manageEmojis": "ManageEmojisAndStickers",
			"emojis": "ManageEmojisAndStickers",
			
			// manage stickers
			"manageStickers": "ManageEmojisAndStickers",
			"stickers": "ManageEmojisAndStickers",
		
			
			
			
		/* :: AUDIT LOGS :: */
		
			"viewAuditLog": "ViewAuditLogs",
			"viewLogs": "ViewAuditLogs",
			"auditLogs": "ViewAuditLogs",
			"logs": "ViewAuditLogs",
			
		
		
		/* :: INVITES :: */
			
			"createInvite": "CreateInstantInvite",
			
			
		
		
		/* :: VOICE :: */
		
			// connect
			"connect": "Connect",
			
			// speak
			"speak": "Speak",
			
			// stream
			"stream": "Stream",
			
			// VAD
			"VAD": "UseVAD",
			"useVAD": "UseVAD",
			
			// move members
			"move": "MoveMembers",
			"moveMembers": "MoveMembers",
			"moveUsers": "MoveMembers",
		
			// mute members
			"mute": "MuteMembers",
			"muteMembers": "MuteMembers",
			"muteUsers": "MuteMembers",
			
			// deafean members
			"deafen": "DeafenMembers",
			"deafenMembers": "DeafenMembers",
			"deafenUsers": "DeafenMembers",
			
			// priority speaker
			"prioritySpeaker": "PrioritySpeaker",
			"priority": "PrioritySpeaker",
	
	
		
		/* :: WEBHOOKS :: */
		
			"manageWebhooks": "ManageWebhooks",
			
			
		/* :: Slash Commands :: */
		
			"useApplicationCommands": "UseApplicationCommands",
			"useSlashCommands": "UseApplicationCommands",
			"useCommands": "UseApplicationCommands",
			"applicationCommands": "UseApplicationCommands",
			"slashCommands": "UseApplicationCommands",
			"commands": "UseApplicationCommands",
		
		
		
		/* :: EVENTS :: */
		
			"manageEvents": "ManageEvents",
			"events": "ManageEvents",
		
		
		
		/* :: THREADS :: */
		
			// manage threads
			"manageThreads": "ManageThreads",
			"threads": "ManageThreads",
		
			// create public threads
			"createPublicThreads": "CreatePublicThreads",
			"publicThreads": "CreatePublicThreads",
		
			// create private threads
			"createPrivateThreads": "CreatePrivateThreads",
			"privateThreads": "CreatePrivateThreads",
			
			// send messages in threads
			"sendMessagesInThreads": "SendMessagesInThreads",
			"sendThreadMessages": "SendMessagesInThreads",
			"threadMessages": "SendMessagesInThreads",
			"messageInThreads": "SendMessagesInThreads",
			
			
			
		/* :: ACTIVITIES :: */
		
			"useEmbeddedActivities": "UseEmbeddedActivities",
			"useActivities": "UseEmbeddedActivities",
			"embeddedActivities": "UseEmbeddedActivities",
			"activities": "UseEmbeddedActivities",
			
			
		
		/* :: STAGE :: */
		
			"requestToSpeak": "RequestToSpeak",
	
	};
	
	
	user = new class {
		avatar(user=null, dynamic=false) {
			var [wc, client, ctx] = Holder;
			if (!user) {
				user = (ctx.author) ? ctx.author : ctx.user;
			}
			return user.displayAvatarURL(dynamic);
		}
		avatarUrl(user=null, dynamic=false) { return this.avatar(user, dynamic); }
		avatarURL(user=null, dynamic=false) { return this.avatar(user, dynamic); }
		avatar_url(user=null, dynamic=false) { return this.avatar(user, dynamic); }

		ban(user, extras={reason:null, time:null, deleteTo:null}) {
			var [wc, client, ctx] = Holder;

			if (extras.time) {
				setTimeout( () => {
					ctx.guild.bans.remove(user.id);
				}, wc.time.parse(extras.time)*1000);
			}

			return ctx.guild.bans.create(user.id, {reason: extras.reason, deleteMessageSeconds: wc.time.parse(extras.deleteTo)});
		}
		
		roles = new class {
			cache(user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					user = (ctx.author) ? ctx.author : ctx.user;
				}
				return user.roles.cache;
			}
			
			list(user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					return Array.from(ctx.member.roles.cache, (role) => {
						return role[1].name;
					});
				} else {
					return Array.from(user.roles.cache, (role) => {
						return role[1].name;
					});
				}
			}

			ids(user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					return Array.from(ctx.member.roles.cache, (role) => {
						return role[0];
					});
				} else {
					return Array.from(user.roles.cache, (role) => {
						return role[0];
					});
				}
			}
			
			has(roleId, user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.roles.cache.has(roleId);
				} else {
					return user.roles.cache.has(roleId);
				}
			}

			hasName(name, user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.roles.cache.some(role => role.name == name);
				} else {
					return user.roles.cache.some(role => role.name == name);
				}
			}
		}


		permissions = new class {
			cache(user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.permissions.serialize();
				} else {
					return user.permissions.serialize();
				}
			}

			list(user=null) {
				var [wc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.permissions.toArray();
				} else {
					return user.permissions.toArray();
				}
			}

			has(permissions, user=null) {
				var [wc, client, ctx] = Holder;
				var perms = [];
				
				permissions.forEach( (perm) => {
					let permName = (Object.keys(wc.permissionList).includes(perm))
						? wc.permissionList[perm]
					: (Object.values(wc.permissionList).includes(perm))
						? perm
					: function() { throw new CoolError("Has Permissions", "Permission does not exist.") }();

					perms.push(permName);
				});

				for (let i = 0; i < perms.length; i++) {
					if (!user) {
						if (!ctx.member.permissions.toArray().includes(perms[i])) {
							return false;
						}
					} else {
						if (!user.permissions.toArray().includes(perms[i])) {
							return false;
						}
					}
				}
				return true;
			}
		}

		roleCache(user=null) {
			return this.roles.cache(user);
		}

		roleList(user=null) {
			return this.roles.list(user);
		}

		rolesIds(user=null) {
			return this.roles.ids(user);
		}

		hasRole(roleId, user=null) {
			return this.roles.has(roleId, user);
		}
		
		hasRoleName(name, user=null) {
			return this.roles.hasName(name, user);
		}

		permissionCache(user=null) {
			return this.permissions.cache(user);
		}

		permissionList(user=null) {
			return this.permissions.list(user);
		}

		hasPermissions(permissions, user=null) {
			return this.permissions.has(permissions, user);
		}
		hasPerms(permissions, user=null) { return this.hasPermissions(permissions, user); }
		
		hasPermission(permission, user=null) {
			return this.permissions.has([permission], user);
		}
		hasPerm(permission, user=null) { return this.hasPermission(permission, user); }
	}
	member = this.user;
	author = this.user;
	
	
    /* running */
    run(token) {
        this.client.login(token);
    }
    
    login(token) {
    	this.run(token);
    }
}



function FuckPromises(stupids, func, user=false) {
	var [wc, client, ctx] = Holder;
	var stupidList = [];
	stupids.forEach( (stupid) => {
		stupidList.push( (user) ? wc.fetchUser(stupid.id) : stupid);
	});

	return func(stupidList);
}



class Embed {
	constructor(obj) {
		if (obj.color) { obj.color = obj.color.colorFormat(); }
		if (obj.author) {
			if (obj.author.icon) { obj.author.icon_url = obj.author.icon; }
			else if (obj.author.iconURL) { obj.author.icon_url = obj.author.iconURL; }
		}
		if (typeof obj.thumbnail == "string") {
			let thumbnail = obj.thumbnail;
			obj.thumbnail = { url: thumbnail };
		}
		if (obj.fields) {
			let fixFields = [];
			
			obj.fields.forEach( (field) => {
				fixFields.push(field);
				if (field.newline) { fixFields.push({ name:"** **", value: "** **", inline: false}); }
			});

			obj.fields = fixFields;
		}
		if (typeof obj.image == "string") {
			let image = obj.image;
			obj.image = { url: image };
		}
		if (obj.timestamp) {
			if (obj.timestamp.toLowerCase() == "current" || obj.timestamp.toLowerCase() == "now") obj.timestamp = new Date().toISOString();
		}
		if (obj.footer) {
			if (typeof obj.footer == "string") {
				let footer = obj.footer;
				obj.footer = { text: footer };
			}
			
			if (obj.footer.name) { obj.footer.text = obj.footer.name; }
			if (obj.footer.icon) { obj.footer.icon_url = obj.footer.icon; }
			else if (obj.footer.iconURL) { obj.footer.icon_url = obj.footer.iconURL; }
		}
		
		return obj;
	}
}


class Selection {
	constructor(obj) {
		obj.type = 3;
		if (obj.id) {
			obj.custom_id = obj.id;
		}
		if (obj.label || obj.text) {
			obj.placeholder = (obj.label) ? obj.label : obj.text;
		}
		if (obj.minimum || obj.min) {
			obj.min_values = (obj.minimum) ? obj.minimum : obj.min;
		}
		if (obj.maximum || obj.max) {
			obj.max_values = (obj.maximum) ? obj.maximum : obj.max;
		}

		return obj;
	}
}

var SelectMenu = this.Selection;


function buttonStyle(style) {
	return (typeof style == "number")
		? style
	: (style.toLowerCase() == "primary")
		? 1
	: (style.toLowerCase() == "secondary")
		? 2
	: (style.toLowerCase() == "success")
		? 3
	: (style.toLowerCase() == "danger")
		? 4
	: (style.toLowerCase() == "link")
		? 5
	: null;
}


class ActionRow {
	constructor(array) {
		return { type: 1, components: array };
	}
}

var Row = ActionRow;


class Button {
	constructor(obj) {
		var [wc] = Holder;
		obj.type = 2;
		if (obj.id) {
			obj.custom_id = obj.id;
		}
		if (obj.style) {
			obj.style = buttonStyle(obj.style);
		}
		
		return obj;
	}
}



// Function Maker
class WCFunctionMaker {
    constructor(name, func) {
        var stuff = (func instanceof Function) ? func : function() { return func; }

        Object.defineProperty(stuff, "name", { value: name });
        Object.defineProperty( WillClient.prototype, name, { value: stuff });

        return stuff;
    }
}


Object.defineProperties(WillClient, {
    "Function": { value: WCFunctionMaker }, "function": { value: WCFunctionMaker },
    "Func": { value: WCFunctionMaker }, "func": { value: WCFunctionMaker}
});



// Property Maker
class WCPropertyMaker {
    constructor(name, value, attributes={set:undefined, enumerable:false, configurable:false}) {
        var func = (value instanceof Function) ? value : function() { return value; };
        
        Object.defineProperty(func, "name", { value: name });
        Object.defineProperty(WillClient.prototype, name, {
            get: func,
            set: attributes.set,
            enumerable: attributes.enumerable,
            configurable: attributes.configurable
        });

        return func;
    }
}


Object.defineProperties(WillClient, {
    "Property": { value: WCPropertyMaker }, "property": { value: WCPropertyMaker },
    "Prop": { value: WCPropertyMaker }, "prop": { value: WCPropertyMaker }
});



module.exports = { WillClient, Embed, ActionRow, Row, Button, Selection, SelectMenu, Stew, Soup, Noodle, random, WCFunctionMaker, WCPropertyMaker };
