const axios = require('axios');
const cheerio = require('cheerio');

async function gore() {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 228);
        axios.get('https://seegore.com/gore/page/' + page)
            .then((res) => {
                const $ = cheerio.load(res.data);
                const link = [];

                $('ul > li > article').each((a, b) => {
                    link.push({
                        title: $(b).find('div.content > header > h2').text(),
                        link: $(b).find('div.post-thumbnail > a').attr('href'),
                        thumb: $(b).find('div.post-thumbnail > a > div > img').attr('src'),
                        view: $(b).find('div.post-thumbnail > div.post-meta.bb-post-meta.post-meta-bg > span.post-meta-item.post-views').text(),
                        vote: $(b).find('div.post-thumbnail > div.post-meta.bb-post-meta.post-meta-bg > span.post-meta-item.post-votes').text(),
                        tag: $(b).find('div.content > header > div > div.bb-cat-links').text(),
                        comment: $(b).find('div.content > header > div > div.post-meta.bb-post-meta > a').text()
                    });
                });

                const random = link[Math.floor(Math.random() * link.length)];

                axios.get(random.link)
                    .then((resu) => {
                        const $$ = cheerio.load(resu.data);
                        const hasel = {
                            title: random.title,
                            source: random.link,
                            thumb: random.thumb,
                            tag: $$('div.site-main > div > header > div > div > p').text(),
                            upload: $$('div.site-main').find('span.auth-posted-on > time:nth-child(2)').text(),
                            author: $$('div.site-main').find('span.auth-name.mf-hide > a').text(),
                            comment: random.comment,
                            vote: random.vote,
                            view: $$('div.site-main').find('span.post-meta-item.post-views.s-post-views.size-lg > span.count').text(),
                            video1: $$('div.site-main').find('video > source').attr('src'),
                            video2: $$('div.site-main').find('video > a').attr('href')
                        };
                        resolve(hasel);
                    }).catch(reject);
            }).catch(reject);
    });
}

module.exports = function (app) {
    app.get('/random/gore', async (req, res) => {
        try {
            const { apikey } = req.query;
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });

            const results = await gore();
            res.status(200).json({
                status: true,
                creator: 'Rizki',
                result: results
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
