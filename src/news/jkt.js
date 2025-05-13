const fetch = require("node-fetch");

async function jkt48() {
    const anu = await fetch(`https://api.siputzx.my.id/api/berita/jkt48`);
    const b = await anu.json();

    return {
        status: true,
        creator: global.creator || 'Rizki',
        result: b.data
    };
}

module.exports = function (app) {
    app.get('/berita/jkt48', async (req, res) => {
        try {
            const { apikey } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });

            const results = await jkt48();
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
