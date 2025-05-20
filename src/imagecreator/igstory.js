const axios = require('axios');

module.exports = function (app) {
    app.get('/imagecreator/igstory', async (req, res) => {
        try {
            const { apikey, username, caption, photo } = req.query;

            if (!global.apikey.includes(apikey)) {
                return res.status(403).json({ status: false, error: 'Apikey invalid' });
            }

            if (!username || !caption || !photo) {
                return res.status(400).json({ status: false, error: 'Parameter `username`, `caption`, dan `photo` wajib diisi' });
            }

            const apiUrl = `https://velyn.biz.id/api/maker/igstory?username=${encodeURIComponent(username)}&caption=${encodeURIComponent(caption)}&photo=${encodeURIComponent(photo)}&APIKEY=velyn`;

            const response = await axios.get(apiUrl, {
                responseType: 'arraybuffer'
            });

            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', 'inline; filename="igstory.jpg"');
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
