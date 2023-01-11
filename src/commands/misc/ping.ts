import { ApplicationCommandOptionData, Client } from "discord.js";
import { EmbededErrorMessage, Severity } from "./../../message/error";
import { CommandData } from "./../../events/message"
import { MessageReply } from "./../../message/reply"
import { BaseCommand } from "./../command";



export default class PingCommand extends BaseCommand {
    aliases: string[] = ["ping", "bong"];
    options?: ApplicationCommandOptionData[];
    name : string= "ping";
    
    description: string="ping pong";
    run =  (client: Client<boolean>, data: CommandData) :void  =>{
        this.commandData = data;
        this.reply(new MessageReply("pong1"));

        //this.reply(new EmbededErrorMessage("Type error : jlksadfjklhsdfjklsfadjklsfdajklsfadjklflfsjlkfsj\n\n\nlfjklasdf\nlsfdljksdfjl\nmlfsdjklsdfjkl", Severity.HIGH, data));
    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}