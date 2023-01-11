import { ApplicationCommandOptionData, Client } from "discord.js";
import { CommandData } from "./../../events/message";
import { BaseCommand } from "../command";
import * as Voice from "@discordjs/voice"
import { removeQueue } from "./../../music/queue";
import { MessageReply } from "./../../message/reply";


export default class StopCommand extends BaseCommand {
    options: ApplicationCommandOptionData[] = [
    ];
    aliases: string[] = ["stop"];
    name: string = "stop";
    description: string = "stop the music";
    run = async (client: Client<boolean>, data: CommandData): Promise<void> => {
        this.commandData = data;

        const guild_id : string = this.commandData.message.guild?.id as string;
        const connection = Voice.getVoiceConnection(guild_id);

        if (connection == null) {
            this.reply(new MessageReply(""))
        }
        connection?.destroy();
        removeQueue(guild_id);

    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}

