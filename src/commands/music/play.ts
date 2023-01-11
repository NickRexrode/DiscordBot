import { ApplicationCommandOptionData, ApplicationCommandOptionType, Client, GuildMember, VoiceBasedChannel } from "discord.js";
import { searchForSong, Song } from "./../../music/song";
import { CommandData } from "./../../events/message"
import { EmbededMessageReply, MessageReply } from "./../../message/reply"
import { BaseCommand } from "./../command";
import client from "./../../index";
import { getOrCreateQueue, Queue, removeQueue } from "./../../music/queue";
import ytdl from "ytdl-core";
import fs from "fs"
import {joinVoiceChannel, createAudioResource, createAudioPlayer} from "@discordjs/voice"
import path from "path";

import * as Voice from "@discordjs/voice"
import { EmbededErrorMessage, respondWithError, Severity } from "./../../message/error";




/**
 *  {
      "type": "rich",
      "title": "",
      "description": "",
      "color": 0x661395,
      "fields": [
        {
          "name": `views:`,
          "value": `**views**`
        },
        {
          "name": `duration`,
          "value": `**duration**`
        }
      ],
      "thumbnail": {
        "url": `https://i.ytimg.com/vi/UsR08cY8k0A/hqdefault.jpg`,
        "height": 0,
        "width": 0
      },
      "author": {
        "name": `JVKE - golden hour (Official Lyric Video)`,
        "url": `https://youtube.com/watch?v=UsR08cY8k0A`
      },
      "footer": {
        "text": `JVKE`,
        "icon_url": `https://youtube.com/channel/UCSOfUqPoqpp5aWDDnAyv94g`
      }
    }
 */



function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function generateEmbed(song: Song): EmbededMessageReply {
    const embed: EmbededMessageReply = new EmbededMessageReply();

    embed.setAuthor({ name: `${song.title}`, url: song.url });
    embed.setColor(0x661395);
    if (client.user?.avatarURL) {
        const str: string = client.user.avatarURL() as string;
        embed.setThumbnail(str);
    }

    embed.setFooter({ text: song.author })
    embed.addFields(...[
        { name: `Views: `, value: `**${numberWithCommas(song.views)}**`, inline: true },
        { name: `Duration: `, value: `**${song.timestamp}**`, inline: true }
    ]
    );
    embed.setImage(song.image);

    return embed;
}

export async function download(url : string, guild_id : string) {
    return await new Promise((resolve, reject) => {
        try {
        const dl = ytdl(url, {
            // liveBuffer : 60000,
            // highWaterMark : 1000000,
            // dlChunkSize: 0,
            quality: "highestaudio",
        });
        dl.pipe(fs.createWriteStream(path.join(__dirname, guild_id+".mp3")))
        dl.on('finish', () => {
            resolve(null);
        });
    } catch (e) {
        reject(e);
    }
    } )
    
    
}

export async function play(queue: Queue, data : CommandData) {
    if (queue == null) {
        respondWithError(data, Severity.MEDIUM, "Queue doesn't exist")
        return;
    }
    const song = queue.pop();
    if (song == null) {
        //leave voice, shows over
        
        return;
    }
    
    try {
        await download(song.url, data.message.guild?.id as string);
    } catch (e) {
        respondWithError(data, Severity.HIGH, "Error downloading song")
        return ;
    }



    const author : GuildMember = data.message.guild?.members.cache.get(data.author_id) as GuildMember;
    
    const voiceChannel : VoiceBasedChannel =author.voice.channel as VoiceBasedChannel;

    if (voiceChannel == null) {
        //not in voice channel
		
    	    console.log("voicechannle = null")
    	return;
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId : data.message.guild?.id as string,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    })

    connection.on(Voice.VoiceConnectionStatus.Ready, () => {
       // console.log("Ready")
    })

    connection.on(Voice.VoiceConnectionStatus.Connecting, () => {
       // console.log("Connecting")
    })
    connection.on(Voice.VoiceConnectionStatus.Destroyed, () => {
        //console.log("Destroyed")
    })
    connection.on(Voice.VoiceConnectionStatus.Disconnected, () => {
       // console.log("Disconnected")
    })
    connection.on(Voice.VoiceConnectionStatus.Signalling, () => {
        //console.log("Signalling")
    })



    const audioPlayer = createAudioPlayer();
    const audioResource = createAudioResource(path.join(__dirname, data.message.guild?.id+".mp3"), {inlineVolume:true });
    // = createAudioResource(ytdl(song.url, {
    //    quality: "highestaudio",
    // }))

    const subscription = connection.subscribe(audioPlayer);

    audioPlayer.on(Voice.AudioPlayerStatus.AutoPaused , () => {
        //console.log("AutoPaused")
    })
    audioPlayer.on(Voice.AudioPlayerStatus.Buffering , () => {
        //console.log("Buffering")
    })
    audioPlayer.on(Voice.AudioPlayerStatus.Idle , () => {
       // console.log("Idle")
        queue.currentlyPlaying = null;
        if (queue.isEmpty()) {
            //leave channel 
            connection.disconnect();
            audioPlayer.stop();
            removeQueue(data.message.guild?.id as string);
        } else {
            play(queue, data)
        }
        
    })
    audioPlayer.on(Voice.AudioPlayerStatus.Paused , () => {
       // console.log("Paused")
    })
    audioPlayer.on(Voice.AudioPlayerStatus.Playing , () => {
       // console.log("Playing")
        queue.currentlyPlaying = song;
    })
    audioPlayer.play(audioResource)







}

export default class PlayCommand extends BaseCommand {
    options: ApplicationCommandOptionData[] = [
        {
            name: "song",
            type: ApplicationCommandOptionType.String,
            description: "play a song"
        }
    ];

    aliases: string[] = ["play", "p"];
    name: string = "play";
    description: string = "play a song";
    run = async (client: Client<boolean>, data: CommandData): Promise<void> => {
        this.commandData = data;
        const search: string = this.commandData.args.slice(1).join(" ")

        
        try {
            const song: Song = await searchForSong(search) as Song;
            if (song == null) {
                this.reply(new MessageReply("I couldn't find that song"));
            }
            song.playlist_uuid = data.author_id; //cant be set in searchForSong
    
            const queue: Queue = getOrCreateQueue(data.message.guild?.id as string);
    
            queue.addSong(song);
            if (queue.currentlyPlaying == null) {
                play(queue, data);
            }
    
            this.reply(generateEmbed(song));
        } catch (e) {
            return;
        }



    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}



