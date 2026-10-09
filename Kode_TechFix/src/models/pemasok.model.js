// ============================================================
// Model: Pemasok
// Atribut: idPemasok, nama, noTelepon, email, alamat
// ============================================================

const { pool } = require('../config/database');

// Pemasok.terimaPesanan() -> terimaPesanan()
// Menandai pesanan pembelian sebagai diterima oleh pemasok.
async function terimaPesanan(idPesanan) {
  const sql = "UPDATE pesanan_pembelian SET status = 'diterima' WHERE id_pesanan = ?";
  const [hasil] = await pool.execute(sql, [idPesanan]);
  return hasil.affectedRows;
}

// Pemasok.konfirmasiPesanan() -> konfirmasiPesanan()
async function konfirmasiPesanan(idPesanan) {
  const sql = "UPDATE pesanan_pembelian SET status = 'dikonfirmasi' WHERE id_pesanan = ?";
  const [hasil] = await pool.execute(sql, [idPesanan]);
  return hasil.affectedRows;
}

async function ambilSemua() {
  const sql = 'SELECT * FROM pemasok ORDER BY nama';
  const [baris] = await pool.execute(sql);
  return baris;
}

async function cariById(idPemasok) {
  const sql = 'SELECT * FROM pemasok WHERE id_pemasok = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idPemasok]);
  return baris[0] || null;
}

module.exports = { terimaPesanan, konfirmasiPesanan, ambilSemua, cariById };
