const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

async function doodS(url) {
  try {
    const formData = new FormData();
    formData.append("video_url", url);

    const headers = {
      headers: {
        ...formData.getHeaders()
      }
    };

    const { data } = await axios.post("https://grabnwatch.com/doods.pro", formData, headers);
    const $ = cheerio.load(data);

    const videoTitle = $("#preview p.h5").text().trim();
    const previewImage = $("#preview img.make-it-fit").attr("src");
    const downloadLink = $("#result a").attr("href");

    return {
      title: videoTitle || "No title found",
      previewImage: previewImage ? `https://img.doodcdn.co${previewImage}` : null,
      downloadLink: downloadLink ? `https://grabnwatch.com${downloadLink}` : null
    };
  } catch (error) {
    throw new Error("Gagal memproses URL Dood.");
  }
}

module.exports = function (app) {
  app.get('/downloader/doods', async (req, res) => {
    try {
      const { apikey, url } = req.query;
      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      if (!url) {
        return res.json({ status: false, error: 'Parameter `url` wajib diisi' });
      }

      const result = await doodS(url);
      res.status(200).json({
        status: true,
        creator: global.creator || 'Rizki',
        result
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        creator: global.creator || 'Rizki',
        error: error.message
      });
    }
  });
};
