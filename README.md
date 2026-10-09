# Tugas Presentasi Kelompok 8 — Sistem Manajemen Servis Gadget "TechFix"

Mata Kuliah: **Rekayasa Perangkat Lunak (SSD1030) — Kelas A**
Dosen Pengampu: Muhammad Soleh, S.Kom., M.T.
Program Studi Sains Data, Fakultas Sains dan Teknologi, UIN K.H. Abdurrahman Wahid Pekalongan.

Folder ini disusun mengikuti tugas **Pertemuan 6 — Tugas Presentasi RPL** (8 poin pengerjaan: studi kasus, SRS, use case diagram, use case specification, class diagram, sequence diagram, rencana implementasi/presentasi).

---

## Isi folder

| Berkas / folder | Keterangan |
|-----------------|------------|
| `Presentasi/Slide_Presentasi_TechFix.pdf` | **Slide presentasi siap pakai (18 slide, 16:9).** |
| `Presentasi/Slide_Presentasi_TechFix.html` | Sumber slide (bisa diedit di browser/editor teks). |
| `Presentasi/img/` | Gambar untuk slide dan laporan (logo, use case diagram, class diagram, `sequence_uc03.png`, `activity_uc03.png`). |
| `Kode_TechFix/` | Skeleton kode program dasar (Node.js + Express + MySQL). |
| `Laporan_Konsistensi.md` | Hasil cek konsistensi antar bab + temuan & rekomendasi (sudah diperbaiki). |
| `RPL_Laporan_TechFix.pdf` | Laporan lengkap **46 halaman: Daftar Isi + BAB I–VII + Daftar Pustaka**. |
| `RPL.docx` | Salinan laporan yang bisa diedit. |

> Dokumen laporan asli ada di `D:\RPL\RPL.docx`.

---

## Status perbaikan dokumen

Semua temuan pada `Laporan_Konsistensi.md` **sudah diperbaiki** di `RPL.docx` /
`RPL_Laporan_TechFix.pdf` (46 halaman):

1. ✅ Salah tulis diperbaiki: `PROGRAM STUDI`, `BAB III` (dulu `BAB IIII`),
   `USE CASE SPECIFICATION` (dulu `SPESIFICATION`), dan `BAB I` (dulu `BAB 1`).
2. ✅ Heading subbab **3.5 Pemilihan Use Case Utama** dibetulkan, dan kalimat
   duplikat pada awal 3.5 dihapus.
3. ✅ **DAFTAR ISI** diisi lengkap (bab + subbab + nomor halaman, dengan titik pengarah).
4. ✅ **Activity Diagram** UC-03 ditambahkan sebagai subbab **3.7** + caption `Gambar 3.2`.
5. ✅ **Sequence Diagram** UC-03 disisipkan sebagai `Gambar 5.1` (bukan placeholder lagi).
6. ✅ Caption gambar ditambahkan: `Gambar 3.1` Use Case Diagram, `Gambar 4.1` Class Diagram.
7. ✅ Konsistensi diagram: tabel pemetaan pesan → class/method (C2), catatan realisasi
   lifeline "Layanan Notifikasi" (C3), dan kalimat 3.2 diselaraskan dengan 3.4 (C5).

## Yang masih perlu dilakukan sebelum dikumpulkan

1. ✅ Nama folder sudah sesuai aturan pengumpulan (`TugasPresentasi_Kelompok8`).
2. ✅ Nama anggota & pembagian tugas (BAB VI 6.4) sudah disesuaikan dengan Kelompok 8.
3. ✅ Repositori GitHub kelompok sudah diunggah; tautannya tercantum di slide (cover & penutup).

## Anggota & pembagian tugas (Kelompok 8)

| Anggota (NIM) | Bagian |
|---------------|--------|
| Aninda Rizqi Amelia (60124009) | Use Case — use case diagram, use case specification UC-03, activity diagram |
| Sifa Sabrina (60124023) | SRS — kebutuhan fungsional & non-fungsional, aktor, batasan, asumsi |
| Maheswari Pasa Putri Syamsudar (60124010) | Class Diagram — class, atribut & method, relasi, multiplicity |
| Hasan (60124013) | Sequence Diagram — interaksi UC-03, lifeline, pesan, combined fragment |

## Repositori GitHub

🔗 **<https://github.com/whitefoxrakka-cloud/TugasPresentasi-Kelompok8-RPL>**

---

## Ringkasan isi laporan (BAB I–VII)

| Bab | Isi | Angka kunci |
|-----|-----|-------------|
| I | Studi kasus TechFix | 2 cabang, 40–60 unit/hari |
| II | SRS | 9 aktor, 12 FR, 9 NFR |
| III | Pemodelan UML (use case, use case specification, activity diagram) | 17 use case, 1 activity diagram |
| IV | Class Diagram | 13 class, 16 relasi |
| V | Sequence Diagram | UC-03, 10 pesan |
| VI | Rencana Implementasi | 13 model, 4 minggu |
| VII | Kesimpulan & Saran | — |

---

## Menjalankan skeleton kode (opsional)

```
cd Kode_TechFix
npm install
Copy-Item .env.example .env      # lalu sesuaikan kredensial MySQL
mysql -u root -p < database/schema.sql
npm start                         # http://localhost:3000
```

Catatan: skeleton ini adalah kerangka dasar untuk menunjukkan pemetaan class diagram → kode, belum diuji penuh end-to-end.
