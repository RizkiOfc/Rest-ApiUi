const fetch = require('node-fetch')

async function bing(q) {
    const response = await fetch(`https://api.siputzx.my.id/api/s/bimg?query=${encodeURIComponent(q)}`);
    const anu = await response.json();

    let result = [];

    for (let i = 0; i < anu.data.length; i++) {
        result.push(anu.data[i]);
    }

    return {
        status: true,
        creator: 'Rizki',
        result: result
    };
}

module.exports = function (app) {
    app.get('/search/bingimg', async (req, res) => {
        try {
            const { apikey, q } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
            if (!q) return res.json({ status: false, error: 'Query (q) is required' });

            const results = await bing(q);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
