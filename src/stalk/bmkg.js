const fetch = require('node-fetch');

async function getBmkg() {
  try {
    const response = await fetch(`https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`);
    const data = await response.json();
    const i = data.Infogempa.gempa; // perbaikan di sini, huruf besar dan tanpa [0]

    const result = {
      tanggal: i.Tanggal,
      jam: i.Jam,
      magnitudo: i.Magnitude,
      kedalaman: i.Kedalaman,
      wilayah: i.Wilayah,
      potensi: i.Potensi,
      dirasakan: i.Dirasakan || null,
      koordinat: i.Coordinates,
      lintang: i.Lintang,
      bujur: i.Bujur,
      shakemap: `https://data.bmkg.go.id/DataMKG/TEWS/${i.Shakemap}`,
      datetime: i.DateTime
    };

    return result;
  } catch (error) {
    console.error('Gagal ambil data BMKG:', error.message);
  }
}

module.exports = function(app) {
app.get('/stalk/bmkg', async (req, res) => {
const { apikey } = req.query;
if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' })   
        try {            
            const results = await getBmkg();  
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}