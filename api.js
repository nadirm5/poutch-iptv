const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    
    try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/channels', async (req, res) => {
    const server = "http://binqrzgi.sidiman.com";
    const user = "YWR48WA";
    const pass = "EQU8TG3";
    
    try {
        const apiUrl = `${server}/player_api.php?username=${user}&password=${pass}&action=get_live_streams`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const channels = data.map(ch => ({
            name: ch.name,
            stream_id: ch.stream_id,
            stream_url: `${server}/live/${user}/${pass}/${ch.stream_id}.ts`
        }));
        
        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
