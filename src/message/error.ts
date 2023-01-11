import { ColorResolvable, Colors } from "discord.js";
import client from "./../index";
import { CommandData } from "./../events/message";
import { EmbededMessageReply } from "./reply";

/*
Refactor this section
*/

export enum Severity {
    NONE,
    LOW,
    MEDIUM,
    HIGH
}

function getColor(severity : Severity) : ColorResolvable {
    switch (severity) {
        case Severity.LOW:
            return Colors.Green;
        case Severity.MEDIUM:
            return Colors.Yellow;
        case Severity.HIGH:
            return Colors.Red;
    }
    return Colors.Green;
}

function getTitleMessage(severity : Severity) : string {
    switch (severity) {
        case Severity.LOW:
            return "Something went wrong, try it again";
        case Severity.MEDIUM:
            return "Something went wrong, check your syntax";
        case Severity.HIGH:
            return "An error has occured";
    }
    return "Something went wrong, try it again";
}

export class EmbededErrorMessage extends EmbededMessageReply {
    constructor(errorMessage : string, severity : Severity, data : CommandData) {
        super();
        this.setColor(getColor(severity));
        this.setTitle(getTitleMessage(severity));
        const command : string= data.args[0];
        this.setDescription("**Command:** "+command);
        this.addFields({
            name: "Error Message:",
            value: errorMessage,
            inline: false
        })


        this.setFooter({
            text: data.author_name
        })
    }
}


export function respondWithError(data :CommandData, severity :Severity, message :string) {
    const error :EmbededErrorMessage = new EmbededErrorMessage(message, severity, data);
    data.message.reply({embeds: [error.build()]})

}