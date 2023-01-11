import { ApplicationCommandOptionData, Client, GuildMember, VoiceBasedChannel } from "discord.js";
import { CommandData } from "../../../events/message";
import { BaseCommand } from "../../command";
import { getOrCreateQueue, Queue } from "../../../music/queue";
import { Song } from "../../../music/song";
import {play} from "../play";
import {MessageReply} from "../../../message/reply"

import lilbaby_songs from "./steve.json"; 
import { shuffleArray } from "../group";

export default class LilBabyCommand extends BaseCommand {
    aliases: string[] = ["steve"];
    options: ApplicationCommandOptionData[] = [
    ];

    name: string = "steve";
    description: string = "steve";
    run = async (client: Client<boolean>, data: CommandData): Promise<void> => {

        this.commandData = data;

        const guild_id : string = this.commandData.message.guild?.id as string;

        const queue : Queue = getOrCreateQueue(guild_id);

        const author : GuildMember = data.message.guild?.members.cache.get(data.author_id) as GuildMember;

        const voiceChannel : VoiceBasedChannel =author.voice.channel as VoiceBasedChannel;

        if (voiceChannel == null) {
            //not in channel
            return;
        }

        const songs : Song[] =[]// brads_shitty_lil_baby_music;
        



        shuffleArray(songs);
        songs.forEach(s => queue.addSong(s));

        if (queue.currentlyPlaying == null) {
            play(queue, data);
        }

	    this.reply(new MessageReply("steve"));
    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}

