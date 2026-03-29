const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    
    const url = "http://binqrzgi.sidiman.com/player_api.php?username=YWR48WA&password=EQU8TG3";
    
    fetch(url)
        .then(r => r.json())
        .then(data => {
            const channels = data.live.map(ch => ({
                name: ch.name,
                url: `http://binqrzgi.sidiman.com/live/YWR48WA/EQU8TG3/${ch.stream_id}.ts`
            }));
            res.json(channels);
        })
        .catch(err => res.json({error: err.message}));
});

app.listen(3000);
