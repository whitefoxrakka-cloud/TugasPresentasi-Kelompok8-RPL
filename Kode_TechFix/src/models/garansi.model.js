// ============================================================
// Model: Garansi
// Atribut: idGaransi, tanggalMulai, tanggalBerakhir, durasi, status
// ============================================================

const { pool } = require('../config/database');

// Garansi.cekMasaGaransi() -> cekMasaGaransi()
// Mengembalikan true bila tanggal hari ini masih dalam masa garansi.
async function cekMasaGaransi(idGaransi) {
  const sql = `
    SELECT id_garansi, tanggal_mulai, tanggal_berakhir, durasi, status
    FROM garansi
    WHERE id_garansi = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [idGaransi]);
  const data = baris[0];
  if (!data) return { ada: false, masihBergaransi: false, data: null };

  const hariIni = new Date();
  const berakhir = new Date(data.tanggal_berakhir);
  return {
    ada: true,
    masihBergaransi: hariIni <= berakhir && data.status === 'aktif',
    data
  };
}

// Garansi.verifikasiGaransi() -> verifikasiGaransi()
async function verifikasiGaransi(idGaransi) {
  const sql = "UPDATE garansi SET status = 'terverifikasi' WHERE id_garansi = ?";
  const [hasil] = await pool.execute(sql, [idGaransi]);
  return hasil.affectedRows;
}

// Garansi.ajukanKlaim() -> ajukanKlaim()
async function ajukanKlaim(idGaransi, keterangan) {
  const sql = "UPDATE garansi SET status = 'klaim diajukan' WHERE id_garansi = ?";
  const [hasil] = await pool.execute(sql, [idGaransi]);
  return { affectedRows: hasil.affectedRows, keterangan };
}

// Garansi.setujuiKlaim() -> setujuiKlaim()
async function setujuiKlaim(idGaransi) {
  const sql = "UPDATE garansi SET status = 'klaim disetujui' WHERE id_garansi = ?";
  const [hasil] = await pool.execute(sql, [idGaransi]);
  return hasil.affectedRows;
}

module.exports = {
  cekMasaGaransi,
  verifikasiGaransi,
  ajukanKlaim,
  setujuiKlaim
};
