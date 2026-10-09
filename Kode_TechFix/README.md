# TechFix Service

Skeleton dasar **sistem manajemen servis gadget TechFix** untuk 2 cabang di
Semarang. Dibuat sebagai tugas mata kuliah Rekayasa Perangkat Lunak (RPL).

Proyek ini adalah **kerangka awal (skeleton)**: struktur folder, model, service,
controller, route, dan tampilan dasar sudah rapi dan benar secara sintaks,
tetapi belum diuji end-to-end terhadap basis data produksi.

## Teknologi

- Node.js 20 (CommonJS: `require` / `module.exports`)
- Express.js 4
- EJS + Bootstrap 5 (CDN)
- MySQL 8 dengan driver `mysql2/promise`
- JSON body parser + REST sederhana
- Tanpa TypeScript, tanpa ORM

## Struktur Proyek

```
Kode_TechFix/
├── README.md
├── package.json
├── .env.example
├── .gitignore
├── database/
│   └── schema.sql
├── docs/
│   └── PEMETAAN_CLASS.md
└── src/
    ├── server.js
    ├── app.js
    ├── config/database.js
    ├── models/        (13 model, 1 per class)
    ├── services/      (estimasiService, notifikasiService)
    ├── controllers/   (tiket, estimasi, sukuCadang)
    ├── routes/index.js
    └── views/diagnosis.ejs
```

## Cara Install & Menjalankan

1. **Masuk ke folder proyek**

   ```powershell
   cd D:\RPL\TugasPresentasi_TechFix\Kode_TechFix
   ```

2. **Install dependensi**

   ```powershell
   npm install
   ```

3. **Siapkan konfigurasi lingkungan**

   Salin `.env.example` menjadi `.env`, lalu sesuaikan:

   ```powershell
   Copy-Item .env.example .env
   ```

   Isi `.env`:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=techfix
   PORT=3000
   ```

4. **Import skema basis data**

   ```powershell
   mysql -u root -p < database\schema.sql
   ```

   Skrip `schema.sql` membuat database `techfix`, 13 tabel, dan beberapa data
   contoh (2 cabang, 2 teknisi, 1 pelanggan, 3 suku cadang, 1 tiket, 1 estimasi).

5. **Jalankan aplikasi**

   ```powershell
   npm start
   ```

   atau mode pengembangan (auto-restart):

   ```powershell
   npm run dev
   ```

   Server berjalan di `http://localhost:3000`.

## Daftar Endpoint

| Method | Endpoint | Deskripsi | Controller |
|--------|----------|-----------|------------|
| GET | `/` | Halaman sambutan API | `app.js` |
| GET | `/diagnosis` | Halaman contoh diagnosis & estimasi (EJS) | `app.js` |
| GET | `/api/sukucadang` | Daftar suku cadang; tambahkan `?idCabang=1` untuk status stok minimum | `sukuCadangController` |
| GET | `/api/teknisi/:idTeknisi/tugas` | Daftar tugas tiket milik teknisi (UC-03 langkah 1) | `tiketController` |
| GET | `/api/tiket/:nomorTiket` | Detail lengkap satu tiket (UC-03 langkah 2) | `tiketController` |
| POST | `/api/tiket/:nomorTiket/diagnosis` | Simpan hasil diagnosis (UC-03 langkah 3) | `estimasiController` |
| POST | `/api/tiket/:nomorTiket/estimasi/kirim` | Susun & kirim estimasi + notifikasi async (UC-03 langkah 4-7) | `estimasiController` |

### Contoh body `POST /api/tiket/:nomorTiket/diagnosis`

```json
{ "hasilDiagnosis": "LCD rusak, perlu penggantian" }
```

### Contoh body `POST /api/tiket/:nomorTiket/estimasi/kirim`

```json
{
  "idTeknisi": 1,
  "idCabang": 1,
  "daftarSukuCadang": [
    { "idSukuCadang": 1, "jumlah": 1 },
    { "idSukuCadang": 3, "jumlah": 2 }
  ]
}
```

## Alur UC-03 (Mendiagnosis dan Menyusun Estimasi)

Detail pemetaan class, method, FR/UC, dan NFR dapat dilihat pada
[docs/PEMETAAN_CLASS.md](docs/PEMETAAN_CLASS.md).

## Catatan

- Ini adalah **skeleton dasar**. Beberapa method model hanya berisi query
  kerangka dan belum divalidasi penuh.
- Kata sandi pada data contoh masih plain text demi kesederhanaan demonstrasi;
  pada implementasi nyata gunakan hashing (mis. bcrypt).
- Notifikasi bersifat **simulasi** (log ke konsol) melalui `notifikasiService.js`.
