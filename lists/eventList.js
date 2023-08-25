let eventList = {

	
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

}

module.exports = { eventList }
