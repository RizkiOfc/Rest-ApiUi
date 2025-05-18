const axios = require("axios");

module.exports = function (app) {
    app.get('/video/bratvid', async (req, res) => {
        try {
            const { apikey, text } = req.query;

            if (!global.apikey.includes(apikey)) {
                return res.status(403).json({ status: false, error: 'Apikey invalid' });
            }

            if (!text) {
                return res.status(400).json({ status: false, error: 'Parameter `text` wajib diisi' });
            }

            const videoUrl = `https://api.raolprojects.my.id/api/v2/maker/bratvid?text=${encodeURIComponent(text)}`;
            const response = await axios.get(videoUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'inline; filename="bratvid.mp4"');
            res.send(response.data);
        } catch (err) {
            res.status(500).json({
                status: false,
                creator: global.creator || 'Rizki',
                error: err.message
            });
        }
    });
};
