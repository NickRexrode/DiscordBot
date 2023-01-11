import { Client, PartialTextBasedChannelFields } from "discord.js";
import { Song } from "./song";

const queues : Map<string, Queue>= new Map<string, Queue>();

export function getOrCreateQueue(id: string) : Queue {
    let queue: Queue = queues.get(id) as Queue;

    if (queue == null) {
        queue = new Queue({

        });
        queues.set(id, queue);
    }

    return queue;
}

export function getQueue(id : string) : Queue | void{
    return queues.get(id);
}
export function removeQueue(id: string) {
    queues.delete(id);
}

export enum MODE {
    DEFAULT,
    LOOP,
    SMART
}

export interface QueueOptions {
    max_size? : number;
    mode? : MODE;
    log_channel? : PartialTextBasedChannelFields;
}
export class Queue {

    public max_size : number;

    public mode : MODE;
    public log_channel : PartialTextBasedChannelFields | void;
    private should_log : boolean;

    
    public currentlyPlaying : Song | null = null;
    private songs : Song[] = [];
    constructor(options : QueueOptions) {
        this.max_size = options.max_size || Number.MAX_SAFE_INTEGER;
        this.mode = options.mode || MODE.DEFAULT;
        this.log_channel = options.log_channel;
        this.should_log = true;
        
        if (this.log_channel == null) {
            this.should_log = false;
        }
    }

    public addSong(song : Song) {
        this.songs.push(song);
        //TODO: sendSongToGroupMode(song);
        if (this.should_log) {

        }

    }
    public pop() : Song | void{
        return this.songs.shift();
    }

    public isEmpty() : boolean {
        return this.songs.length == 0;
    }
}


