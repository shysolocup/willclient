/* :: Discord.PS :: Version 0.4.1 | 01/31/23 :: */

/* Made by nutmeg using elements of the NutFL function library.
	  === https://github.com/TheFlameZEternal/nutfl ===
   
	Note: Blame any weird indents on github lol
	
*/

const { PermissionsBitField } = require('discord.js');
const voice = require('@discordjs/voice');


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
    	
    	handle: function(user=null) {
			var [bot, client, ctx] = Holder;

			user = (user) ? user : ctx.author;
					
        	if (!this.data.has(user.id)) {
            	this.data.add(user.id);
            	
            	setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        	}
    	},
    	
    	fetch: function(user=null) {
			var [bot, client, ctx] = Holder;
			return (this.data.has( (user) ? user.id : ctx.author.id )) ? true : false;
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

		var [name, aliases, time] = [info.name, info.aliases, info.cooldown];
		
		if (!name || typeof name != "string" || name.length <= 0) {
			throw new CoolError("Command Creation", "Invalid command name.\n\nPossible reasons:\n    • doesn't exist\n    • not a string\n    • blank string\n\nActual error stuff:");
		}
		if (this.commandExists(name)) {
			throw new CoolError("Command Creation", "Command with that name already exists.");
		}
		if (info.cooldown) {
			if (typeof info.cooldown != "number") {
				throw new CoolError("Command Creation", "Cooldown has to be an integer (seconds)");
			}
			info.cooldown = {
    			data: new Set(),
    			active: true,
    			time: time,
    			
    			handle: function(user=null) {
					var [bot, client, ctx] = Holder;

					user = (user) ? user : ctx.author;
					
        			if (!this.data.has(user.id)) {
            			this.data.add(user.id);
            			
            			setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        			}
    			},
    			
    			fetch: function(user=null) {
					var [bot, client, ctx] = Holder;
					return (this.data.has( (user) ? user.id : ctx.author.id )) ? true : false;
    			}
			};
		}
        let newCMD = {"info": info, "data": data};
        this.commandList.push(newCMD);
		return newCMD;
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
			cooldown = null;
			onCooldown = false;
			cooldownType = null;
		}
    	
    	cmd.onCooldown = (onCooldown) ? onCooldown : false;
		cmd.cooldownType = (cooldownType) ? cooldownType : null;
		cmd.cooldown = (cooldown) ? cooldown : null;
    	
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
		"newCommand": "applicationCommandCreate",
		"commandCreate": "applicationCommandCreate",
		"createCommand": "applicationCommandCreate",
		"commandDelete": "applicationCommandDelete",
		"deleteCommand": "applicationCommandDelete",
		"commandUpdate": "applicationCommandUpdate",
		"updateCommand": "applicationCommandUpdate",
		"commandEdit": "applicationCommandUpdate",
		"editCommand": "applicationCommandUpdate",
		"newChannel": "channelCreate",
		"createChannel": "channelCreate",
		"deleteChannel": "channelDelete",
		"pin": "channelPinsUpdate",
		"newPin": "channelPinsUpdate",
		"pinsUpdate": "channelPinsUpdate",
		"updatePins": "channelPinsUpdate",
		"updateChannel": "channelUpdate",
		"editChannel": "channelUpdate",
		"channelEdit": "channelUpdate",
		"chanelUpdate": "channelUpdate",
		"debug": "debug",
		"warn": "warn",
		"newEmoji": "emojiCreate",
		"deleteEmoji": "emojiDelete",
		"updateEmoji": "emojiUpdate",
		"editEmoji": "emojiUpdate",
		"emojiEdit": "emojiUpdate",
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
		"removeMember": "guildMemberRemove",
		"memberChunk": "guildMemberChunk",
		"updateMember": "guildMemberUpdate",
		"editMember": "guildMemberUpdate",
		"memberEdit": "guildMemberUpdate",
		"memberUpdate": "guildMemberUpdate",
		"updateGuild": "guildUpdate",
		"editGuild": "guildUpdate",
		"guildEdit": "guildUpdate",
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
		"edit": "messageUpdate",
		"editMessage": "messageUpdate",
		"messageEdit": "messageUpdate",
		"updatePresence": "presenceUpdate",
		"editPresence": "presenceUpdate",
		"presenceEdit": "presenceUpdate",
		"rateLimit": "rateLimit",
		"slowmode": "rateLimit",
		"invalidRequestWarning": "invalidRequestWarning",
		"invalidated": "invalidated",
		"createRole": "roleCreate",
		"newRole": "roleCreate",
		"deleteRole": "roleDelete",
		"updateRole": "roleUpdate",
		"editRole": "roleUpdate",
		"roleEdit": "roleUpdate",
		"newThread": "threadCreate",
		"createThread": "threadCreate",
		"deleteThread": "threadDelete",
		"threadListSync": "threadListSync",
		"threadMemberUpdate": "threadMemberUpdate",
		"threadMembersUpdate": "threadMembersUpdate",
		"updateThread": "threadUpdate",
		"editThread": "threadUpdate",
		"threadEdit": "threadUpdate",
		"typing": "typingStart",
		"updateUser": "userUpdate",
		"editUser": "userUpdate",
		"userEdit": "userUpdate",
		"voiceUpdate": "voiceStateUpdate",
		"updateVoice": "voiceStateUpdate",
		"updateVoiceState": "voiceStateUpdate",
		"updateWebhook": "webhookUpdate",
		"editWebhook": "webhookUpdate",
		"webhookEdit": "webhookUpdate",
		"interaction": "interactionCreate",
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
		"editStage": "stageInstanceUpdate",
		"stageEdit": "stageInstanceUpdate",
		"editStageInstance": "stageInstanceUpdate",
		"deleteStage": "stageInstanceDelete",
		"stageDelete": "stageInstanceDelete",
		"deleteStageInstance": "stageInstanceDelete",
		"newSticker": "stickerCreate",
		"createSticker": "stickerCreate",
		"deleteSticker": "stickerDelete",
		"updateSticker": "stickerUpdate",
		"editSticker": "stickerUpdate",
		"stickerEdit": "stickerUpdate",
		"button": "interactionCreate",
		"buttonPress": "interactionCreate",
		"buttonPressed": "interactionCreate",
		"selection": "interactionCreate",
		"select": "interactionCreate",
		"selectMenu": "interactionCreate",
		"submitSelection": "interactionCreate",
		"submitSelectMenu": "interactionCreate",
		"selectSubmit": "interactionCreate",
		"selectMenuSubmit": "interactionCreate",
		"selectionSubmit": "interactionCreate"
	};
    
    event(name, func) {
		let eventName = (Object.keys(this.eventList).includes(name))
			? this.eventList[name]
		: (Object.values(this.eventList).includes(name))
			? name
		: function() { throw new CoolError("Bot Event", "Invalid event name.") }();
		
		this.client.on(eventName, (ctx) => {
			if (eventName == "interactionCreate") {
				if (ctx.isButton() && (name == "button" || name == "buttonPress" || name == "buttonPressed")) {
					return func(ctx);
				}
				if (ctx.isSelectMenu() && (name == "selection" || name == "select" || name == "selectMenu" || name == "submitSelection" || name == "submitSelectMenu" || name == "selectSubmit" || name == "selectMenuSubmit" || name == "selectionSubmit")) {
					return func(ctx);
				}
			}
			return func(ctx);
		});
    }
	on(name, func=null) { return this.event(name, func); }
	
	buttonAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isButton()) {
				return func(ctx);
			}
		});
	}
	
	selectionAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isSelectMenu()) {
				return func(ctx);
			}
		});
	}
	
	rowAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isButton() || ctx.isSelectMenu()) {
				return func(ctx);
			}
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
	
	Embed(obj) {
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

	ActionRow(array) {
		return { type: 1, components: array };
	}

	Button(obj) {
		obj.type = 2;
		if (obj.id) {
			obj.custom_id = obj.id;
		}
		if (obj.style) {
			obj.style = this.buttonStyle(obj.style);
		}
		
		return obj;
	}

	Selection(obj) {
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
	

	/* fetches and misc */
	fetchUser(id) { let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = this.client.users.cache.get(mention); return (!user) ? null : user; }

	fetchGuildUser(id) { var [bot, client, ctx] = Holder; let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = ctx.guild.members.fetch(mention); return (!user) ? null : user; }

	fetchChannel(id) { let rawChannel = id; if (rawChannel.startsWith('<#') && rawChannel.endsWith('>')) {rawChannel = rawChannel.slice(2, -1); } rawChannel = rawChannel.split("").join(""); let channel = this.client.channels.cache.get(rawChannel); return (!channel) ? null : channel; }

	fetchGuildChannel(id) { var [bot, client, ctx] = Holder; let rawChannel = id; if (rawChannel.startsWith('<#') && rawChannel.endsWith('>')) {rawChannel = rawChannel.slice(2, -1); } rawChannel = rawChannel.split("").join(""); let channel = ctx.guild.channels.fetch(rawChannel); return (!channel) ? null : channel; }

	fetchGuildRole(id) { var [bot, client, ctx] = Holder; let rawRole = id; if (rawRole.startsWith('<@') && rawRole.endsWith('>')) {rawRole = rawRole.slice(2, -1); if (rawRole.startsWith('&')) {rawRole = rawRole.slice(1); }} rawRole = rawRole.split("").join(""); let role = ctx.guild.roles.fetch(rawRole); return (!role) ? null : role; }

	sleep(time) { return new Promise(resolve => setTimeout(resolve, time*1000)); }

	sleepMs(time) { return new Promise(resolve => setTimeout(resolve, time)); }

	/* random */
	random = new class {
		number(min, max) {
			return Math.floor(Math.random() * (max - min + 1) ) + min;
		}

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
	}
	
	
	/* voice */
	voice = new class {
		find(user, func) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						func(channel);
					}
				});
			});
		}
		
		mute(user) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						let vcUser = channel.members.get(user.id);
						vcUser.voice.setMute(true);
					}
				});
			});
		}

		unmute(user) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						let vcUser = channel.members.get(user.id);
						vcUser.voice.setMute(false);
					}
				});
			});
		}

		deafen(user) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						let vcUser = channel.members.get(user.id);
						vcUser.voice.setDeaf(true);
					}
				});
			});
		}

		undeafen(user) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						let vcUser = channel.members.get(user.id);
						vcUser.voice.setDeaf(false);
					}
				});
			});
		}

		lockUser(user) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						let vcUser = channel.members.get(user.id);
						vcUser.voice.setMute(true);
						vcUser.voice.setDeaf(true);
					}
				});
			});
		}

		unlockUser(user) {
			var [bot, client, ctx] = Holder;
			bot.guild.channels( (channels) => {
				channels.forEach( (channel) => {
					if (channel.members.has(user.id) && channel.type == 2) {
						let vcUser = channel.members.get(user.id);
						vcUser.voice.setMute(false);
						vcUser.voice.setDeaf(false);
					}
				});
			});
		}
		
		lock(channel) {
			var [bot, client, ctx] = Holder;
			let vc = client.channels.cache.get(channel.id);
			vc.members.forEach( (user) => {
				user.voice.setMute(true);
				user.voice.setDeaf(true);
			});
		}

		unlock(channel) {
			var [bot, client, ctx] = Holder;
			let vc = client.channels.cache.get(channel.id);
			vc.members.forEach( (user) => {
				user.voice.setMute(false);
				user.voice.setDeaf(false);
			});
		}
		
		join(channel) {
			voice.joinVoiceChannel({
            	channelId: channel.id,
            	guildId: channel.guild.id,
            	adapterCreator: channel.guild.voiceAdapterCreator
        	});
		}
		
		leave(channel) {
			const connection = voice.getVoiceConnection(channel.guild.id);
			try {
				connection.destroy();
			} catch(err) {
				throw new CoolError("Leaving Voice Channel", "Not in channel or cannot leave.");
			}
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

	reply(content, extras=null) {
			return Fuck();
			async function Fuck() {
				var [bot, client, ctx] = Holder;
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
					setTimeout( () => { message.delete(); }, extras.deleteAfter*1000);
				}
				return message;
			}
		}
		
	send(content, extras=null) {
			return Fuck();
			async function Fuck() {
				var [bot, client, ctx] = Holder;
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
					setTimeout( () => { message.delete(); }, extras.deleteAfter*1000);
				}
				return message;
			}
		}
	
	/* channel */
	channel = new class {
		send(content, extras=null) {
			return Fuck();
			async function Fuck() {
				var [bot, client, ctx] = Holder;
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
					setTimeout( () => { message.delete(); }, extras.deleteAfter*1000);
				}
				return message;
			}
		}
		
		purge(amount, channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.bulkDelete(amount);
			} else {
				channel.bulkDelete(amount);
			}
		}
		
		lock(channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: false });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: false });
			}
		}

		unlock(channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: true });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: true });
			}
		}
		
		setSlowmode(time, channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.setRateLimitPerUser(time);
			} else {
				channel.setRateLimitPerUser(time);
			}
		}

		removeSlowmode(channel=null) {
			var [bot, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.setRateLimitPerUser(0);
			} else {
				channel.setRateLimitPerUser(0);
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
	console.log("Commands Enabled");
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
