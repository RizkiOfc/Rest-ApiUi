const fetch = require("node-fetch");

async function bratVid(text) {
    const res = await fetch(`https://api.raolprojects.my.id/api/v2/maker/bratvid?text=${encodeURIComponent(text)}`);
    const data = await res.json();
    return {
        status: true,
        creator: 'Rizki',
        result: data.result
    };
}

module.exports = function (app) {
    app.get('/maker/bratvid', async (req, res) => {
        try {
            const { apikey, text } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
            if (!text) return res.json({ status: false, error: 'Parameter `text` wajib diisi' });

            const result = await bratVid(text);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
