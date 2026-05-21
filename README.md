<div align="center">

# 🌿 Grow.it

### *"Tumbuhkan kebiasaan baik dengan penuh kesabaran."*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Docker](https://img.shields.io/badge/Docker-Cloud_Run-2496ED?style=flat-square&logo=docker)](https://cloud.google.com/run)

**Grow.it** adalah habit tracker bergaya *Cozy Game* yang menggabungkan produktivitas dengan gamifikasi interaktif, desain *Earth-Tone Minimalist*, dan kecerdasan buatan — ditenagai oleh **Google Gemini AI**.

</div>

---

## ✨ Fitur Utama

### 🪴 Interactive 3D Garden
Setiap kebiasaan direpresentasikan sebagai tanaman virtual dengan 4 stage pertumbuhan. Arahkan mouse ke kartu tanaman untuk merasakan efek *parallax 3D* yang responsif. Tersedia 4 jenis tanaman: Sakura 🌸, Bambu 🎋, Kaktus 🌵, dan Pohon 🌳.

### 🔥 Streak Celebration (TikTok-style)
Capai milestone streak (3, 7, 14, 21, 30, 50, 100 hari) dan saksikan animasi perayaan bergaya TikTok Live — api besar muncul di tengah layar dengan angka streak yang glowing. Makin panjang streak, makin epik animasinya.

### 🤖 AI Zen Master (Powered by Gemini 2.0 Flash)
Setiap kali kamu menyelesaikan kebiasaan, **Google Gemini AI** menghasilkan kutipan motivasi zen yang personal — disesuaikan dengan nama habit, panjang streak, stage tanaman, dan apakah kamu baru saja level up. Bukan template random, tapi AI yang beneran ngerti konteksmu.

### 📸 Garden Share Card
Generate kartu taman yang indah sebagai gambar PNG — nampilin semua tanamanmu, statistik streak, dan quote zen. Bisa langsung di-download atau di-share ke sosmed via Web Share API.

### 🔔 Smart Reminder + PWA
Set pengingat harian per habit dengan pilihan waktu cepat (Pagi/Siang/Sore/Malam) atau custom. Notifikasi berjalan via **Service Worker** — aktif bahkan saat tab browser ditutup. App juga bisa di-install ke homescreen layaknya aplikasi native.

### 🌦️ Dynamic Weather & Time
Suasana taman berubah otomatis sesuai waktu:
- ☀️ **Pagi** — sinar matahari yang menyegarkan
- 🍂 **Sore** — daun berguguran perlahan
- 🌙 **Malam** — kunang-kunang yang estetis

### 🎧 Zen Focus Mode
Mode Pomodoro (25 menit) yang immersive — layar meredup, tanaman beranimasi "bernapas", dan timer berjalan menemanimu fokus.

### 🐛 Cozy Gamification
Lalai 2 hari? Tanamanmu layu dan ditumbuhi **Rumput Liar 🌿** + **Hama 🐛**. Bersihkan dulu sebelum bisa menyiram lagi. Tidak ada punishment keras — hanya taman yang menunggumu kembali.

### 📊 Streak Heatmap
Kalender konsistensi 35 hari ala GitHub. Semakin sering kamu complete habit, semakin hijau pekat warnanya.

### 🦋 Rare Encounter
Ada peluang acak seekor Kupu-Kupu Emas terbang melintasi layar. Tangkap sebelum menghilang untuk mendapat pesan eksklusif dari AI Zen Master!

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | React 19 + Vite 8 |
| Animation | Framer Motion |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Icons | Lucide React |
| Screenshot | html2canvas |
| Confetti | canvas-confetti |
| Audio | Web Audio API (synthesizer kustom, tanpa file mp3) |
| Styling | Vanilla CSS + CSS Variables |
| PWA | Service Worker + Web App Manifest |
| Deploy | Docker + Google Cloud Run + Nginx |

---

## 🚀 Cara Menjalankan

### Development

```bash
# 1. Clone repo
git clone https://github.com/mhmmdzlfnn/Grow.it.git
cd Grow.it

# 2. Install dependencies
npm install

# 3. Buat file .env dan isi API key
cp .env.example .env
# Edit .env: VITE_GEMINI_API_KEY=your_key_here

# 4. Jalankan dev server
npm run dev
```

Buka `http://localhost:5173` di browser.

### Environment Variables

Buat file `.env` di root project:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Dapatkan API key gratis di [Google AI Studio](https://aistudio.google.com/app/apikey).

> ⚠️ Jangan commit file `.env` ke repository. File ini sudah di-exclude via `.gitignore`.

### Build & Docker

```bash
# Build production
npm run build

# Build Docker image
docker build -t growit .

# Run container
docker run -p 8080:8080 growit
```

---

## 🌍 Deploy ke Google Cloud Run

```bash
# Build & push ke Artifact Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/growit

# Deploy ke Cloud Run
gcloud run deploy growit \
  --image gcr.io/PROJECT_ID/growit \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated
```

---

## 🎨 Philosophy

Grow.it dibangun dengan prinsip **"Compassionate Productivity"**.

Berbeda dengan habit tracker lain yang memberi tekanan saat kamu gagal, Grow.it hanya memintamu untuk mencabut rumput liar dan mulai menyiram lagi. Tidak ada streak yang hilang secara brutal — hanya taman digital yang selalu menunggumu untuk kembali bertumbuh.

> *"Pohon besar berawal dari satu biji kecil. Teruslah bertumbuh, satu hari dalam satu waktu."*

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk Google Juara Vibe Coding</p>
  <p>
    <a href="https://aistudio.google.com">Google AI Studio</a> ·
    <a href="https://cloud.google.com/run">Google Cloud Run</a>
  </p>
</div>
