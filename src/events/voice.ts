import { Channel, ChannelType, GuildMember, VoiceChannel, VoiceState } from "discord.js";
import client from "src";

export function voiceStateChange(oldState :VoiceState, newState :VoiceState) {
    
    // if (oldState.channel && !newState.channel) {


    //     // The user has left a voice channel
    //     console.log(`${oldState.member?.displayName} has left the voice channel.`);

    //     client.channels.cache.forEach((channel :Channel) => {
    //         if (channel.type == ChannelType.GuildVoice) {

    //         }
    //     })
       
    //     //find channel 
    //     if (size == 0) {
    //         connection.disconnect();
    //         audioPlayer.stop();
    //         removeQueue(data.message.guild?.id as string);
    //     }
    //   }
}

function getNonBotSize(vc :VoiceChannel) :number {
    return vc.members.filter((member: GuildMember) => {
        return !member.user.bot
    }).size // # of people in voice channel that are not bots

}