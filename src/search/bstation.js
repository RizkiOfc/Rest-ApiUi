const axios = require("axios");
const cheerio = require("cheerio");

async function bstation(q) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://www.bilibili.tv/id/search-result?q=${encodeURIComponent(q)}`;
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
                }
            });

            const $ = cheerio.load(data);
            let hasil = [];

            $('.search-card').each((_, el) => {
    const title = $(el).find('.video-card__info-title').text().trim();
    const play = 'https://www.bilibili.tv' + $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src');
    const views = $(el).find('.video-card__info-data span').first().text().trim();
    const description = $(el).find('.video-card__info-desc').text().trim();

    hasil.push({
        title: title || "No Title",
        play,
        image: image || "https://i.ibb.co/Y3qV8Yf/noimage.jpg",
        views: views || "No Views",
        description: description || "No Description"
    });
});

            //if (hasil.length === 0) return resolve({ message: 'Tidak ada hasil yang ditemukan' });

            resolve(hasil.slice(0, Math.max(3, Math.min(5, hasil.length))));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

module.exports = function (app) {
    app.get('/search/bstation', async (req, res) => {
        try {
            const { apikey } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' })
            const { q } = req.query;
            if (!q) return res.json({ status: false, error: 'Query is required' });

            const results = await bstation(q);
            res.status(200).json({
                status: true,
                creator: "Rizki",
                result: results
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
