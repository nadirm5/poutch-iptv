const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy pour Xtream API
app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'URL required' });
    
    try {
        const response = await fetch(url);
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy pour streams
app.get('/stream', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'URL required' });
    
    try {
        const response = await fetch(url);
        res.setHeader('Content-Type', response.headers.get('content-type'));
        response.body.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
