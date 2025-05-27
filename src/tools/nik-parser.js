const { nikParser } = require("nik-parser");

async function Nik(query) {
  const nik = nikParser(query);

  const valid = nik.isValid();
  const provinceId = nik.provinceId();
  const province = nik.province();
  const kabupatenKotaId = nik.kabupatenKotaId();
  const kabupatenKota = nik.kabupatenKota();
  const kecamatanId = nik.kecamatanId();
  const kecamatan = nik.kecamatan();
  const kodepos = nik.kodepos();
  const lahir = nik.lahir();
  const uniqcode = nik.uniqcode();

  return {
    valid: valid,
    provinsi: province,
    provinsiId: provinceId,
    kabupatenId: kabupatenKotaId,
    kabupaten: kabupatenKota,
    kecamatan: kecamatan,
    kecamatanId: kecamatanId,
    kodepos: kodepos,
    lahir: lahir,
    uniqcode: uniqcode
  }
}

module.exports = function(app) {
  app.get('/tools/nik-parser', async (req, res) => {
    const { apikey, query } = req.query;
    if(!global.apikeyprem.includes(apikey)) return res.json({status: false, error: "Apikey invalid"});
    try {
      let anu = await Nik(query);
      res.status(200).json({
        status: true,
        result: anu
      })
    } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
  })
}
