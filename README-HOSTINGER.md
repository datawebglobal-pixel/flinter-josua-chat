# Panduan Hosting Manual di Hostinger

Paket ini adalah aplikasi **Node.js full-stack**, bukan website HTML statis biasa. Karena memiliki backend chat, database, dan upload media, gunakan paket Hostinger yang menyediakan **Node.js Application** dan database MySQL/TiDB atau database MySQL eksternal. Jika paket hosting Anda hanya mendukung PHP/static hosting, backend chat tidak dapat berjalan langsung di sana.

## 1. Upload dan ekstrak project

Unggah file ZIP ini melalui File Manager Hostinger, lalu ekstrak di folder aplikasi. Jangan mengunggah folder `node_modules` dari komputer lokal. Setelah diekstrak, pastikan file `package.json`, folder `client`, `server`, `drizzle`, dan `shared` berada di root aplikasi.

## 2. Buat database

Buat database MySQL pada hPanel, kemudian catat host, nama database, username, dan password. Gabungkan menjadi connection string berikut dan masukkan sebagai environment variable aplikasi:

```bash
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:3306/NAMA_DATABASE
```

Jalankan migrasi dari terminal aplikasi atau SSH:

```bash
pnpm install
pnpm drizzle-kit migrate
```

Jika Hostinger tidak menyediakan pnpm, aktifkan pnpm dengan `corepack enable` atau gunakan npm secara hati-hati setelah memastikan lockfile dan script build tetap kompatibel.

## 3. Atur Node.js Application

Pada pengaturan Node.js Application Hostinger, gunakan Node.js 20 atau lebih baru. Jalankan perintah build:

```bash
pnpm install
pnpm build
```

Gunakan file startup hasil build `dist/index.js`. Port tidak boleh dikunci manual; aplikasi mengikuti port yang diberikan runtime melalui environment. Set mode production dengan:

```bash
NODE_ENV=production
```

Setelah environment disimpan, restart aplikasi dari hPanel.

## 4. Atur penyimpanan media

Aplikasi menerima gambar, video, dan audio sampai 25 MB. Untuk hosting mandiri, gunakan bucket S3-compatible atau layanan object storage yang dapat menyajikan URL publik/CDN. Isi environment variable berikut pada Node.js Application:

```bash
S3_BUCKET=nama-bucket
S3_REGION=us-east-1
S3_ENDPOINT=https://endpoint-storage-anda
S3_ACCESS_KEY_ID=access-key
S3_SECRET_ACCESS_KEY=secret-key
S3_FORCE_PATH_STYLE=false
PUBLIC_STORAGE_URL=https://cdn-atau-url-publik-anda
```

`S3_ENDPOINT` dapat dikosongkan untuk AWS S3. `PUBLIC_STORAGE_URL` harus menunjuk ke base URL publik bucket/CDN tanpa slash di akhir. Jangan pernah memasukkan kredensial storage ke kode frontend atau repository.

Jika environment S3 tidak diisi, aplikasi akan mencoba memakai storage bawaan Manus. Untuk deployment Hostinger mandiri, gunakan konfigurasi S3-compatible agar fitur unggah media tidak bergantung pada environment Manus.

## 5. Penggunaan aplikasi

Saat membuka aplikasi, pilih identitas **Flinter** atau **Josua**. Menu **Chat Kita** menyimpan pesan ke database dan menampilkan badge angka untuk pesan masuk yang belum dibaca. Badge diperbarui otomatis, status baca dipisahkan per identitas, dan di-reset ketika chat dibuka. Menu **Kelola** digunakan untuk menambahkan media ke Galeri atau bagian Kenangan tertentu.

## 6. Checklist pemeriksaan

Setelah aplikasi aktif, buka halaman utama dan uji pemilihan kedua identitas. Kirim satu pesan sebagai Flinter, keluar, pilih Josua, lalu pastikan pesan tersebut muncul sebagai pesan masuk dengan badge angka. Uji juga unggah satu gambar kecil dan pastikan gambar tampil di Galeri. Setelah itu uji video/audio yang ukurannya sesuai batas.

Jangan mengunggah `.env`, password database, access key, secret key, atau file rahasia lain ke ZIP maupun repository. Jika Hostinger meminta public directory, gunakan konfigurasi Node.js Application, bukan hanya folder `dist/public`, karena folder public saja tidak dapat menjalankan backend chat.
