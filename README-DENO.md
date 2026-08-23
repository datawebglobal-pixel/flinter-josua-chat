# Deployment Deno Deploy — Flinter & Josua

Panduan ini menyiapkan project untuk dicoba pada Deno Deploy melalui repository GitHub. Project tetap memakai React/Vite di frontend, Express/tRPC di server, Drizzle ORM dengan MySQL/TiDB/Aiven, dan environment variable untuk konfigurasi.

## Prasyarat

Pastikan source terbaru sudah berada di repository GitHub dan database MySQL Aiven sudah berstatus Running. Siapkan tiga environment variable berikut secara aman: `NODE_ENV=production`, `JWT_SECRET` dengan nilai acak panjang, dan `DATABASE_URL` berisi connection string MySQL. Jangan menaruh nilai rahasia di GitHub.

## Pengaturan project

Di Deno Deploy, buat project baru dari GitHub dan pilih repository `datawebglobal-pixel/flinter-josua-chat`. Gunakan branch `main`. Jika dashboard meminta entrypoint, pilih file server utama atau gunakan konfigurasi Node compatibility yang disediakan Deno Deploy. Jika dashboard meminta build command, gunakan `pnpm install --frozen-lockfile && pnpm run build`. Jika meminta start command, gunakan `pnpm run start` atau entrypoint produksi `dist/index.js`, sesuai opsi yang tersedia pada dashboard.

Tambahkan environment variable melalui menu Secrets/Environment Variables, bukan melalui file `.env` yang di-commit. Gunakan `NODE_ENV`, `JWT_SECRET`, dan `DATABASE_URL`. Connection string harus memiliki SSL/TLS sesuai instruksi provider database.

## Database

Setelah deployment pertama berhasil, jalankan migrasi database dari lingkungan yang mendukung Node.js dan akses ke database, misalnya komputer lokal atau job migration pada provider. Jalankan `pnpm install`, kemudian `pnpm drizzle-kit migrate`. Jangan menjalankan migrasi berulang kali secara sembarangan pada database produksi; periksa migration folder dan backup terlebih dahulu.

## Catatan runtime

Deno Deploy memakai runtime Deno dengan kompatibilitas Node/npm. Sebagian besar dependency project dapat di-resolve melalui `nodeModulesDir: auto`, tetapi kompatibilitas Express, mysql2, dan proses startup perlu diuji pada deployment nyata. Jika dashboard Deno Deploy tidak dapat menjalankan server Express sebagai entrypoint, project perlu diubah ke adapter `Deno.serve` atau dipindahkan ke platform Node.js yang menerima deployment tanpa verifikasi kartu.

Media tidak disimpan di filesystem deployment. Foto, video, dan audio harus menggunakan object storage S3-compatible. Nilai `/manus-storage/...` dari preview Manus perlu diganti dengan URL storage milik deployment eksternal sesuai `MEDIA-MANIFEST.md`.

## Verifikasi

Setelah deploy, buka URL `.deno.dev` yang diberikan. Uji layar identitas Flinter/Josua, halaman Galeri, Kenangan, Surat, pengiriman pesan, badge unread, dan upload media. Jika aplikasi tidak merespons, periksa logs dan pastikan `DATABASE_URL` serta `JWT_SECRET` sudah tersimpan tanpa spasi atau tanda kutip tambahan.

## Privasi dan biaya

Gunakan repository private dan jangan membagikan connection string. Free tier dan kebijakan kartu dapat berubah; selalu periksa ringkasan biaya sebelum mengaktifkan layanan. Hentikan deployment jika dashboard menampilkan paket berbayar atau meminta metode pembayaran yang tidak Anda inginkan.

