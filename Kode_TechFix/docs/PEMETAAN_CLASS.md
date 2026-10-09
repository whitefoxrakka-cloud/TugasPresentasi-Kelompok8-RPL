# Pemetaan Class ke Kode

Dokumen ini memetakan **13 class** pada class diagram laporan TechFix ke
berkas model di folder `src/models/`, lengkap dengan keterkaitan ke
Functional Requirement (FR) dan Use Case (UC).

## 1. Tabel Class -> Model -> FR/UC

| No | Class | Berkas Model | Fungsi Utama (method class) | FR / UC Terkait |
|----|-------|--------------|-----------------------------|-----------------|
| 1 | Pengguna | `src/models/pengguna.model.js` | `login()`, `logout()`, `ubahData()` | FR01 (autentikasi), UC-01 |
| 2 | Pelanggan | `src/models/pelanggan.model.js` | `lihatStatus()`, `setujuiEstimasi()`, `tolakEstimasi()`, `lakukanPembayaran()`, `ajukanKlaimGaransi()` | FR07, FR08, FR10, UC-04/UC-05 |
| 3 | Cabang | `src/models/cabang.model.js` | `lihatDataServis()`, `lihatStok()`, `lihatLaporan()` | FR11, UC-07 |
| 4 | Perangkat | `src/models/perangkat.model.js` | `catatKondisi()`, `lihatRiwayatServis()`, `cekGaransi()` | FR02, FR10 |
| 5 | TiketServis | `src/models/tiketServis.model.js` | `buatTiket()`, `ubahStatus()`, `lihatStatus()`, `tutupTiket()`, `simpanHasilDiagnosis()` | FR02, FR03, FR06, UC-02/UC-03 |
| 6 | Teknisi | `src/models/teknisi.model.js` | `lihatTugas()`, `diagnosaPerangkat()`, `buatEstimasi()`, `ubahStatusServis()`, `catatSukuCadang()` | FR03, FR04, UC-03 |
| 7 | Estimasi | `src/models/estimasi.model.js` | `hitungTotal()`, `setujui()`, `tolak()`, `ubahEstimasi()` | FR03, UC-03 |
| 8 | SukuCadang | `src/models/sukuCadang.model.js` | `tambahStok()`, `kurangiStok()`, `cekStokMinimum()` | FR05, UC-03 |
| 9 | Stok | `src/models/stok.model.js` | `barangMasuk()`, `barangKeluar()`, `cekStokMinimum()`, `lihatJumlah()` | FR05, FR11, UC-07 |
| 10 | Pembayaran | `src/models/pembayaran.model.js` | `prosesPembayaran()`, `verifikasiPembayaran()`, `cetakInvoice()`, `simpanBukti()` | FR08, UC-05 |
| 11 | Garansi | `src/models/garansi.model.js` | `cekMasaGaransi()`, `verifikasiGaransi()`, `ajukanKlaim()`, `setujuiKlaim()` | FR10, UC-06 |
| 12 | Pemasok | `src/models/pemasok.model.js` | `terimaPesanan()`, `konfirmasiPesanan()` | FR12, UC-08 |
| 13 | PesananPembelian | `src/models/pesananPembelian.model.js` | `buatPesanan()`, `kirimPesanan()`, `konfirmasiPesanan()`, `hitungTotal()` | FR12, UC-08 |

## 2. Alur UC-03 "Mendiagnosis dan Menyusun Estimasi"

Aktor: **Teknisi**. Sistem pendukung: **Layanan Notifikasi**.

| Langkah | Aktivitas | Sequence Message | Kode |
|---------|-----------|------------------|------|
| 1 | Teknisi buka daftar tugas & pilih tiket | `bukaDaftarTugas()` | `tiketController.daftarTugas()` -> `tiketServis.ambilTugasTeknisi()` |
| 2 | Sistem tampilkan detail tiket | `tampilkanDetailTiket()` | `tiketController.detailTiket()` -> `tiketServis.cariByNomor()` |
| 3 | Teknisi isi hasil diagnosis | `simpanHasilDiagnosis()` | `estimasiController.simpanDiagnosis()` -> `tiketServis.simpanHasilDiagnosis()` |
| 4 | Sistem ambil tarif resmi + stok | `ambilTarifDanStok()` | `estimasiService.susunEstimasi()` -> `sukuCadangModel.cariById()`/`cekStokMinimum()` |
| 5 | Sistem hitung estimasi | `hitungEstimasi()` | `estimasiService.hitungEstimasi()` |
| 6 | Teknisi kirim estimasi | `kirimEstimasi()` | `estimasiController.kirimEstimasi()` -> `estimasiModel.tambah()` + `tiketServis.ubahStatus()` |
| 7 | Sistem kirim notifikasi (async) | `kirimNotifikasiEstimasi()` | `notifikasiService.kirimNotifikasiEstimasi()` |
| - | Konfirmasi estimasi terkirim | `konfirmasiEstimasiTerkirim()` | Respons JSON `estimasiController.kirimEstimasi()` |

## 3. Keterkaitan Non-Functional Requirement (NFR)

| Kode | Deskripsi Singkat | Pemenuhan di Kode |
|------|-------------------|-------------------|
| NFR-01 | Respons cepat untuk operasi baca | Query `LIMIT 1` + connection pool (`config/database.js`) |
| NFR-02 | Perhitungan estimasi akurat & cepat | Fungsi murni `hitungEstimasi()` di `estimasiService.js` |
| NFR-07 | Notifikasi tidak memblokir proses | `notifikasiService` berbasis `Promise` + `setTimeout` |
| NFR-09 | Notifikasi terkirim asinkron | Pemanggilan `.then().catch()` tanpa `await` di `estimasiController.js` |

## 4. Struktur Layer

```
routes/  -> controllers/ -> services/ -> models/ -> config/database.js (pool) -> MySQL 8
views/   -> halaman EJS (Bootstrap 5, murni tampilan)
```

> Catatan: Ini adalah *skeleton* dasar. Sebagian method hanya berisi kerangka
> implementasi dan belum diuji end-to-end terhadap basis data sesungguhnya.
