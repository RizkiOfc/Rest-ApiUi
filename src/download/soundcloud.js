const FormData = require("form-data");
const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://soundcloudmp3.co";

async function downloadSoundCloud(url) {
    try {
        const form = new FormData();
        form.append("url", url);

        const config = {
            headers: {
                ...form.getHeaders(),
            },
        };

        const { data: htmlPage } = await axios.post(`${BASE_URL}/result.php`, form, config);
        const $ = cheerio.load(htmlPage);

        const audioLinkRaw = $(".chbtn").attr("href");
        const audioLink = `${BASE_URL}${audioLinkRaw.replace(/title=([^&]+)/, (match, title) => {
            return `title=${title.replace(/\s+/g, "+")}`;
        })}`;

        const artworkLinkRaw = $(".chbtn2").attr("href");
        const artworkLink = `${BASE_URL}${artworkLinkRaw}`;

        return {
            title: $(".text-2xl").text().trim(),
            audioBase: $("audio source").attr("src"),
            image: artworkLink,
            download: audioLink,
        };
    } catch (error) {
        throw new Error(`Gagal dapetin data: ${error.message}`);
    }
}

module.exports = function (app) {
    app.get('/downloader/soundcloud', async (req, res) => {
        try {
            const { apikey, url } = req.query;

            if (!global.apikey.includes(apikey)) {
                return res.json({ status: false, error: 'Apikey invalid' });
            }

            if (!url) {
                return res.json({ status: false, error: 'Parameter `url` wajib diisi' });
            }

            const result = await downloadSoundCloud(url);

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
