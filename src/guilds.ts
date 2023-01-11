import { Guild } from "discord.js"
import client from "./index"


export function getGuilds() : Guild[] {
    const guilds : Guild[] = [];
    client.guilds.cache.forEach((v, k) => guilds.push(v));
    return guilds;
}