import { APIEmbed, APIEmbedField, ColorResolvable, Embed, EmbedAuthorOptions, EmbedBuilder, EmbedFooterOptions} from "discord.js";

import client from "./../index";
export class MessageReply {
    public static EMPTY_MESSAGE : string = "";
    protected message : string;
    constructor(message: string) {
        this.message = message;
    }

    public setMessage(message : string) : void{
        this.message = message;
    }

    public getMessage() : string{
        return this.message;
    }
    
}


export class EmbededMessageReply extends MessageReply{
    
    private builder : EmbedBuilder = new EmbedBuilder() 
    
    constructor() {
        super(MessageReply.EMPTY_MESSAGE);
        
        if (client.user?.avatarURL) {
            const str: string = client.user.avatarURL() as string;
            this.setThumbnail(str);
        }
        
    }

    public setColor(color : ColorResolvable) : void{
        this.builder.setColor(color);
    }

    public setTitle(title : string) : void{
        this.builder.setTitle(title);
    }
    public setURL(url : string) : void{
        this.builder.setURL(url);
    }

    
    public setAuthor(data : EmbedAuthorOptions) : void{
        this.builder.setAuthor(data);
    }

    public setDescription(description :string) : void{
        this.builder.setDescription(description);
    }
    public setThumbnail(imageURL : string) : void{
        this.builder.setThumbnail(imageURL);
    }

    public addFields(...fields: APIEmbedField[]) : void{
        this.builder.addFields(fields);
    }

    public setImage(imageURL : string) : void{
        this.builder.setImage(imageURL);
    }

    public setTimestamp() : void{
        this.builder.setTimestamp();
    }

    public setFooter(footer : EmbedFooterOptions) : void{
        this.builder.setFooter(footer);
    }
    
    public build() : APIEmbed {
        return this.builder.data;
    }
}

