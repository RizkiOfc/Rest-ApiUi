const { nikParser } = require("nik-parser");

async function Nik(nik) {
  const nikk = nikParser(nik);

  let result = [];

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
    });
  return result;
  }

module.exports = function(app) {
app.get('/tools/nik-parser', async (req, res) => {
       const { apikey, query } = req.query
       if (!global.apikeyprem.includes(apikey)) return res.json({ status: false, error: 'Invalid Api Key, Api Key Must Be Premium!' })
        try {
            let anu = await Nik(query)
            res.status(200).json({
                status: true,
                result: anu
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}
