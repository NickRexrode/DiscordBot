import { ApplicationCommandOptionData, Client, GuildMember, VoiceBasedChannel } from "discord.js";
import { CommandData } from "../../../events/message";
import { BaseCommand } from "../../command";
import { getOrCreateQueue, Queue } from "../../../music/queue";
import { Song } from "../../../music/song";
import {play} from "../play";
import {MessageReply} from "./../../../message/reply"

import lilbaby_songs from "./lilbaby.json"; 
import { shuffleArray } from "../group";
//export const brads_shitty_lil_baby_music : Song[]= lilbaby_songs;

export default class LilBabyCommand extends BaseCommand {
    aliases: string[] = ["lilbaby"];
    options: ApplicationCommandOptionData[] = [
    ];

    name: string = "lilbaby";
    description: string = "brad";
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

        const songs : Song[] = []//brads_shitty_lil_baby_music;
        



        shuffleArray(songs);
        songs.forEach(s => queue.addSong(s));

        if (queue.currentlyPlaying == null) {
            play(queue, data);
        }

	    this.reply(new MessageReply("lil baby"));
    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}

