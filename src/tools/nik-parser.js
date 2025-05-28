const { nikParser } = require("nik-parser");

async function Nik(nik) {
  if (!nik) throw new Error("NIK tidak boleh kosong");

  const nikk = nikParser(nik);

  const result = {
    valid: nikk.isValid(),
    provinceId: nikk.provinceId(),
    province: nikk.province(),
    kabupatenKotaId: nikk.kabupatenKotaId(),
    kabupatenKota: nikk.kabupatenKota(),
    kecamatanId: nikk.kecamatanId(),
    kecamatan: nikk.kecamatan(),
    kodepos: nikk.kodepos(),
    lahir: nikk.lahir(),
    uniqcode: nikk.uniqcode()
  };

  return result;
}

module.exports = function(app) {
  app.get('/tools/nik-parser', async (req, res) => {
    const { apikey, nik } = req.query;

    // Validasi parameter
    if (!apikey || !nik) {
      return res.status(400).json({ status: false, error: 'Required Parameters!' });
    }

    // Validasi apikey premium
    if (!global.apikeyprem || !global.apikeyprem.includes(apikey)) {
      return res.json({ status: false, error: 'Invalid Api Key, Api Key Must Be Premium!' });
    }

    try {
      const results = await Nik(nik);
      res.status(200).json({
        status: true,
        result: results
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
