import { Interaction, Message, PartialTextBasedChannelFields, User, CommandInteraction } from "discord.js";
import { handleCommand } from "./../commands/command";
import { removePrefix } from "./../config/prefix";


export interface CommandData {
    channel_id : string;
    channel : PartialTextBasedChannelFields;
    author_id : string;
    author: User;
    author_name : string;
    args : string[];
    message: Message | CommandInteraction;
}


async function getMessageFromInteraction(interaction : CommandInteraction) : Promise<Message | null> {
    return await new Promise(async(resolve, reject) => {
        if (interaction.channel?.messages == null) {
            resolve(null);
        }
        try {
            const a = await interaction.fetchReply();

            const message : Message = (await interaction.channel?.messages.fetch(a.id)) as Message
            resolve(message);
        } catch (err) {

            resolve(null);
        }
    })
}
  /**
     * Refactor this to run on every message.  Get prefix command and args, then check prefix is valid, command exists, run command with args.
     * @param data 
     * @returns 
     */
export async function getCommandData (data : Message| CommandInteraction) :Promise<CommandData | any>{
    let channel_id : string; 
    let channel : PartialTextBasedChannelFields;
    let author_id : string;
    let author: User;
    let author_name : string;

    let args : string[];
    let message : Message;

    if (data instanceof Message) {
        const str :string= removePrefix(data.content);

        channel_id= data.channel.id;
        channel = data.channel;
        author_id= data.author.id;
        author= data.author;
        author_name =data.author.tag ;
        args= str.split(" ");
        message = data;
        return {
            channel_id,
            channel,
            author_id,
            author,
            author_name,
            args,
            message
        }
    }
    if (data instanceof CommandInteraction) {
        if (!data.channel?.id) {
            return null as any;
        }
        channel_id = data.channel.id;
        let channel : PartialTextBasedChannelFields = data.channel;
        let author_id : string = data.user.id;
        let author: User =  data.user;
        let author_name : string = data.user.tag;
        let args : string[] = [];

        let m = await getMessageFromInteraction(data);

        if (m == null) {
            return null as any;
        }
        let message : Message = (await getMessageFromInteraction(data)) as Message;



        args.push(data.commandName);

        const songargs : string= data.options.data[0].value as string;
        args.push(...songargs.split(" "));
        return {
            channel_id,
            channel,
            author_id,
            author,
            author_name,
            args,
            message
        }
    }

    return null as any;



}




export async function messageCreate(message :Message) : Promise<void>{
    const commandData : CommandData =  await getCommandData(message);

    if (message.author.bot) {
        return;
    }
    if (commandData == null) {
        return;
    }

    handleCommand(commandData);
}

export async function interactionCreate(interaction :Interaction) : Promise<void>{
    const commandData : CommandData =  await getCommandData(interaction as CommandInteraction);

    if (commandData == null) {
        return;
    }

    handleCommand(commandData);
}

