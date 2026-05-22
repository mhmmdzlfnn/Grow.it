import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const FALLBACK_TEMPLATES = [
  `Konsistensimu pada "{habit}" seperti air yang sabar mengukir batu. Teruslah mengalir.`,
  `Tunas dari "{habit}" mulai berakar kuat di batinmu. Rawatlah dengan kesabaran.`,
  `Setiap kali kamu menyelesaikan "{habit}", kamu menanam satu bibit kedamaian untuk hari esok.`,
  `Daun-daun kesuksesan dari "{habit}" perlahan mekar. Pohon besar berawal dari satu biji kecil.`,
  `Angin keraguan tidak akan menumbangkan pohon yang akarnya kuat. Teruslah rawat "{habit}".`,
];

const MOOD_FALLBACKS = {
  berat: [
    'Hari yang berat pun tetap kamu lewati. Itu bukan kelemahan — itu kekuatan.',
    'Bahkan tanaman pun butuh hujan untuk tumbuh. Peluk dirimu hari ini.',
    'Kamu sudah melakukan yang terbaik hari ini. Itu lebih dari cukup.',
  ],
  biasa: [
    'Hari biasa adalah fondasi dari hari-hari luar biasa. Teruslah melangkah.',
    'Konsistensi di hari yang biasa adalah keajaiban tersendiri.',
    'Tidak semua hari harus spektakuler — yang penting kamu tetap hadir.',
  ],
  oke: [
    'Oke itu sudah bagus. Dari oke, kamu bisa tumbuh ke luar biasa.',
    'Hari yang oke adalah tanda kamu sedang dalam jalur yang benar.',
    'Pelan tapi pasti — tanamanmu terus tumbuh, begitu juga kamu.',
  ],
  senang: [
    'Kebahagiaan hari ini adalah pupuk terbaik untuk semangat esok hari!',
    'Simpan energi positif ini — biarkan ia menjadi bahan bakar minggu depanmu.',
    'Senang itu menular. Semoga kamu terus menyebarkannya ke sekitarmu!',
  ],
  luar_biasa: [
    'Luar biasa! Hari ini kamu bersinar seperti matahari pagi yang hangat.',
    'Energimu hari ini bisa menerangi seluruh taman! Pertahankan semangatmu.',
    'Ini dia — versi terbaik dirimu sedang mekar. Nikmati setiap momennya!',
  ],
};

const getFallback = (habitTitle) => {
  const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
  return template.replace('{habit}', habitTitle);
};

const getMoodFallback = (moodValue) => {
  const list = MOOD_FALLBACKS[moodValue] ?? MOOD_FALLBACKS['oke'];
  return list[Math.floor(Math.random() * list.length)];
};

export const generateZenMessage = async (habitTitle, context = {}) => {
  if (!ai) {
    await new Promise(r => setTimeout(r, 800));
    return getFallback(habitTitle);
  }

  const { streak = 0, stage = 0, justLeveledUp = false } = context;

  const stageNames = ['benih', 'tunas', 'tanaman muda', 'tanaman mekar'];
  const stageName = stageNames[stage] ?? 'tanaman';

  let contextHint = '';
  if (justLeveledUp) contextHint = `Tanamannya baru saja naik level menjadi ${stageName}!`;
  else if (streak >= 7) contextHint = `Dia sudah ${streak} hari berturut-turut konsisten!`;
  else if (streak >= 3) contextHint = `Streak-nya sudah ${streak} hari berturut-turut.`;

  const prompt = `Kamu adalah AI Zen Master dalam aplikasi habit tracker bernama Grow.it, di mana kebiasaan divisualisasikan sebagai tanaman yang tumbuh.

Pengguna baru saja menyelesaikan kebiasaan: "${habitTitle}".
${contextHint}

Berikan satu kalimat motivasi zen yang:
- Singkat (1-2 kalimat maksimal)
- Menggunakan metafora alam atau tanaman
- Hangat, puitis, dan personal
- Dalam Bahasa Indonesia
- TANPA tanda kutip di awal/akhir
- TANPA emoji`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = response.text?.trim();
    if (!text) return getFallback(habitTitle);
    return text;
  } catch (err) {
    console.warn('Gemini API error, using fallback:', err.message);
    return getFallback(habitTitle);
  }
};

// Mood-aware response — called after user picks their mood
export const generateMoodResponse = async (moodValue, moodLabel, habitTitle) => {
  if (!ai) {
    await new Promise(r => setTimeout(r, 600));
    return getMoodFallback(moodValue);
  }

  const moodContext = {
    berat:      'Pengguna merasa hari ini berat dan melelahkan.',
    biasa:      'Pengguna merasa harinya biasa saja, tidak terlalu baik atau buruk.',
    oke:        'Pengguna merasa harinya cukup oke.',
    senang:     'Pengguna merasa senang dan bahagia hari ini.',
    luar_biasa: 'Pengguna merasa harinya luar biasa dan penuh semangat.',
  };

  const tone = {
    berat:      'Validasi perasaannya dengan hangat, berikan pelukan emosional, dan ingatkan bahwa hari berat pun adalah bagian dari perjalanan. Jangan terlalu ceria.',
    biasa:      'Apresiasi konsistensinya di hari yang biasa. Ingatkan bahwa konsistensi di hari biasa adalah kunci pertumbuhan.',
    oke:        'Apresiasi dengan ringan dan positif. Dorong untuk terus melangkah.',
    senang:     'Rayakan kebahagiaannya! Validasi perasaan positifnya dan dorong agar energi ini terus terjaga.',
    luar_biasa: 'Rayakan dengan antusias! Validasi semangat luar biasanya dan dorong untuk terus bersinar.',
  };

  const prompt = `Kamu adalah AI Zen Master yang penuh empati dalam aplikasi habit tracker Grow.it.

Pengguna baru saja menyelesaikan kebiasaan "${habitTitle}" dan melaporkan kondisi harinya:
Mood: ${moodLabel} ${moodContext[moodValue] ?? ''}

Tugas kamu: ${tone[moodValue] ?? tone['oke']}

Berikan respons yang:
- 1-2 kalimat, tidak lebih
- Terasa personal dan manusiawi, bukan robotik
- Menggunakan bahasa Indonesia yang hangat dan natural
- Boleh menggunakan metafora alam/tanaman jika terasa natural
- TANPA tanda kutip di awal/akhir
- TANPA emoji`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = response.text?.trim();
    if (!text) return getMoodFallback(moodValue);
    return text;
  } catch (err) {
    console.warn('Gemini mood response error, using fallback:', err.message);
    return getMoodFallback(moodValue);
  }
};
