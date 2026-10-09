# Laporan Cek Konsistensi — Tugas Presentasi RPL (TechFix)

Dokumen: **RPL.docx** — *Sistem Manajemen Servis Gadget "TechFix"*
Diperiksa terhadap: `Pertemuan 6 - Tugas_Presentasi_RPL.pdf` (8 poin tugas + rubrik penilaian)

---

## 1. Peta 8 poin tugas → isi laporan

| # | Tugas (Pertemuan 6) | Status | Letak di RPL.docx |
|---|---------------------|--------|-------------------|
| 1 | Menentukan Tema dan Studi Kasus | ✅ | BAB I (1.1 Study Kasus, 1.2 Identifikasi Masalah, 1.3 Tujuan, 1.4 Ruang Lingkup) |
| 2 | Membuat SRS (FR/NFR, aktor, batasan, asumsi) | ✅ | BAB II (2.1–2.7): **12 FR**, **9 NFR**, 9 aktor |
| 3 | Use Case Diagram | ✅ | BAB III 3.3 |
| 4 | Use Case Specification | ✅ | BAB III 3.6 (UC‑03, 8 skenario alternatif) |
| 5 | Class Diagram | ✅ | BAB IV (4.1–4.5): **13 class**, **16 relasi**, 14 multiplicity |
| 6 | Sequence Diagram | ✅ (baru) | BAB V (5.1–5.7) |
| 7 | Rencana Implementasi | ✅ (baru) | BAB VI (6.1–6.5) |
| 8 | Presentasi (PPT/PDF) | ✅ (baru) | `Presentasi/Slide_Presentasi_TechFix.pdf` |
| + | Dokumentasi pendukung & repo | ✅ (baru) | `Kode_TechFix/` + `Laporan_Konsistensi.md` ini |

---

## 2. Matriks konsistensi antar bab

| Item yang dicek | BAB II (SRS) | BAB III (Use Case) | BAB IV (Class) | BAB V (Sequence) | BAB VI/VII | Cocok? |
|-----------------|--------------|--------------------|----------------|------------------|------------|--------|
| Jumlah aktor | 9 (2.3) | 9 = 6 primer + 3 sekunder (3.1) | — | 4 lifeline | 9 (7.1) | ✅ |
| Jumlah use case | diturunkan dari 12 FR | 17 (3.2) | — | UC‑03 | 17 (7.1) | ✅ |
| Kebutuhan fungsional | FR01–FR12 | dipetakan ke UC (kolom "Kebutuhan") | — | FR03, FR05, FR09 | 12 (7.1) | ✅ |
| Kebutuhan non‑fungsional | NFR‑01–NFR‑09 | NFR‑02, NFR‑04 | — | NFR‑01, 02, 07, 09 | 9 (7.1) | ✅ |
| Jumlah class | — | — | 13 (4.1, 4.2) | 4 lifeline | 13 (7.1) | ✅ |
| Jumlah relasi | — | — | 16 (4.3) | — | 16 (7.1) | ✅ |
| Multiplicity | — | — | 14 baris (4.4) | — | — | ✅ (16 − 2 generalization) |
| Cakupan FR → UC | 12 FR | tiap FR punya ≥1 UC (4.4) | — | — | — | ✅ |

**Kesimpulan matriks:** angka‑angka kunci (9 aktor, 17 use case, 12 FR, 9 NFR, 13 class, 16 relasi) konsisten di seluruh bab, termasuk di bab kesimpulan.

---

## 3. Traceability UC‑03 ↔ Sequence Diagram (BAB V)

| Langkah skenario UC‑03 (3.6) | Pesan pada Sequence Diagram (5.7) | Cocok? |
|------------------------------|-----------------------------------|--------|
| 1 Buka daftar tugas & pilih tiket | `bukaDaftarTugas()` | ✅ |
| 2 Sistem tampilkan detail tiket | `tampilkanDetailTiket()` (Return) | ✅ |
| 3–4 Isi & simpan diagnosis | `simpanHasilDiagnosis()` | ✅ |
| 5–6 Ambil tarif + stok, hitung biaya | `ambilTarifDanStok()` → `dataTarifDanStok` → `hitungEstimasi()` | ✅ |
| 7 Tampilkan ringkasan estimasi | `tampilkanEstimasi()` (Return) | ✅ |
| 8–9 Kirim estimasi, status "Menunggu Persetujuan" | `kirimEstimasi()` | ✅ |
| 10 Kirim notifikasi (UC‑12) | `kirimNotifikasiEstimasi()` (Asynchronous) | ✅ |
| 11 Konfirmasi ke teknisi | `konfirmasiEstimasiTerkirim()` | ✅ |

Tabel pesan berisi **10 pesan** vs **11 langkah** skenario — wajar karena beberapa langkah digabung dalam satu pesan. Alur **lengkap** dan tidak ada langkah yang hilang.

---

## 4. Temuan / ketidaksesuaian

> **Status: semua temuan pada poin A, B, dan C sudah diperbaiki** di `RPL.docx` /
> `RPL_Laporan_TechFix.pdf` (46 halaman). Rincian perbaikan ada di tiap tabel di bawah.

### A. Salah tulis (typo) — ✅ sudah diperbaiki
| No | Lokasi | Tulisan sekarang | Seharusnya | Tingkat |
|----|--------|------------------|------------|---------|
| A1 | Halaman judul / daftar isi | `PROGAM STUDI` | `PROGRAM STUDI` | Rendah |
| A2 | Judul BAB III | `BAB IIII` | `BAB III` | Sedang |
| A3 | Judul BAB III | `USE CASE SPESIFICATION` | `USE CASE SPECIFICATION` | Rendah |
| A4 | Awal BAB I | `BAB 1 PENDAHULUAN` (angka Arab) | `BAB I PENDAHULUAN` (Romawi, samakan) | Rendah |

### B. Struktur / heading rusak — ✅ sudah diperbaiki
| No | Lokasi | Masalah | Dampak |
|----|--------|---------|--------|
| B1 | BAB III, sebelum 3.6 | Heading **"3.5 Pemilihan Use Case Utama" hilang**. Yang muncul malah `Pemilih Pemeriksaan yang kedua menunjukkan bahwa...` (kalimat 3.4 tersambung ke judul 3.5). | Penomoran subbab BAB III tidak berurutan; pembaca bingung. |
| B2 | Awal 3.5 | Teks paragraf 3.4 **tergandakan**: `...melalui hubungan include.an Use Case Utama.` (potongan kata "Pemilih...Use Case Utama" tercampur). | Kalimat tidak terbaca. |
| B3 | Setelah halaman judul | **DAFTAR ISI kosong** — tidak ada entri bab maupun nomor halaman. | Menyulitkan penilaian; sekarang makin penting karena sudah ada BAB V–VII. |

### C. Diagram / isi — ✅ sudah ditambah / diselaraskan
| No | Lokasi | Masalah | Tindakan (sudah dilakukan) |
|----|--------|---------|----------------------------|
| C1 | BAB III | Judul bab menjanjikan **"ACTIVITY DIAGRAM"**, tetapi Activity Diagram **tidak ada** di seluruh dokumen. | ✅ Ditambahkan sebagai subbab **3.7 Activity Diagram** (UC‑03) + caption `Gambar 3.2`. |
| C2 | BAB V vs BAB IV | Nama pesan Sequence Diagram **tidak identik** dengan nama method pada Class Diagram. Contoh: `hitungEstimasi()` (BAB V) vs `Estimasi.hitungTotal()` (4.2); `simpanHasilDiagnosis()`/`kirimEstimasi()` tidak ada di `TiketServis`; `bukaDaftarTugas()` vs `Teknisi.lihatTugas()`. | ✅ Ditambahkan **tabel pemetaan pesan → class → method** pada 5.7. |
| C3 | BAB V vs BAB II/III | Lifeline **"Layanan Notifikasi"** (BAB V) berbeda nama dengan aktor **"Layanan WhatsApp/SMS/Email"** (2.3 & 3.1). | ✅ Ditambahkan catatan bahwa lifeline "Layanan Notifikasi" adalah realisasi aktor "Layanan WhatsApp/SMS/Email". |
| C4 | BAB V 5.7 | Gambar diagram masih berupa **placeholder**: `[Sisipkan gambar Sequence Diagram UC‑03 pada bagian ini]`. | ✅ Gambar diagram asli disisipkan sebagai `Gambar 5.1`. |
| C5 | BAB III 3.2 vs 3.4 | 3.2 menyebut UC‑12 & UC‑17 sebagai use case pendukung "tidak berdiri sendiri", tetapi 3.4 menyatakan **hanya UC‑16** yang tanpa aktor (UC‑12 & UC‑17 sebenarnya punya aktor). | ✅ Kalimat 3.2 diperhalus: dibedakan use case "dipanggil use case lain" dengan "tanpa aktor". |

### D. Sudah diperbaiki saat penambahan bab
| No | Perbaikan | Bukti |
|----|-----------|-------|
| D1 | Kesimpulan yang dulu menyebut "BAB I sampai BAB V" diperbarui menjadi **"BAB I sampai BAB VI"** setelah Rencana Implementasi ditambahkan. | BAB VII 7.1 |
| D2 | Bab Rencana Implementasi (tugas 7) ditambahkan sebagai **BAB VI**, sehingga Kesimpulan menjadi **BAB VII**. | BAB VI & VII |
| D3 | Daftar pustaka ditambahkan (5 referensi). | DAFTAR PUSTAKA |

---

## 5. Rubrik penilaian (perkiraan kondisi)

| Kriteria (bobot) | Kondisi sekarang |
|------------------|------------------|
| Kelengkapan SRS (15%) | Terpenuhi (12 FR, 9 NFR, aktor, batasan, asumsi). |
| Kelengkapan Diagram (25%) | Use case ✅, class ✅, sequence ✅ (gambar tersisip), activity ✅. |
| Konsistensi antar Diagram (20%) | Angka & alur konsisten; penamaan pesan ↔ method dipetakan (C2/C3 sudah dibereskan). |
| Kualitas Presentasi (20%) | Slide tersedia (`Presentasi/Slide_Presentasi_TechFix.pdf`). |
| Penguasaan Materi (10%) | Perlu latihan; penguji biasanya menanyakan C2 (urutan pesan vs method). |
| Kolaborasi (10%) | Pembagian tugas tertulis di BAB VI 6.4; lampirkan bukti repo GitHub. |

---

## 6. Tindak lanjut

Semua perbaikan poin **A, B, dan C sudah selesai dilakukan** pada `RPL.docx`
(46 halaman) beserta salinannya di folder ini (`RPL.docx` dan `RPL_Laporan_TechFix.pdf`).
Sisa pekerjaan hanya tahap pengumpulan: **ganti nama folder** sesuai nama kelompok
dan **unggah ke repositori GitHub** beserta tautannya pada slide.
