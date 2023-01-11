import {searchForSong, Song} from "./../src/music/song"


const titles: string[] = [
  "Space Cadet",
  "a lot - 21 savage",
  "armed and dangerous",
  "antidote",
  "money longer",
  "pure water - Mustard",
  "jungle - A boogie",
  "goosebumps - Travis Scott",
  "all of the lights",
  "white iverson",
  "strawberry kush",
  "pick up the phone",
  "ric flair drip",
  "sicko mode",
  "zeze - Kodak black",
  "Till I Collapse",
  "SAD!",
  "Shoota",
  "I need A doctor - Dr. Dre",
  "Bank Account",
  "Topanga",
  "Father stretch my hands pt.1",
  "Mask off",
  "Taking A walk - Trippe Redd",
  "Ballin - Mustard",
  "Plain Jane",
];

const artist = "";

const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

async function searchAll () {
    const songs :Song[] = [];
    for (const title in titles) {
        const s : Song = await searchForSong(titles[title] + " "+artist+ " lyrics") as Song;
        songs.push(s);
        //console.log(titles[title]);
        await timer(500)
    }
    console.log(JSON.stringify(songs));
}


searchAll();

