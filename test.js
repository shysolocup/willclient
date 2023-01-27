/* :: Discord.PS :: Version 0.2 | 01/27/23 :: */

/* Made by nutmeg using elements of the NutFL function library.
	  === https://github.com/TheFlameZEternal/nutfl ===
	
*/


Array.prototype.remove = function(int) {
	const [res, o] = [ [], this];
	const length = o.length;
	for (let i = 0; i < length; i++) {
		if (i < int || i > int) { res.push(this.shift()); }
		if (i == int) { this.shift(); }
	}
	return res;
};

String.prototype.colorFormat = function() {
	if (this.startsWith("#")) { var a = this.replace("#", "0x"); return parseInt(a); } else { return 0x5865F2; }
};

Object.defineProperty(String.prototype, "block", {
	get() { return "`"+this+"`" }, set(){}
});

Object.defineProperty(String.prototype, "italic", {
	get() { return `*${this}*`; }, set(){}
});

Object.defineProperty(String.prototype, "bold", {
	get() { return `**${this}**`; }, set(){}
});

Object.defineProperty(String.prototype, "underline", {
	get() { return `__${this}__`; }, set(){}
});

Object.defineProperty(String.prototype, "linethrough", {
	get() { return `~~${this}~~`; }, set(){}
});

Object.defineProperty(String.prototype, "bold", {
	get() { return `**${this}**`; }, set(){}
});

Object.defineProperty(String.prototype, "spoiler", {
	get() { return `||${this}||`; }, set(){}
});

String.prototype.codeBlock = function(language=null) {
	return (language) ? "```"+language+"\n"+this+"```" : "```"+this+"```";
};

class CoolError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}

var Holder;

class PSClient {
    constructor(settings) {this.client=settings.client; this.prefix=settings.prefix}
	
    /* configurations */
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    
    setClient(client) {
        this.client = client;
    }
    
    
    /* variables */
    commandList = [];
	handlerActive = false;
	
	globalCooldown = {
		data: new Set(),
    	active: true,
    	time: 0,
    	
    	handle: function(user) {
        	if (!this.data.has(user.id)) {
            	this.data.add(user.id);
            			
            	setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        	}
    	},
    	
    	fetch: function(user) {
    		return (this.data.has(user.id)) ? true : false;
    	}
	};
	
	setCooldown(time) {
		if (typeof time != "number") {
			throw new CoolError("Global Cooldown", "Cooldown has to be an integer (seconds)");
		}
		this.globalCooldown.time = time;
		this.globalCooldown.active = true;
	}
	
	deleteCooldown() {
		this.globalCooldown.active = false;
	}
    
    
    /* commands */
    command(info={name:null, aliases:null, cooldown:null}, data) {
		if (!this.handlerActive) { this.handlerActive = true; ClientHandler(this, this.client); }
		
		if (!info.name || typeof info.name != "string" || info.name.length <= 0) {
			throw new CoolError("Command Creation", "Invalid command name.\n\nPossible reasons:\n    • doesn't exist\n    • not a string\n    • blank string\n\nActual error stuff:");
		}
		if (this.commandExists(info.name)) {
			throw new CoolError("Command Creation", "Command with that name already exists.");
		}
		if (info.cooldown) {
			if (typeof info.cooldown != "number") {
				throw new CoolError("Command Creation", "Cooldown has to be an integer (seconds)");
			}
			info.cooldown = {
    			data: new Set(),
    			active: true,
    			time: this.cooldown,
    			
    			handle: function(user) {
        			if (!this.data.has(user.id)) {
            			this.data.add(user.id);
            			
            			setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        			}
    			},
    			
    			fetch: function(user) {
    				return (this.data.has(user.id)) ? true : false;
    			}
			};
		}
        let newCMD = {"info": info, "data": data};
        this.commandList.push(newCMD);
		return newCMD;
    }
    
    removeCommand(name) {
    	if (this.commandExists(name)) {
    		let index = commandList.indexOf(name);
    		commandList = commandList.remove(index);
    	} else {
    		throw new CoolError("Remove Command", "Invalid command name.");
    	}
    }

	commandExists(name) {
		var exists;
		try {
        	for (let i = 0; i < this.commandList.length; i++) {
        	    let info = this.commandList[i].info;
        		if (info.name == name || (info.aliases && info.aliases.includes(name)) ) { throw true; }
        	}
        	throw false;
        	
        } catch(has) {
            exists = has;
        }
		
		return exists;
	}
    
    fetchCommand(name, func=null) {
        var index;
        try {
        	for (let i = 0; i < this.commandList.length+1; i++) {
        	    var info = this.commandList[i].info;
        		if (info.name == name || (info.aliases && info.aliases.includes(name)) ) { throw i; }
        	}
        	throw null;
        	
        } catch(has) {
            if (has == null) throw new CoolError("Command Fetch Error", "Invalid command name.");
            else index = has;
        }
        
        let command = this.commandList[index];
        
        let returns = {
            name: command.info.name,
            aliases: command.info.aliases,
            cooldown: command.info.cooldown,
            data: command.data
        };
        
        return (!func) ? returns : func(returns);
    }
    
    fetchCMD(name, func=null) { return this.fetchCommand(name,func); }
    
    executeCommand(name, ctx, cmd) {
    	let command = this.fetchCommand(name);
    	
    	if (command.cooldown && command.cooldown.active) {
    		command.cooldown.handle(ctx.author.id);
    		cooldown = command.cooldown.time;
    	}
    	else if (globalCooldown && globalCooldown.active) {
    		globalCooldown.handle(ctx.author.id);
    		cooldown = globalCooldown.time;
    	}
    	else {
    		cooldown = false;
    	}
    	
    	cmd["cooldown"] = cooldown;
    	
    	return command.data(ctx, cmd);
    }
    
    executeCMD(name, ctx, cmd=null) { return this.executeCommand(name, ctx, cmd); }

	commandFormat(string) {
		let res = {};
		let pos = (this.prefix)
			? string.toLowerCase().indexOf(this.prefix.toLowerCase())
		: 0;
		
		res["name"] = (this.prefix)
			? string.toLowerCase().replace(this.prefix.toLowerCase(), "").split(" ")[pos]
		: string.toLowerCase().split(" ")[pos];
		
		res["args"] = string.split(" ").remove(pos);
		
		return res;
	}

	commandHandler(ctx) {
		if (this.prefix && (!ctx.content.startsWith(this.prefix) || ctx.content.endsWith(this.prefix) && ctx.content.startsWith(this.prefix))) return;
		let cmd = this.commandFormat(ctx.content);
		if (this.commandExists(cmd.name)) {
			this.executeCommand(cmd.name, ctx, cmd);
		}
	}
    
    /* events */
    eventList = {
    	"start": "ready",
    	"run": "ready",
    	"login": "ready",
		"ready": "ready",
		"message": "message",
		"newMessage": "messageCreate",
		"send": "messageCreate",
		"join": "guildMemberAdd",
		"joinGuild": "guildMemberAdd",
		"newMember": "guildMemberAdd",
		"memberAdd": "guildMemberAdd",
		"commandCreate": "applicationCommandCreate",
		"createCommand": "applicationCommandCreate",
		"commandDelete": "applicationCommandDelete",
		"deleteCommand": "applicationCommandDelete",
		"commandUpdate": "applicationCommandUpdate",
		"updateCommand": "applicationCommandUpdate",
		"newChannel": "channelCreate",
		"createChannel": "channelCreate",
		"deleteChannel": "channelDelete",
		"pin": "channelPinsUpdate",
		"newPin": "channelPinsUpdate",
		"updateChannel": "channelUpdate",
		"chanelUpdate": "channelUpdate",
		"debug": "debug",
		"warn": "warn",
		"newEmoji": "emojiCreate",
		"deleteEmoji": "emojiDelete",
		"updateEmoji": "emojiUpdate",
		"error": "error",
		"ban": "guildBanAdd",
		"unban": "guildBanRemove",
		"newGuild": "guildCreate",
		"deleteGuild": "guildDelete",
		"guildUnavailable": "guildUnavailable",
		"updateIntegrations": "guildIntegrationsUpdate",
		"memberAvailable": "guildMemberAvailable",
		"leave": "guildMemberRemove",
		"leaveGuild": "guildMemberRemove",
		"memberRemove": "guildMemberRemove",
		"memberChunk": "guildMemberChunk",
		"updateMember": "guildMemberUpdate",
		"memberUpdate": "guildMemberUpdate",
		"updateGuild": "guildUpdate",
		"invite": "inviteCreate",
		"newInvite": "inviteCreate",
		"createInvite": "inviteCreate",
		"deleteInvite": "inviteDelete",
		"deleteMessage": "messageDelete",
		"removeAllReactions": "messageReactionRemoveAll",
		"removeReactionEmoji": "messageReactioRemoveEmoji",
		"bulkDelete": "messageDeleteBulk",
		"deleteBulk": "messageDeleteBulk",
		"purge": "messageDeleteBulk",
		"reaction": "messageReactionAdd",
		"newReaction": "messageReactionAdd",
		"reactionAdd": "messageReactionAdd",
		"createReaction": "messageReactionAdd",
		"reactionCreate": "messageReactionAdd",
		"Addreaction": "messageReactionAdd",
		"removeReaction": "messageReactionRemove",
		"reactionRemove": "messageReactionRemove",
		"updateMessage": "messageUpdate",
		"updatePresence": "presenceUpdate",
		"rateLimit": "rateLimit",
		"invalidRequestWarning": "invalidRequestWarning",
		"invalidated": "invalidated",
		"createRole": "roleCreate",
		"newRole": "roleCreate",
		"deleteRole": "roleDelete",
		"updateRole": "roleUpdate",
		"newThread": "threadCreate",
		"createThread": "threadCreate",
		"deleteThread": "threadDelete",
		"threadListSync": "threadListSync",
		"threadMemberUpdate": "threadMemberUpdate",
		"threadMembersUpdate": "threadMembersUpdate",
		"updateThread": "threadUpdate",
		"typing": "typingStart",
		"updateUser": "userUpdate",
		"voiceUpdate": "voiceStateUpdate",
		"updateVoice": "voiceStateUpdate",
		"updateVoiceState": "voiceStateUpdate",
		"updateWebhook": "webhookUpdate",
		"interaction": "interaction",
		"createInteraction": "interactionCreate",
		"newInteraction": "interactionCreate",
		"shardDisconnect": "shardDisconnect",
		"shardError": "shardError",
		"shardReady": "shardReady",
		"shardReconnecting": "shardReconnecting",
		"shardResume": "shardResume",
		"newStage": "stageInstanceCreate",
		"createStage": "stageInstanceCreate",
		"stageCreate": "stageInstanceCreate",
		"newStageInstance": "stageInstanceCreate",
		"createStageInstance": "stageInstanceCreate",
		"updateStage": "stageInstanceUpdate",
		"stageUpdate": "stageInstanceUpdate",
		"updateStageInstance": "stageInstanceUpdate",
		"deleteStage": "stageInstanceDelete",
		"stageDelete": "stageInstanceDelete",
		"deleteStageInstance": "stageInstanceDelete",
		"newSticker": "stickerCreate",
		"createSticker": "stickerCreate",
		"deleteSticker": "stickerDelete",
		"updateSticker": "stickerUpdate"
	};
    
    event(name, func=null) {
		let eventName = (Object.keys(this.eventList).includes(name))
			? this.eventList[name]
		: (Object.values(this.eventList).includes(name))
			? name
		: function() { throw new CoolError("Bot Event", "Invalid event name.") }();

		this.client.on(eventName, (ctx) => {
			return func(ctx);
		});
    }
	on(name, func=null) { return this.event(name, func); }

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
	
	embed(obj) {
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
		if (obj.timestamp.toLowerCase() == "current" || obj.timestamp.toLowerCase() == "now") { obj.timestamp = new Date().toISOString(); }
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

	/* misc */
	fetchUser(id) { let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = this.client.users.cache.get(mention); return (!user) ? null : user;
	}
	
	cooldown(time) {
		
	}
	
	/* voice */
	voice = new class {
		mute(user) {
			var [bot, client, ctx] = Holder;
			if (bot.fetchUser(user.id)) {
				return user.setMute(true);
			} else {
				throw new CoolError("Voice", "Invalid user.");
			}
		}
		
		unmute(user) {
			var [bot, client, ctx] = Holder;
			if (bot.fetchUser(user.id)) {
				return user.setMute(false);
			} else {
				throw new CoolError("Voice", "Invalid user.");
			}
		}
		
		deafen(user) {
			var [bot, client, ctx] = Holder;
			if (bot.fetchUser(user.id)) {
				return user.setDeaf(true);
			} else {
				throw new CoolError("Voice", "Invalid user.");
			}
		}
		
		deaf(user) {
			var [bot, client, ctx] = Holder;
			if (bot.fetchUser(user.id)) {
				return user.setDeaf(true);
			} else {
				throw new CoolError("Voice", "Invalid user.");
			}
		}
		
		undeafen(user) {
			var [bot, client, ctx] = Holder;
			if (bot.fetchUser(user.id)) {
				return user.setDeaf(false);
			} else {
				throw new CoolError("Voice", "Invalid user.");
			}
		}
		undeaf(user) {
			var [bot, client, ctx] = Holder;
			if (bot.fetchUser(user.id)) {
				return user.setDeaf(false);
			} else {
				throw new CoolError("Voice", "Invalid user.");
			}
		}
		
		join(channel) {
			return channel.join();
		}
		
		leave(channel) {
			return channel.leave();
		}
	}
	
	/* guild */
	guild = new class {
		get memberCount() {
			var [bot, client, ctx] = Holder; return ctx.guild.memberCount;
		}
		
		get roleCount() {
			var [bot, cilent, ctx] = Holder; return ctx.guild.roles.cache.size;
		}
		
		get channelCount() {
			var [bot, client, ctx] = Holder; return ctx.guild.channels.cache.size;
		}
		
		get emojiCount() {
			var [bot, client, ctx] = Holder; return ctx.guild.emojis.cache.size;
		}
		
		get stickerCount() {
			var [bot, client, ctx] = Holder; return ctx.guild.stickers.cache.size;
		}

		members(func) {
			var [bot, client, ctx] = Holder;
			ctx.guild.members.fetch().then(members => FuckPromises(members, func, true));
		}

		roles(func) {
			var [bot, client, ctx] = Holder;
			ctx.guild.roles.fetch().then(channels => FuckPromises(channels, func));
		}

		channels(func) {
			var [bot, client, ctx] = Holder;
			ctx.guild.channels.fetch().then(channels => FuckPromises(channels, func));
		}

		emojis(func) {
			var [bot, client, ctx] = Holder;
			ctx.guild.emojis.fetch().then(emojis => FuckPromises(emojis, func));
		}

		stickers(func) {
			var [bot, client, ctx] = Holder;
			ctx.guild.stickers.fetch().then(stickers => FuckPromises(stickers, func));
		}
	}
	
	/* channel */
	channel = new class {
		purge(amount, channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				return ctx.channel.bulkDelete(amount);
			} else {
				return channel.bulkDelete(amount);
			}
		}
		
		lock(channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SEND_MESSAGES: false });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SEND_MESSAGES: false });
			}
		}
		
		unlock(channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SEND_MESSAGES: true });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SEND_MESSAGES: true });
			}
		}
	}
	
    /* running */
    run(token) {
        this.client.login(token);
    }
    
    login(token) {
    	this.run(token);
    }
}

function ClientHandler(bot, client) {
	console.log("Handler Enabled");
	client.on("messageCreate", async (ctx) => {
		Holder = [bot, client, ctx];
		bot.commandHandler(ctx);
	});
}

function FuckPromises(stupids, func, user=false) {
	var [bot, client, ctx] = Holder;
	var stupidList = [];
	stupids.forEach( (stupid) => {
		stupidList.push( (user) ? bot.fetchUser(stupid.id) : stupid);
	});

	return func(stupidList);
}

module.exports = { PSClient };
