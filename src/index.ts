import { token, prefixes } from './../config.json';

import {Client, GatewayIntentBits } from "discord.js";
import { deleteCommands, loadCommands, postCommands } from './commands/command';

//pre

(async () => {

})()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	]
});

import {messageCreate, interactionCreate} from "./events/message"

client.on("interactionCreate", interactionCreate);
client.on("messageCreate", messageCreate);

import {voiceStateChange} from "./events/voice"
// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
client.on("voiceStateUpdate", voiceStateChange);


client.once("ready", async (client) => {
	await loadCommands();
	console.log("loaded");
	await deleteCommands();
	console.log("deleted")
	//await postCommands();
});

client.login(token);

export default client;



