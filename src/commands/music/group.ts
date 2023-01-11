

import { ApplicationCommandOptionData, Client, GuildMember, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { CommandData } from "./../../events/message";
import { BaseCommand } from "../command";
import * as Voice from "@discordjs/voice"
import { getOrCreateQueue, Queue } from "./../../music/queue";

import {getRequest} from "./../../api/api"
import { Song } from "./../../music/song";
import { play } from "./play";


export interface GroupSong {
    discord_id: string,
    song_name: string,
    song_author: string,
    song_duration: string,
    song_url: string,
    playlist: string,
    id: string 
}

/**
 * Shuffles an array
 * @param {Array} array array to shuffle
 */
 export function shuffleArray(array : any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function convertOldGroupSong(groupSong : GroupSong) : Song {


    const song : Song = {
        uuid: groupSong.id,
        playlist_uuid: groupSong.playlist,
        video_id : groupSong.song_url.replace("https://youtube.com/watch?v=", ""),
        url : groupSong.song_url,
        title : groupSong.song_name,
        image : null as any,
        thumbnail : null as any,
        seconds : parseInt(groupSong.song_duration),
        timestamp : groupSong.song_duration,
        ago : "Unknown",
        views : 0,
        author : "Unknown",
        channel : "Unknown",
    }
    return song;
}

export default class GroupCommand extends BaseCommand {
    options: ApplicationCommandOptionData[] = [
    ];
    aliases: string[] = ["group"];
    name: string = "group";
    description: string = "stop the music";
    run = async (client: Client<boolean>, data: CommandData): Promise<void> => {
        this.commandData = data;
        const guild_id : string = this.commandData.message.guild?.id as string;

        const queue : Queue = getOrCreateQueue(guild_id);
        const connection = Voice.getVoiceConnection(guild_id);

        const author : GuildMember = data.message.guild?.members.cache.get(data.author_id) as GuildMember;

        const voiceChannel : VoiceBasedChannel =author.voice.channel as VoiceBasedChannel;

        if (voiceChannel == null) {
            //not in channel
            return;
        }

        let ids = voiceChannel.members.map(member => member.id);

        var endpoint = "/group?";
        ids.forEach((id, i, array) => {
            endpoint += `${i}=${id}`
            if (i + 1 != array.length) {
                endpoint += "&";
            }
        })
        
        const groupSongs : GroupSong[] = await getRequest(endpoint, null) as GroupSong[];
        
        const songs : Song[] = groupSongs.map((gs) => {
            return convertOldGroupSong(gs);
        })


        shuffleArray(songs);
        songs.forEach(s => queue.addSong(s));

        if (queue.currentlyPlaying == null) {
            play(queue, data);
        }


    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}




