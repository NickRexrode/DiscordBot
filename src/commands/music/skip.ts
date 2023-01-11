import { ApplicationCommandOptionData, Client } from "discord.js";
import { CommandData } from "./../../events/message";
import { BaseCommand } from "../command";
import { getQueue, Queue } from "./../../music/queue";
import { MessageReply } from "./../../message/reply";
import { play } from "./play";


export default class SkipCommand extends BaseCommand {
    options: ApplicationCommandOptionData[] = [
    ];
    aliases: string[] = ["skip"];
    name: string = "skip";
    description: string = "skip a song";
    run = async (client: Client<boolean>, data: CommandData): Promise<void> => {
        this.commandData = data;
        const guild_id : string = data.message.guild?.id as string;
        const queue : Queue | void = getQueue(guild_id);

        if (queue == null) {
            this.reply(new MessageReply("There is no music playing"))
        }

        play(queue as Queue, data);
    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}

