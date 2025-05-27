const { nikParser } = require("nik-parser");

async function Nik(nik) {
  const nikk = nikParser(nik);

  const valid = nikk.isValid();
  const provinceId = nikk.provinceId();
  const province = nikk.province();
  const kabupatenKotaId = nikk.kabupatenKotaId();
  const kabupatenKota = nikk.kabupatenKota();
  const kecamatanId = nikk.kecamatanId();
  const kecamatan = nikk.kecamatan();
  const kodepos = nikk.kodepos();
  const lahir = nikk.lahir();
  const uniqcode = nikk.uniqcode();

  return {
    result.push({
      valid,
      provinceId,
      province,
      kabupatenKotaId,
      kabupatenKota,
      kecamatanId,
      kecamatan,
      kodepos,
      lahir,
      uniqcode
    })
  }
}

module.exports = function(app) {
  app.get('/tools/nik-parser', async (req, res) => {
    const { apikey, nik } = req.query;
    if(!global.apikeyprem.includes(apikey)) return res.json({status: false, error: "Apikey invalid"});
    try {
      let anu = await Nik(nik);
      res.status(200).json({
        status: true,
        result: anu
      })
    } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
  })
}
