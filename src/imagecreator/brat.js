module.exports = function app (app) {
app.get('/imagecreator/brat', async (req, res) => {
        try {
            const { apikey, text } = req.query
            if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' })
            const pedo = await getBuffer(`https://api.siputzx.my.id/api/m/brat?text=${text}&isAnimated=false&delay=500`)
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}
