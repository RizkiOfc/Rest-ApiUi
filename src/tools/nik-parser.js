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


