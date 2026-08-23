# Deployment Vercel — Flinter & Josua

Project ini menggunakan Vite untuk frontend dan Express/tRPC untuk endpoint serverless. File `api/[...path].ts` meneruskan request `/api/*` ke factory Express tanpa membuka port sendiri.

## Pengaturan Vercel

Import repository `datawebglobal-pixel/flinter-josua-chat` sebagai project baru. Gunakan pengaturan berikut:

| Pengaturan | Nilai |
|---|---|
| Framework preset | Vite atau Other |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm run build` |
| Output directory | `dist/public` |
| Root directory | Kosong |

Tambahkan environment variable berikut di Project Settings → Environment Variables. Jangan commit nilai rahasia ke GitHub.

| Nama | Kegunaan |
|---|---|
| `NODE_ENV` | Set ke `production`. |
| `JWT_SECRET` | Secret acak panjang untuk sesi aplikasi. |
| `DATABASE_URL` | MySQL Service URI dari Aiven, termasuk parameter SSL jika diwajibkan Aiven. |
| `S3_BUCKET` | Nama bucket object storage untuk file media. |
| `S3_REGION` | Region bucket, sesuai provider. |
| `S3_ENDPOINT` | Endpoint S3-compatible provider; kosong hanya jika memakai AWS S3 standar. |
| `S3_ACCESS_KEY_ID` | Access key untuk upload dan pengelolaan object. |
| `S3_SECRET_ACCESS_KEY` | Secret key pasangannya. |
| `S3_FORCE_PATH_STYLE` | Isi `true` untuk provider yang membutuhkan path-style URL; selain itu `false`. |
| `PUBLIC_STORAGE_URL` | URL publik atau base URL CDN/object storage untuk membaca media. |

Aplikasi pada template Manus juga mengenali environment variable bawaan Manus seperti `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, dan `VITE_OAUTH_PORTAL_URL`. Jika deployment Vercel tidak memakai Manus OAuth, jangan mengandalkan login OAuth tersebut tanpa konfigurasi yang sesuai. Untuk hosting mandiri, siapkan kredensial storage S3-compatible di atas.

## Database

Gunakan connection string MySQL dari Aiven. Pastikan password baru telah dibuat dan connection string tidak pernah disimpan pada source code, GitHub, screenshot, atau chat publik. Jalankan migrasi database dari lingkungan lokal yang memiliki `DATABASE_URL` yang sama sebelum memakai fitur chat dan media.

## Batasan Vercel

Vercel menjalankan endpoint sebagai fungsi serverless. Jangan mengandalkan proses yang berjalan terus-menerus, WebSocket permanen, atau file lokal persisten. Chat project menggunakan polling berkala sehingga sesuai untuk deployment serverless, tetapi pembaruan tidak memakai koneksi WebSocket.

Upload media besar perlu dilakukan ke object storage S3-compatible. Hindari mengirim video besar melalui fungsi Vercel karena batas ukuran request dan waktu eksekusi dapat berbeda menurut paket akun. Setelah deploy, uji login identitas, riwayat chat, pengiriman pesan, badge unread, serta halaman Galeri/Kenangan.
