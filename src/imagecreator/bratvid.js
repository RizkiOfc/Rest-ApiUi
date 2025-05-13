const fetch = require("node-fetch");

module.exports = function (app) {
    app.get('/imagecreator/bratvid', async (req, res) => {
        try {
            const { apikey, text } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
            if (!text) return res.json({ status: false, error: 'Parameter `text` wajib diisi' });

            const url = `https://api.raolprojects.my.id/api/v2/maker/bratvid?text=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            const buffer = await response.buffer();

            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'inline; filename="bratvid.mp4"');
            res.send(buffer);
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
