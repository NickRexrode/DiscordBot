import { prefixes } from '../../config.json';


export default prefixes;


export function removePrefix(str : string) {
    return str.replace(getPrefix(str), "");
} 

function getPrefix(str : string) : string {
    for (let i = 0; i < prefixes.length; i++) {
        const prefix : string = prefixes[i];

        if (str.startsWith(prefix)) {
            return prefix;
        }
    }
    return "**ERROR**";
}