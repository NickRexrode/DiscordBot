import { ApplicationCommandOptionData, Client, Colors } from "discord.js";
import { CommandData } from "./../../events/message";
import { EmbededMessageReply } from "./../../message/reply"
import { BaseCommand } from "../command";


const rng_texts : string[]= [
    ":snake: :eyes:",
    ":dart: **Locked In** :dart:",
    ":evergreen_tree: Headed to **Vietnam** :gun:",
    ":dart: **Locked In** :dart:",
    ":rocket: **The Moon** :full_moon:",
    ":chicken: **BBQ Chicken** :poultry_leg:",
    ":chicken: **BBQ Chicken** :poultry_leg:",
    ":microphone2: **Comms Are Dark** :dark_sunglasses:",
    ":microphone2: **Comms Are Dark** :dark_sunglasses:",
    ":skull_crossbones: **Death** :skull_crossbones:"
];

function getRNGBonusText(sum : number) :string{
    //sum between 2 and 20
    const average = Math.floor(sum/2);
    return rng_texts[average-1];

}
function randomNumGen(min:number, max :number) {
    min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export default class RandomNumCommand extends BaseCommand {
    options: ApplicationCommandOptionData[] = [
    ];
    aliases: string[] = ["rng", "random"];
    name: string = "rng";
    description: string = "rng";
    run = async (client: Client<boolean>, data: CommandData): Promise<void> => {
        this.commandData = data;

        const num1 = randomNumGen(1, 10);
        const num2 = randomNumGen(1, 10);
        const sum = num1 + num2;

        const text : string = getRNGBonusText(sum);

        const embed :EmbededMessageReply = new EmbededMessageReply();
        embed.setTitle(`**${num1} x ${num2}**`);
        
        embed.setDescription(text);
        embed.setColor(Colors.Red);
        this.reply(embed);
    };
    constructor(commandData: CommandData) {
        super(commandData);
    }

}