import { Client, ChatInputApplicationCommandData, ApplicationCommandDataResolvable, ApplicationCommandOptionData, Base } from "discord.js";
import { CommandData } from "src/events/message";
import { EmbededMessageReply, MessageReply } from "./../message/reply";

import client from "./../index";
import path from "path";
import { getGuilds } from "./../guilds";




export abstract class BaseCommand implements ChatInputApplicationCommandData {
    abstract name: string;
    abstract aliases : string[];
    abstract description: string;
    
    abstract run: (client: Client, data: CommandData) => void;
    abstract options? : ApplicationCommandOptionData[]
    public commandData!: CommandData;
    constructor(commandData: CommandData) {
        this.commandData = commandData;
        
    }

    protected reply(reply: MessageReply | EmbededMessageReply): void {
        if (reply instanceof EmbededMessageReply) {
            this.commandData.channel.send({embeds : [reply.build()]})
        } else if (reply instanceof MessageReply) {
            this.commandData.channel.send(reply.getMessage())
        }



    }

    public getName () : string {
        return this.name;
    }
}

const fs = require("fs")


const getAllFiles = function(dirPath :string, arrayOfFiles: string[]) {
  const files: string[] = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles;
}

 
const COMMANDS : Map<string, any>= new Map();

export async function loadCommands() :Promise<void> {

    let fileList : string[] = [];

    fileList = (await getAllFiles(path.join(__dirname), fileList)).filter(file => {
        return file.endsWith(".ts") && !file.includes("command.ts");
    });
    


    fileList.forEach(async file => {
        const module : any = await import(file);
        
        const command : BaseCommand= new module.default();
        command.aliases.forEach((alias :string) => {
            COMMANDS.set(alias, command);
        })
        //COMMANDS.set(command.getName(), command);
    })

}

export async function postCommands() : Promise<void>{
    console.log("posting");
    const commandsList : ApplicationCommandDataResolvable[] = []

    COMMANDS.forEach((v,k) => {
        if (k == (v as BaseCommand).name) {
            commandsList.push(v as ApplicationCommandDataResolvable);
        }
    })
    // COMMANDS.forEach((v,k) => {
    //     commandsList.push(v as ApplicationCommandDataResolvable);
    // })
    client.application?.commands.set(commandsList);
}

import {REST, Routes} from "discord.js";
const client_id : string = "882111916900753439";
import token from "./../config/token";
const rest = new REST({ version: '10' }).setToken(token);
export async function deleteCommands() : Promise<unknown> {
    const guild_ids : string[] = getGuilds().map(g => g.id);
    const promises : Promise<unknown>[] = [];

    client.application?.commands.set([]);

    // guild_ids.forEach(guild_id => {
    //     console.log(getGuilds().)
        // getGuilds().forEach((guild) => {
        //     console.log(guild.id)
        //     console.log()
        //     guild.commands.cache.forEach((command) => {
        //         console.log("deleting: "+guild.id+ " "+command.name);
        //         promises.push(guild.commands.delete(command));
        //     })

        // })
        // client.guilds.cache.forEach((guild) => {
            

        // })
        // client.application?.commands.cache.forEach((command, key) => {
        //     // const deleteUrl = `${Routes.applicationGuildCommands(client_id, guild_id)}/${command.id}`;
        //     // promises.push(rest.delete(deleteUrl));

        //     promises.push(command.delete());

    
        // })
        
    //})
    return await Promise.all(promises);
}




async function getCommand<T extends BaseCommand>(name : string) :  Promise<T> {
    return COMMANDS.get(name);
}

export async function handleCommand(commandData : CommandData) {

    let command : BaseCommand | null= await getCommand(commandData.args[0]);

    if (command == null) {

        return;
    }

    command.run(client, commandData);
}
