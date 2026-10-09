// ============================================================
// Service: notifikasiService
// Simulasi pengiriman notifikasi asynchronous kepada pelanggan.
// Terkait UC-03 langkah 7 (kirimNotifikasiEstimasi) dan FR09.
// NFR-07/NFR-09: proses berjalan tanpa memblokir respons ke pengguna.
// ============================================================

// kirimNotifikasiEstimasi(pelanggan, estimasi)
// Mengembalikan Promise yang selesai setelah jeda singkat,
// meniru pemanggilan layanan notifikasi eksternal (email/WhatsApp).
function kirimNotifikasiEstimasi(pelanggan, estimasi) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nama = pelanggan && pelanggan.nama ? pelanggan.nama : 'Pelanggan';
      const nomor = estimasi && estimasi.nomorTiket ? estimasi.nomorTiket : '-';
      const total = estimasi && estimasi.totalBiaya ? Number(estimasi.totalBiaya) : 0;

      const pesan =
        `[TechFix] Halo ${nama}, estimasi servis untuk tiket ${nomor} ` +
        `adalah Rp${total.toLocaleString('id-ID')}. Mohon lakukan persetujuan.`;

      console.log('[NOTIFIKASI ASYNC]', pesan);

      resolve({
        terkirim: true,
        waktu: new Date().toISOString(),
        pesan
      });
    }, 300);
  });
}

// kirimNotifikasiStatus(pelanggan, nomorTiket, status)
// Notifikasi ringan saat status tiket berubah.
function kirimNotifikasiStatus(pelanggan, nomorTiket, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nama = pelanggan && pelanggan.nama ? pelanggan.nama : 'Pelanggan';
      const pesan = `[TechFix] Halo ${nama}, status tiket ${nomorTiket} kini: ${status}.`;
      console.log('[NOTIFIKASI STATUS]', pesan);
      resolve({ terkirim: true, waktu: new Date().toISOString(), pesan });
    }, 200);
  });
}

module.exports = { kirimNotifikasiEstimasi, kirimNotifikasiStatus };
