const axios = require("axios");
const cheerio = require("cheerio");

async function getItch(t, s) {
    const url = `https://itch.io/search?type=${t}&q=${encodeURIComponent(s)}`;
    const { data } = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
        }
    });

    const $ = cheerio.load(data);
    const result = [];

    $('.game_cell_data').each((_, el) => {
        const title = $(el).find('a').text().trim();
        const link = $(el).find('a').attr('href');
        const gameText = $(el).find('.game_text').attr('title');
        const linkAuthor = $(el).find('.game_author a').attr('href');
        const author = $(el).find('.game_author a').text().trim();
        const rating = $(el).find('.star_value > span').text().trim() || 'Tidak Ada Rating.';

        result.push({
            type: t,
            title,
            link,
            gameText,
            linkAuthor,
            author,
            rating
        });
    });

    return result;
}

module.exports = function (app) {
    app.get('/search/itch', async (req, res) => {
        try {
            const { apikey, type, q } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
            if (!type || !q) return res.json({ status: false, error: 'Parameter `type` dan `q` wajib diisi' });

            const results = await getItch(type, q);
            if (!results.length) return res.json({ status: false, message: 'Tidak ada hasil yang ditemukan' });

            res.status(200).json({
                status: true,
                creator: 'Rizki',
                result: results
            });
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
