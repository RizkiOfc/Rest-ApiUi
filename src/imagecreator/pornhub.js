const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function ephoto(text1, text2) {
    const url = 'https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html';

    const initialResponse = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const $ = cheerio.load(initialResponse.data);
    const token = $('input[name=token]').val();
    const buildServer = $('input[name=build_server]').val();
    const buildServerId = $('input[name=build_server_id]').val();

    const formData = new FormData();
    formData.append('text[]', text1);
    formData.append('text[]', text2);
    formData.append('token', token);
    formData.append('build_server', buildServer);
    formData.append('build_server_id', buildServerId);

    const postResponse = await axios.post(url, formData, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Cookie': initialResponse.headers['set-cookie']?.join('; '),
            ...formData.getHeaders()
        }
    });

    const $$ = cheerio.load(postResponse.data);
    const formValueInput = JSON.parse($$('input[name=form_value_input]').val());
    const body = qs.stringify(formValueInput, { arrayFormat: 'brackets' });

    const hasil = await axios.post('https://en.ephoto360.com/effect/create-image', body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': initialResponse.headers['set-cookie'].join('; '),
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': url
        }
    });

    return buildServer + hasil.data.image;
}

module.exports = function (app) {
    app.get('/imagecreator/pornhub', async (req, res) => {
        try {
            const { apikey, text1, text2 } = req.query;

            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
            if (!text1 || !text2) return res.json({ status: false, error: 'Parameter `text1` dan `text2` wajib diisi' });

            const imageUrl = await ephoto(text1, text2);
            const imageBuffer = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', 'inline; filename="pornhub.png"');
            res.send(imageBuffer.data);
        } catch (err) {
            res.status(500).json({
                status: false,
                creator: global.creator || 'Rizki',
                error: err.message
            });
        }
    });
};
