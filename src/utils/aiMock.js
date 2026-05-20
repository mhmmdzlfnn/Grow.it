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

const getFallback = (habitTitle) => {
  const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
  return template.replace('{habit}', habitTitle);
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
