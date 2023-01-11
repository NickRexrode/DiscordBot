import { generateUUID } from "./../api/api";
import youtube, { SearchResult, VideoSearchResult } from "yt-search";


export interface Song {
    uuid: string
    playlist_uuid: string;
    video_id: string;
    url: string;
    title: string;
    image: string;
    thumbnail: string;
    seconds: number;
    timestamp: string;
    ago: string;
    views: number;
    author: string;
    channel: string;
}


export async function searchForSong(keywords: string): Promise<Song | void> {
    const result: SearchResult = await youtube(keywords);

    const video: VideoSearchResult = result.videos[0];

    const {
        videoId: video_id,
        url,
        title,
        image,
        thumbnail,
        seconds,
        timestamp,
        ago,
        views,
        author }: VideoSearchResult = video;



    const song : Song= {
        uuid: generateUUID(),
        playlist_uuid: "",
        video_id,
        url,
        title,
        image,
        thumbnail,
        seconds,
        timestamp,
        ago,
        views,
        author: author.name,
        channel: author.url
    }

    return song;
} 