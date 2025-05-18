const axios = require("axios");
const cheerio = require("cheerio");

async function halodoc(query) {
    try {
        const ress = await axios.get(`https://www.halodoc.com/artikel/search/${encodeURIComponent(query)}`);
        const $ = cheerio.load(ress.data);
        const hasil = [];

        $('.article-card.default-view').each((index, element) => {
            const judul = $(element).find('header a').text().trim();
            const tautan = `https://www.halodoc.com${$(element).find('header a').attr('href')}`;
            const deskripsi = $(element).find('.description').text().trim();
            const kategori = $(element).find('.tag-container a').map((i, el) => $(el).text().trim()).get();
            const gambar = $(element).find('.hd-base-image-mapper__img').attr('src');
            hasil.push({ judul, tautan, deskripsi, kategori, gambar });
        });

        return hasil;
    } catch (err) {
        throw new Error("Gagal mengambil data dari Halodoc.");
    }
}

module.exports = function (app) {
    app.get('/search/halodoc', async (req, res) => {
        try {
            const { apikey, q } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
            if (!q) return res.json({ status: false, error: 'Parameter `q` wajib diisi' });

            const result = await halodoc(q);

            if (!result.length) {
                return res.json({ status: false, message: 'Tidak ada artikel ditemukan' });
            }

            res.status(200).json({
                status: true,
                creator: global.creator || 'Rizki',
                result
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                creator: global.creator || 'Rizki',
                error: err.message
            });
        }
    });
};
