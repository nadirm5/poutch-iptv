const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/', async (req, res) => {
    const server = req.query.server;
    const user = req.query.user;
    const pass = req.query.pass;
    const m3u = req.query.m3u;
    
    // Mode Xtream
    if (server && user && pass) {
        try {
            const apiUrl = `${server}/player_api.php?username=${user}&password=${pass}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            let channels = [];
            
            if (data.live) {
                data.live.forEach(ch => {
                    channels.push({
                        name: ch.name,
                        url: `${server}/live/${user}/${pass}/${ch.stream_id}.ts`,
                        group: ch.category_name || 'Chaînes'
                    });
                });
            }
            
            if (data.vod) {
                data.vod.forEach(m => {
                    channels.push({
                        name: m.name,
                        url: `${server}/movie/${user}/${pass}/${m.stream_id}.mp4`,
                        group: m.category_name || 'Films'
                    });
                });
            }
            
            res.json(channels);
        } catch(e) {
            res.json({ error: e.message });
        }
    }
    // Mode M3U
    else if (m3u) {
        try {
            const response = await fetch(m3u);
            const content = await response.text();
            const lines = content.split('\n');
            const channels = [];
            
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (line.startsWith('#EXTINF:')) {
                    let name = line.split(',')[1] || 'Chaîne';
                    let url = lines[i+1] ? lines[i+1].trim() : '';
                    if (url && url.startsWith('http')) {
                        channels.push({
                            name: name,
                            url: url,
                            group: 'Chaînes'
                        });
                    }
                }
            }
            res.json(channels);
        } catch(e) {
            res.json({ error: e.message });
        }
    } else {
        res.json({ error: 'Missing parameters' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
