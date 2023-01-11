const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database("./playlists.db", (err) => {
    if (err) {
        console.log(err);
    }
    console.log("connceted");
})


const all = db.all("SELECT * FROM songs", (err, rows) => {

    const noDupe = [];
    for (let i = 0; i < rows.length; i++) {

        let isDupe = false;
        for (let j = 0; j < noDupe.length; j++) {
            if (noDupe[j].song_name == rows[i].song_name) {
                isDupe = true;
            }

        }


        if (!isDupe) {

            noDupe.push(rows[i]);
        }
    }
    const under5min = noDupe.filter(s => {
        return s.song_duration < 300 && s.song_duration != 0
    })
    

    console.log(under5min[0]);
    db.run("DELETE FROM songs", (err) => {
        if (err) {
            console.log(err);
        }
        
        under5min.forEach((s) => {
            db.run("INSERT INTO songs VALUES (?,?,?,?,?,?,?)", [s.discord_id, s.song_name, s.song_author, s.song_duration, s.song_url, s.playlist, s.id], function (err) {
                console.log("inserted: " + JSON.stringify(s))
                if (err) {
                    console.log(err);
                }
            })
        })
    })

    console.log(rows.length);
    console.log(noDupe.length)
})

