// ============================================================
// Model: PesananPembelian
// Atribut: idPesanan, tanggalPesanan, status, total
// ============================================================

const { pool } = require('../config/database');

// PesananPembelian.buatPesanan() -> buatPesanan()
async function buatPesanan(data) {
  const { tanggal_pesanan, status, total, id_pemasok } = data;
  const sql = `
    INSERT INTO pesanan_pembelian (tanggal_pesanan, status, total, id_pemasok)
    VALUES (?, ?, ?, ?)`;
  const [hasil] = await pool.execute(sql, [
    tanggal_pesanan,
    status || 'draft',
    total || 0,
    id_pemasok
  ]);
  return hasil.insertId;
}

// PesananPembelian.kirimPesanan() -> kirimPesanan()
async function kirimPesanan(idPesanan) {
  const sql = "UPDATE pesanan_pembelian SET status = 'dikirim' WHERE id_pesanan = ?";
  const [hasil] = await pool.execute(sql, [idPesanan]);
  return hasil.affectedRows;
}

// PesananPembelian.konfirmasiPesanan() -> konfirmasiPesanan()
async function konfirmasiPesanan(idPesanan) {
  const sql = "UPDATE pesanan_pembelian SET status = 'dikonfirmasi' WHERE id_pesanan = ?";
  const [hasil] = await pool.execute(sql, [idPesanan]);
  return hasil.affectedRows;
}

// PesananPembelian.hitungTotal() -> hitungTotal()
// Fungsi murni: menjumlahkan subtotal dari daftar item pesanan.
function hitungTotal(daftarItem) {
  if (!Array.isArray(daftarItem)) return 0;
  return daftarItem.reduce((total, item) => {
    const subtotal = Number(item.harga) * Number(item.jumlah);
    return total + (Number.isFinite(subtotal) ? subtotal : 0);
  }, 0);
}

async function cariById(idPesanan) {
  const sql = 'SELECT * FROM pesanan_pembelian WHERE id_pesanan = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idPesanan]);
  return baris[0] || null;
}

module.exports = {
  buatPesanan,
  kirimPesanan,
  konfirmasiPesanan,
  hitungTotal,
  cariById
};
