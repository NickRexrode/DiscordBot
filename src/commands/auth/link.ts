import { ApplicationCommandOptionData, Client } from "discord.js";
import { EmbededErrorMessage, Severity } from "./../../message/error";
import { CommandData } from "./../../events/message"
import { MessageReply } from "./../../message/reply"
import { BaseCommand } from "./../command";
import { postRequest } from "./../../api/api";



export default class LinkCommand extends BaseCommand {
    aliases: string[] = ["link"];
    options?: ApplicationCommandOptionData[];
    name : string= "link";
    
    description: string="Creates a link between your discord and nickrexrode.com";
    run =  async (client: Client<boolean>, data: CommandData) :Promise<void>  =>{
        this.commandData = data;
        console.log("link")
        const postData = {
            discord_id : this.commandData.author_id
        }

        await postRequest("auth/link", postData);
    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}