
module.exports = function(app) {
const axios = require('axios');

app.get('/ai/deepseek', async (req, res) => {
        try {
const { text } = req.query;
const { apikey } = req.query;
if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' })
let { data } = await axios.post("https://ai.clauodflare.workers.dev/chat", {
"model": "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
"messages": [{
"role": "user",
"content": text
}]
})
let response = data.data.response.split("</think>").pop().trim().split("<think>")[0].trim()
const result = response
res.status(200).json({
status: true,
result: result
});
} catch (error) {
res.json({ status: false, error: error.message });
}
});
}