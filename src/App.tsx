import React, { useState, useRef } from 'react';
import {
  Zap, SlidersHorizontal, Flag, Users, Palette, Eye, Code, Monitor, Smartphone, Sparkles,
  MessageCircle, Clock, LayoutGrid, HelpCircle, Image as ImageIcon, Youtube, Phone, Copy, Check, Download,
  Bot
} from 'lucide-react';

// ============================================================
// INTELLIGENCE ENGINE — module-level pure helpers
// ============================================================

function parseDescription(desc: string, produk: string, audiens: string) {
  const fallback = [
    `Dirancang khusus untuk ${audiens} yang menginginkan solusi berkualitas terbaik di kelasnya.`,
    `Proses yang sederhana dan intuitif — tidak perlu pengalaman sebelumnya untuk langsung merasakan manfaatnya.`,
    `Hasil yang konsisten dan terukur, terbukti memuaskan ribuan pengguna nyata.`
  ];

  if (!desc || desc.trim().length < 20) {
    return { features: fallback, leadSentence: '', painPoints: [] as string[], benefits: [] as string[] };
  }

  const sentences = desc
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const painKw = ['sulit', 'susah', 'gagal', 'lelah', 'frustrasi', 'masalah', 'bingung', 'ribet', 'mahal', 'sia-sia', 'tidak bisa', 'belum'];
  const benefitKw = ['sehingga', 'agar', 'supaya', 'bisa', 'dapat', 'membantu', 'meningkat', 'menghasil', 'hemat', 'cepat', 'mudah', 'efektif', 'efisien', 'terbukti', 'garansi', 'gratis'];

  const painPoints = sentences.filter(s => painKw.some(k => s.toLowerCase().includes(k)));
  const benefits = sentences.filter(s => benefitKw.some(k => s.toLowerCase().includes(k)) && !painKw.some(k => s.toLowerCase().includes(k)));
  const neutral = sentences.filter(s => !painPoints.includes(s) && !benefits.includes(s));

  const pool = [...benefits, ...neutral, ...painPoints];
  const features = [
    pool[0] || fallback[0],
    pool[1] || fallback[1],
    pool[2] || fallback[2],
  ];

  return { features, leadSentence: sentences[0] || '', painPoints, benefits };
}

function getFeatureTitle(sentence: string, index: number): string {
  const low = sentence.toLowerCase();
  if (['kualitas', 'material', 'bahan', 'formula', 'premium'].some(k => low.includes(k))) return 'Kualitas Premium Terjamin';
  if (['mudah', 'simple', 'praktis', 'langkah', 'cepat'].some(k => low.includes(k))) return 'Kemudahan yang Sesungguhnya';
  if (['hasil', 'terbukti', 'efektif', 'nyata', 'garansi'].some(k => low.includes(k))) return 'Hasil Nyata & Terukur';
  if (['hemat', 'biaya', 'harga', 'murah', 'diskon'].some(k => low.includes(k))) return 'Nilai Terbaik untuk Investasi Anda';
  if (['aman', 'terpercaya', 'sertifi', 'standar'].some(k => low.includes(k))) return 'Keamanan & Kepercayaan Penuh';
  if (['eksklusif', 'spesial', 'unik', 'khusus'].some(k => low.includes(k))) return 'Keistimewaan yang Tidak Biasa';
  return ['Keunggulan Utama', 'Cara Kerja yang Simpel', 'Jaminan Kepuasan Nyata'][index] ?? 'Fitur Unggulan';
}

// Synthesizes hero sub-headline from all inputs — NOT verbatim from description
function synthesizeHeroSubHeadline(
  produk: string,
  audiens: string,
  tujuan: string,
  deskripsi: string,
  parsed: ReturnType<typeof parseDescription>
): string {
  const tujuanLow = tujuan.toLowerCase();
  const isJual = tujuanLow.includes('jual') || tujuanLow.includes('beli') || tujuanLow.includes('order');
  const isLead = tujuanLow.includes('lead') || tujuanLow.includes('wa') || tujuanLow.includes('konsultasi');

  const topBenefit = parsed.benefits[0] || parsed.leadSentence || '';
  const benefitCore = topBenefit.replace(/[.!?]$/, '').trim();
  const benefitLow = benefitCore.toLowerCase();

  if (!deskripsi || deskripsi.trim().length < 20) {
    if (isJual) return `${produk} bukan sekadar produk biasa — ini adalah solusi nyata untuk ${audiens} yang sudah siap melihat perubahan. Setiap detail dirancang untuk mengantarkan Anda pada hasil yang selama ini Anda kejar.`;
    if (isLead) return `Setiap ${audiens} memiliki kebutuhan yang unik. Itulah mengapa ${produk} hadir dengan pendekatan personal — memastikan solusi yang Anda dapatkan benar-benar sesuai dengan situasi dan target Anda.`;
    return `${produk} dirancang dengan satu fokus: membantu ${audiens} mencapai target lebih cepat, lebih efisien, dan tanpa hambatan yang tidak perlu. Karena Anda berhak atas hasil yang nyata.`;
  }

  if (benefitLow.length > 10) {
    const capBenefit = benefitCore.charAt(0).toUpperCase() + benefitCore.slice(1).toLowerCase();
    if (isJual) return `Bayangkan ketika ${benefitLow} — bukan sebagai mimpi, tapi sebagai standar baru keseharian Anda. ${produk} menghadirkan kenyataan itu untuk ${audiens} yang berani memilih yang terbaik.`;
    if (isLead) return `Apa yang membuat ${produk} berbeda? ${capBenefit}. Dan kami siap menunjukkan secara langsung bagaimana ini bisa bekerja untuk situasi ${audiens} yang spesifik.`;
    return `${capBenefit} — inilah standar yang kami pegang untuk setiap ${audiens} yang mempercayakan kebutuhan mereka kepada ${produk}. Bukan sekadar janji, tapi komitmen yang bisa Anda pegang.`;
  }

  const firstLine = deskripsi.split(/[.!?\n]/)[0]?.trim() || '';
  if (isJual) return `${firstLine} — dan dengan ${produk}, ${audiens} tidak lagi perlu berkompromi antara kualitas dan kemudahan. Dapatkan keduanya, sekarang.`;
  return `${firstLine}. Itulah komitmen ${produk} untuk setiap ${audiens} yang bergabung — setiap langkah Anda bersama kami adalah langkah yang terarah dan terukur.`;
}

// Expands a raw feature sentence into 2-sentence marketing copy
function expandFeatureDescription(sentence: string, produk: string, audiens: string, index: number): string {
  if (!sentence || sentence.length < 10) return sentence;
  const clean = sentence.replace(/[.!?]+$/, '').trim();

  const expansions: ((s: string) => string)[] = [
    s => `${s}. Standar ini bukan kebetulan — setiap detail dirancang agar ${audiens} mendapatkan pengalaman yang benar-benar sepadan dengan kepercayaan yang mereka berikan kepada ${produk}.`,
    s => `${s}. Artinya, ${audiens} bisa langsung fokus pada hal yang paling penting tanpa terganggu kerumitan atau tahapan yang tidak perlu.`,
    s => `${s}. Ini bukan sekadar klaim — ribuan pengguna telah membuktikan sendiri bahwa ${produk} memang mengantarkan pada hasil yang nyata dan terukur.`,
  ];

  return expansions[index % expansions.length](clean);
}

function buildHeadlines(
  strategy: string,
  produk: string,
  audiens: string,
  tujuan: string,
  gradient: string,
  parsed: ReturnType<typeof parseDescription>
) {
  const tujuanLow = tujuan.toLowerCase();
  const isJual = tujuanLow.includes('jual') || tujuanLow.includes('beli') || tujuanLow.includes('order');
  const isLead = tujuanLow.includes('lead') || tujuanLow.includes('wa') || tujuanLow.includes('whatsapp') || tujuanLow.includes('konsultasi') || tujuanLow.includes('daftar');
  const audiensUp = audiens.toUpperCase();
  const span = (t: string) => `<span class="text-transparent bg-clip-text bg-gradient-to-r ${gradient} leading-tight">${t}</span>`;

  if (strategy === 'PAS Framework') {
    let headline = '';
    if (parsed.painPoints.length > 0) {
      const pain = parsed.painPoints[0].replace(/[.!?]$/, '');
      headline = `Masih "${pain}"? Saatnya Akhiri dengan ${span(produk)}`;
    } else if (isJual) {
      headline = `Hentikan Cara Lama yang Membuang Waktu dan Energi. Tingkatkan Hasil dengan ${span(produk)}`;
    } else {
      headline = `Sudah Cukup Berjuang Tanpa Hasil yang Nyata. ${span(produk)} Hadir Mengubah Itu Selamanya`;
    }

    const middleBody = parsed.painPoints.length > 0
      ? `Sebagai ${audiens}, Anda tahu betul betapa frustrasinya menghadapi ${parsed.painPoints[0].toLowerCase().replace(/[.!?]$/, '')}. Ini bukan soal kurang usaha — ini soal menggunakan strategi yang benar-benar tepat untuk situasi Anda.`
      : `Sebagai ${audiens}, setiap langkah tanpa arah yang jelas hanya menguras energi tanpa hasil nyata. ${produk} hadir sebagai jembatan yang jelas antara posisi Anda sekarang dan target yang ingin Anda capai.`;

    return {
      eyebrowType: 'warning',
      eyebrow: `MASALAH YANG DIHADAPI ${audiensUp}`,
      headline,
      middleTitle: `Setiap Hari Tanpa ${produk} Adalah Peluang yang Terlewat`,
      middleBody,
    };
  } else {
    let headline = '';
    if (isJual) {
      headline = `${audiens}, Saatnya Miliki ${span(produk)} dan Rasakan Perbedaan yang Nyata!`;
    } else if (isLead) {
      headline = `Konsultasikan Kebutuhan Anda Secara Gratis — Dapatkan Solusi Tepat dari ${span(produk)}`;
    } else {
      headline = `Raih Hasil Maksimal Lebih Cepat dan Lebih Terukur Bersama ${span(produk)}`;
    }

    const middleBody = parsed.benefits.length > 0
      ? `Ribuan ${audiens} telah membuktikannya: ${parsed.benefits[0].toLowerCase().replace(/[.!?]$/, '')}. Dengan ${produk}, pencapaian ini bukan lagi sesuatu yang jauh dari jangkauan Anda — ini hanya soal memulai.`
      : `Ribuan ${audiens} telah membuktikan bahwa dengan strategi yang tepat dan alat yang benar, target yang tampak jauh pun bisa dicapai lebih cepat dari yang pernah dibayangkan. ${produk} adalah kunci itu.`;

    return {
      eyebrowType: 'positive',
      eyebrow: `SOLUSI TERBAIK UNTUK ${audiensUp}`,
      headline,
      middleTitle: `Bayangkan Jika Setiap Upaya Anda Langsung Menghasilkan`,
      middleBody,
    };
  }
}

function buildContextualFAQ(produk: string, audiens: string, tujuan: string, desc: string) {
  const tujuanLow = tujuan.toLowerCase();
  const isJual = tujuanLow.includes('jual') || tujuanLow.includes('beli') || tujuanLow.includes('order');
  const firstLine = desc.split(/[.!?\n]/)[0]?.trim() || '';

  return [
    {
      q: `Apakah ${produk} cocok untuk ${audiens || 'saya'}?`,
      a: `Tentu. ${produk} dirancang spesifik untuk ${audiens || 'Anda'}. ${firstLine ? `Dengan pendekatan "${firstLine}", setiap fitur disesuaikan agar langsung relevan dengan tantangan nyata yang Anda hadapi sehari-hari.` : 'Setiap fitur dioptimalkan agar langsung bisa dirasakan manfaatnya, tanpa kurva belajar yang panjang.'}`
    },
    {
      q: isJual ? `Bagaimana cara memesan ${produk}?` : `Bagaimana cara memulai dengan ${produk}?`,
      a: isJual
        ? `Sangat mudah. Klik tombol pemesanan di halaman ini, lengkapi data Anda, dan konfirmasi pembayaran. ${produk} akan segera diproses dan Anda akan mendapatkan konfirmasi dalam waktu singkat.`
        : `Cukup klik tombol di halaman ini, isi formulir singkat berisi kebutuhan Anda, dan tim kami akan menghubungi Anda dalam waktu kurang dari 24 jam untuk langkah selanjutnya.`
    },
    {
      q: `Kapan saya mulai merasakan hasilnya?`,
      a: `Sebagian besar ${audiens || 'pengguna'} kami mulai merasakan perbedaan signifikan sejak pertama kali menggunakan ${produk}. Untuk hasil yang optimal dan berkelanjutan, konsistensi adalah kunci — dan tim kami siap mendampingi setiap prosesnya.`
    },
    {
      q: `Ada jaminan kepuasan?`,
      a: `Ya, tentu. Kami sangat yakin dengan apa yang ${produk} bisa berikan, sehingga setiap pembelian dilindungi oleh jaminan kepuasan penuh. Jika karena alasan apapun Anda tidak puas, hubungi kami dan kami pastikan semuanya beres — tanpa ribet.`
    }
  ];
}

function buildContextualTesti(produk: string, audiens: string, tujuan: string) {
  const tujuanLow = tujuan.toLowerCase();
  const isJual = tujuanLow.includes('jual') || tujuanLow.includes('beli');
  const isLead = tujuanLow.includes('konsultasi') || tujuanLow.includes('wa') || tujuanLow.includes('lead');
  const audiensShort = audiens ? audiens.split(' ').slice(0, 3).join(' ') : 'pengguna seperti saya';

  return [
    {
      text: isJual
        ? `Jujur saya skeptis di awal. Tapi setelah coba ${produk} selama 3 minggu, hasilnya jauh melampaui ekspektasi. Langsung repeat order dan rekomendasikan ke semua teman saya.`
        : `Proses dari awal sampai akhir sangat smooth. Tim ${produk} cepat respons dan selalu kasih solusi yang tepat sasaran. Beda banget dari yang pernah saya coba sebelumnya.`,
      name: 'Andi K.', job: 'Wiraswasta', img: 47
    },
    {
      text: `Sebagai ${audiensShort}, saya sudah coba banyak solusi serupa. Tapi ${produk} benar-benar beda — langsung terasa efeknya dan tidak perlu waktu adaptasi yang lama. Sangat merekomendasikan!`,
      name: 'Rina M.', job: 'Karyawan Swasta', img: 32
    },
    {
      text: isLead
        ? `Konsultasinya gratis, tapi kualitas sarannya premium. Setelah ngobrol dengan tim ${produk}, saya tahu persis apa yang harus dilakukan. Best decision ever!`
        : `Sudah pakai ${produk} berulang kali dan selalu puas. Kualitasnya konsisten, pelayanannya top, dan yang terpenting — hasilnya nyata dan bisa saya rasakan sendiri.`,
      name: 'Budi S.', job: 'Freelancer', img: 12
    }
  ];
}

// ============================================================
// GEMINI API KEY — ganti dengan key kamu
// ============================================================
const GEMINI_API_KEY = 'AIzaSyCW14lvzYI6_y7WO8eRipXuSuN0QTGOUhg';

// ============================================================
// WA GREETING GENERATOR
// ============================================================
function buildWAGreeting(produk: string, audiens: string, tujuan: string): string {
  const low = tujuan.toLowerCase();
  const isJual = low.includes('jual') || low.includes('beli') || low.includes('order');
  const isLead = low.includes('konsultasi') || low.includes('lead') || low.includes('daftar');
  if (isJual) return `Halo kak, saya tertarik dengan *${produk}* yang ada di halaman ini. Apakah masih tersedia? Boleh minta info lebih lanjut? 🙏`;
  if (isLead) return `Halo, saya ingin konsultasi lebih lanjut mengenai *${produk}*. Apakah bisa dijadwalkan waktunya? Terima kasih 😊`;
  return `Halo, saya ingin tahu lebih lanjut tentang *${produk}*. Bisa tolong bantu saya? 🙏`;
}

// ============================================================
// APP COMPONENT
// ============================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('pratinjau');
  const [deviceView, setDeviceView] = useState('desktop');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState('');
  const iframeRef = useRef(null);
  const fileInputRef = useRef(null);

  // — Gemini AI state —
  const [useGemini, setUseGemini] = useState(false);
  const [aiContent, setAiContent] = useState<Record<string, any> | null>(null);
  const [geminiError, setGeminiError] = useState('');

  const [formData, setFormData] = useState({
    jenisHalaman: 'Landing Page',
    strategiCopy: 'AIDA Framework',
    namaProduk: '',
    deskripsi: '',
    tujuan: '',
    targetAudiens: '',
    nuansaDesain: 'Modern & Minimalis',
    teksCTA: '',
    harga: '',
    orderType: 'wa' as 'wa' | 'link',
    orderWA: '',
    waGreeting: '',
    orderLink: '',
    temaWarna: 'ocean',
    useFloatingWA: false,
    noWA: '',
    useCountdown: false,
    useTesti: false,
    useFAQ: false,
    urlYoutube: '',
    bonus: '',
    gambarUtama: ''
  });

  const themes = [
    { id: 'emerald', label: 'EMERALD', color1: 'bg-emerald-400', color2: 'bg-emerald-600', tailwind: { primary: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', gradient: 'from-emerald-400 to-emerald-700', soft: 'bg-emerald-50', hex: '#059669' } },
    { id: 'ocean', label: 'OCEAN', color1: 'bg-blue-400', color2: 'bg-blue-600', tailwind: { primary: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-400 to-blue-800', soft: 'bg-blue-50', hex: '#2563eb' } },
    { id: 'luxury', label: 'LUXURY', color1: 'bg-gray-700', color2: 'bg-gray-900', tailwind: { primary: 'bg-gray-900', hover: 'hover:bg-black', text: 'text-gray-900', light: 'bg-gray-100', border: 'border-gray-300', gradient: 'from-gray-600 to-black', soft: 'bg-gray-50', hex: '#111827' } },
    { id: 'coral', label: 'CORAL', color1: 'bg-rose-400', color2: 'bg-rose-500', tailwind: { primary: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200', gradient: 'from-rose-400 to-rose-700', soft: 'bg-rose-50', hex: '#f43f5e' } },
    { id: 'sunset', label: 'SUNSET', color1: 'bg-orange-400', color2: 'bg-orange-500', tailwind: { primary: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-400 to-orange-700', soft: 'bg-orange-50', hex: '#f97316' } },
    { id: 'cyber', label: 'CYBER', color1: 'bg-purple-500', color2: 'bg-fuchsia-600', tailwind: { primary: 'bg-fuchsia-600', hover: 'hover:bg-fuchsia-700', text: 'text-fuchsia-600', light: 'bg-fuchsia-50', border: 'border-fuchsia-200', gradient: 'from-purple-500 to-fuchsia-700', soft: 'bg-fuchsia-50', hex: '#c026d3' } }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setAiContent(null);
    setGeminiError('');
  };

  // — Gemini: generate copy via Google AI —
  const generateWithGemini = async (): Promise<Record<string, any>> => {
    const { namaProduk, deskripsi, targetAudiens, tujuan, strategiCopy, nuansaDesain, orderType } = formData;
    const prompt = `Kamu adalah copywriter profesional Indonesia spesialis landing page marketing.

Data produk:
- Nama Produk: ${namaProduk || 'Produk'}
- Deskripsi: ${deskripsi || '-'}
- Target Audiens: ${targetAudiens || 'umum'}
- Tujuan: ${tujuan || 'penjualan'}
- Framework: ${strategiCopy}
- Nuansa: ${nuansaDesain}

Tugas: Buat copy landing page yang compelling, natural, dan persuasif dalam Bahasa Indonesia.

Balas HANYA dengan JSON valid (tidak ada penjelasan, tidak ada markdown, langsung JSON):
{
  "eyebrow": "teks badge singkat di atas headline, max 8 kata, HURUF BESAR",
  "headline": "headline utama yang powerful, bisa pakai angka atau pertanyaan, max 12 kata",
  "subHeadline": "2-3 kalimat sub-headline yang meyakinkan dan spesifik",
  "featureTitles": ["judul fitur 1", "judul fitur 2", "judul fitur 3"],
  "featureDescs": ["deskripsi fitur 1 (2 kalimat)", "deskripsi fitur 2 (2 kalimat)", "deskripsi fitur 3 (2 kalimat)"],
  "middleTitle": "judul section tengah yang menggugah emosi",
  "middleBody": "2-3 kalimat yang menjelaskan masalah atau desire audiens secara spesifik",
  "ctaTitle": "judul CTA bagian bawah yang urgent",
  "ctaSub": "1-2 kalimat pendukung CTA yang mengurangi keraguan",
  "testiTexts": ["testimoni 1 natural 2-3 kalimat", "testimoni 2", "testimoni 3"],
  "faqAnswers": ["jawaban FAQ 1 yang meyakinkan", "jawaban FAQ 2", "jawaban FAQ 3", "jawaban FAQ 4"]${orderType === 'wa' ? `,
  "waGreeting": "pesan WA pembuka yang natural, friendly, dan relevan dengan produk, max 2 kalimat, boleh pakai emoji"` : ''}
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 1500 }
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini error ${res.status}. Periksa API key kamu.`);
    }

    const data = await res.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini tidak mengembalikan JSON yang valid. Coba lagi.');
    return JSON.parse(match[0]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageError('');
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setImageError('Maks. 1MB!');
      e.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => { handleInputChange('gambarUtama', reader.result); };
    reader.readAsDataURL(file);
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // ============================================================
  // GENERATE HTML
  // ============================================================
  const generateHTML = () => {
    const theme = themes.find(t => t.id === formData.temaWarna)?.tailwind || themes[1].tailwind;

    const produk = formData.namaProduk.trim() || 'Produk Revolusioner';
    const audiensRaw = formData.targetAudiens.trim();
    const audiensPendek = audiensRaw ? audiensRaw.split(' ').slice(0, 5).join(' ') : 'Anda';
    const deskripsi = formData.deskripsi.trim();
    const tujuan = formData.tujuan.toLowerCase().trim();
    const tujuanLow = tujuan;
    const isJual = tujuanLow.includes('jual') || tujuanLow.includes('beli') || tujuanLow.includes('order');
    const isLead = tujuanLow.includes('lead') || tujuanLow.includes('wa') || tujuanLow.includes('konsultasi');

    // — Intelligence Engine (template fallback) —
    const parsed = parseDescription(deskripsi, produk, audiensPendek);
    const headlines = buildHeadlines(formData.strategiCopy, produk, audiensPendek, tujuan, theme.gradient, parsed);
    const heroSubHeadline = aiContent?.subHeadline || synthesizeHeroSubHeadline(produk, audiensPendek, tujuan, deskripsi, parsed);

    // AI overrides untuk headline & eyebrow
    const ai = aiContent; // shorthand

    // — Design Variables —
    const isElegant = formData.nuansaDesain === 'Elegan & Mewah';
    const isPlayful = formData.nuansaDesain === 'Ceria & Playful';

    let fontImport: string, fontFamily: string, btnClass: string, roundedClass: string;
    let heroBgClass: string, sectionBgAlt: string, highlightCardClass: string, bodyClass: string;

    if (isElegant) {
      fontImport = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');";
      fontFamily = "'Lato', sans-serif";
      roundedClass = "rounded-none";
      btnClass = `bg-gradient-to-r ${theme.gradient} text-white font-bold uppercase tracking-[0.2em] border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-all duration-300`;
      bodyClass = "bg-[#0a0a0a] text-gray-300";
      heroBgClass = "bg-[#111] border-b border-gray-800";
      sectionBgAlt = "bg-[#0a0a0a]";
      highlightCardClass = `bg-[#161616] p-7 md:p-10 border border-gray-800 hover:border-gray-600 transition-all duration-300 shadow-2xl`;
    } else if (isPlayful) {
      fontImport = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');";
      fontFamily = "'Plus Jakarta Sans', sans-serif";
      roundedClass = "rounded-xl";
      btnClass = `${theme.primary} text-white font-black text-lg md:text-xl rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-150 uppercase`;
      bodyClass = "bg-[#fffdf8] text-black";
      heroBgClass = `${theme.soft} border-b-4 border-black`;
      sectionBgAlt = "bg-white";
      highlightCardClass = `bg-white p-6 md:p-8 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`;
    } else {
      fontImport = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');";
      fontFamily = "'Inter', sans-serif";
      roundedClass = "rounded-2xl";
      btnClass = `${theme.primary} ${theme.hover} text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200`;
      bodyClass = "bg-white text-slate-800";
      heroBgClass = "bg-slate-50 relative overflow-hidden";
      sectionBgAlt = "bg-slate-50/50";
      highlightCardClass = `bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1 transition-all duration-300`;
    }

    const mediaBorder = isPlayful ? 'border-4 border-black' : isElegant ? 'border border-gray-700' : 'border-4 border-white/50 shadow-2xl';

    // — Theme-specific CSS injected into <style> —
    const themeCSS = !isElegant && !isPlayful ? `
      header::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(circle, ${theme.hex}0f 1px, transparent 1px);
        background-size: 28px 28px;
        pointer-events: none;
        z-index: 0;
      }` : isPlayful ? `
      .playful-top { height: 7px; background: #000; width: 100%; display: block; }
      .section-label { display: inline-block; background: #000; color: #fff; font-size: 10px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; padding: 5px 14px; margin-bottom: 16px; }
      h2 { letter-spacing: -0.02em; }` : `
      .elegant-line { display: block; width: 48px; height: 1px; background: linear-gradient(to right, rgba(212,175,55,0.6), rgba(212,175,55,0.1)); margin: 12px auto 0; }
      header { background: radial-gradient(ellipse at 50% 0%, #1a1a1a 0%, #0a0a0a 70%); }`;

    // — Power Words Bold —
    const formatCopy = (text: string) => {
      if (!text) return '';
      let f = text.replace(/\n/g, '<br/>');
      const triggers = ['rahasia', 'terbukti', 'ampuh', 'cepat', 'diskon', 'gratis', 'terbaik', 'premium', 'solusi', 'mudah', 'tanpa', 'glowing', 'garansi', 'sekarang', 'terbatas', 'eksklusif', 'langsung', 'otomatis', 'hemat', 'efektif', 'nyata', 'spesial'];
      const boldClass = isElegant ? `font-semibold text-white` : `font-extrabold ${theme.text}`;
      triggers.forEach(word => {
        f = f.replace(new RegExp(`\\b${word}\\b`, 'gi'), `<strong class="${boldClass}">$&</strong>`);
      });
      return f;
    };

    // — Eyebrow —
    const eyebrowText = ai?.eyebrow || headlines.eyebrow;
    const eyebrowType = ai ? 'positive' : headlines.eyebrowType;
    const eyebrowHTML = eyebrowType === 'warning'
      ? `<span class="inline-block py-1.5 px-5 bg-red-100 text-red-700 text-xs font-bold tracking-widest ${roundedClass} mb-5 md:mb-7 uppercase border border-red-200 shadow-sm animate-pulse">${eyebrowText}</span>`
      : isPlayful
        ? `<span class="section-label">${eyebrowText}</span>`
        : `<span class="inline-block py-1.5 px-5 ${theme.primary} text-white text-xs font-bold tracking-widest ${roundedClass} mb-5 md:mb-7 uppercase shadow-sm">${eyebrowText}</span>`;

    // — Middle Strategy Section —
    // Elegant = always dark bg regardless of theme.soft (which is light)
    const middlePasBg = isElegant ? 'bg-[#160808] border-y border-red-900/40' : 'bg-red-50/60 border-y border-red-100';
    const middleAidaBg = isElegant ? 'bg-[#0d0d0d] border-y border-gray-800/60' : theme.soft;
    const midTitle = ai?.middleTitle || headlines.middleTitle;
    const midBody = ai?.middleBody || headlines.middleBody;
    const middleStrategyHTML = formData.strategiCopy === 'PAS Framework' ? `
      <section class="py-16 md:py-24 px-5 md:px-8 ${middlePasBg}">
        <div class="max-w-3xl mx-auto text-center">
          ${isPlayful ? '<span class="section-label">PERHATIAN</span>' : ''}
          <h2 class="text-2xl md:text-4xl font-bold ${isElegant ? 'text-white' : 'text-gray-900'} mb-4 md:mb-6">${midTitle}</h2>
          ${isElegant ? '<span class="elegant-line"></span>' : ''}
          <p class="text-base md:text-lg ${isElegant ? 'text-gray-300' : 'text-gray-600'} mt-6 md:mt-8 leading-relaxed">${midBody}</p>
          <div class="mt-6 md:mt-8 text-lg md:text-xl font-semibold ${isElegant ? 'text-red-400' : theme.text} italic">"Saatnya beralih ke cara yang tepat."</div>
        </div>
      </section>` : `
      <section class="py-16 md:py-24 px-5 md:px-8 ${middleAidaBg}">
        <div class="max-w-3xl mx-auto text-center">
          ${isPlayful ? '<span class="section-label">MENGAPA INI PENTING</span>' : ''}
          <h2 class="text-2xl md:text-4xl font-bold ${isElegant ? 'text-white' : 'text-gray-900'} mb-4 md:mb-6">${midTitle}</h2>
          ${isElegant ? '<span class="elegant-line"></span>' : ''}
          <p class="text-base md:text-lg ${isElegant ? 'text-gray-300' : 'text-gray-700'} mt-6 md:mt-8 leading-relaxed">${midBody}</p>
          <div class="w-12 h-1 ${theme.primary} mx-auto mt-8 md:mt-10"></div>
        </div>
      </section>`;

    // — Order URL builder —
    const orderUrl = (() => {
      if (formData.orderType === 'wa') {
        const raw = formData.orderWA.trim();
        if (!raw) return '#';
        const digitsOnly = raw.replace(/\D/g, '');
        const normalized = digitsOnly.startsWith('0') ? `62${digitsOnly.slice(1)}` : digitsOnly;
        const greeting = ai?.waGreeting || formData.waGreeting.trim() || buildWAGreeting(produk, audiensPendek, tujuan);
        return `https://wa.me/${normalized}?text=${encodeURIComponent(greeting)}`;
      }
      const raw = formData.orderLink.trim();
      if (!raw) return '#';
      if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
      return `https://${raw}`;
    })();

    // — CTA Config —
    let ctaTitle = ai?.ctaTitle || `Waktunya Ambil Langkah, ${audiensPendek}`;
    let ctaSub = ai?.ctaSub || `Ribuan ${audiensPendek} sudah memulai. Jangan biarkan mereka semakin jauh meninggalkan Anda.`;
    if (!ai) {
      if (isJual) {
        ctaTitle = `Miliki ${produk} Sekarang!`;
        ctaSub = 'Stok penawaran sangat terbatas — amankan posisi Anda sebelum kehabisan dan harga kembali normal.';
      } else if (isLead) {
        ctaTitle = `Konsultasi Gratis Bersama Tim ${produk}`;
        ctaSub = `Sesi eksklusif untuk ${audiensPendek} — kami dengarkan kebutuhan Anda dan berikan solusi yang tepat sasaran.`;
      }
    }

    // — Trust Indicators (hero area) —
    const trustItems = [
      isJual ? '10.000+ Pembeli Puas' : '5.000+ Pengguna Aktif',
      'Garansi Kepuasan Penuh',
      isLead ? 'Respons dalam 24 Jam' : 'Hasil Terbukti & Nyata',
    ];
    const checkIcon = `<svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`;
    const trustHTML = `
      <div class="mt-8 md:mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs md:text-sm font-semibold ${isElegant ? 'text-gray-500' : 'text-gray-400'}">
        ${trustItems.map(t => `<span class="flex items-center gap-1.5"><span class="${theme.text}">${checkIcon}</span>${t}</span>`).join('')}
      </div>`;

    // — Smart Media Placement —
    const ytId = getYoutubeId(formData.urlYoutube);
    let heroMedia = '';
    let demoSectionHTML = '';

    if (formData.gambarUtama && ytId) {
      heroMedia = `
        <div class="max-w-3xl mx-auto mt-10 md:mt-14 mb-4 ${roundedClass} overflow-hidden ${mediaBorder} relative group z-10">
          <img src="${formData.gambarUtama}" alt="${produk}" class="w-full object-cover max-h-[420px] transition duration-700 group-hover:scale-[1.03]" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end justify-center pb-6">
            <span class="text-white font-bold tracking-wide text-sm md:text-lg drop-shadow-lg">${produk} — Tampilan Asli</span>
          </div>
        </div>`;
      demoSectionHTML = `
        <section class="py-20 md:py-28 px-5 md:px-8 bg-gray-950 text-white">
          <div class="max-w-4xl mx-auto text-center">
            ${isPlayful ? '<span class="section-label" style="background:#fff;color:#000;">DEMO LANGSUNG</span>' : '<span class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 block">Demo Langsung</span>'}
            <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-white">Lihat ${produk} Beraksi</h2>
            <p class="text-gray-400 mb-8 md:mb-12 text-base md:text-lg max-w-2xl mx-auto">Tonton bagaimana ${produk} bekerja dan mengapa ${audiensPendek} memilihnya sebagai solusi utama mereka.</p>
            <div class="aspect-video ${roundedClass} overflow-hidden shadow-2xl ${mediaBorder}">
              <iframe class="w-full h-full" src="https://www.youtube.com/embed/${ytId}" title="${produk} Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </section>`;
    } else if (formData.gambarUtama) {
      heroMedia = `
        <div class="max-w-3xl mx-auto mt-10 md:mt-14 mb-4 ${roundedClass} overflow-hidden ${mediaBorder} relative group z-10">
          <img src="${formData.gambarUtama}" alt="${produk}" class="w-full object-cover max-h-[460px] transition duration-700 group-hover:scale-[1.03]" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end justify-center pb-6">
            <span class="text-white font-bold tracking-wide text-sm md:text-lg drop-shadow-lg">Tampilan Nyata ${produk}</span>
          </div>
        </div>`;
    } else if (ytId) {
      heroMedia = `
        <div class="max-w-3xl mx-auto aspect-video mt-10 md:mt-14 mb-4 ${roundedClass} overflow-hidden ${mediaBorder} z-10 relative">
          <iframe class="w-full h-full" src="https://www.youtube.com/embed/${ytId}" title="${produk}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;
    }

    // — Feature Cards —
    const featureIcons = [
      `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
      `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`,
      `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`,
    ];

    const featureCardsHTML = parsed.features.map((feat, i) => `
      <div class="${highlightCardClass}">
        <div class="w-12 h-12 md:w-14 md:h-14 ${theme.light} ${theme.text} ${roundedClass} flex items-center justify-center mb-5 md:mb-6">
          ${featureIcons[i]}
        </div>
        <h3 class="font-bold text-base md:text-lg mb-2 md:mb-3 ${isElegant ? 'text-white' : 'text-gray-800'}">${ai?.featureTitles?.[i] || getFeatureTitle(feat, i)}</h3>
        <p class="${isElegant ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm md:text-base">${formatCopy(ai?.featureDescs?.[i] || expandFeatureDescription(feat, produk, audiensPendek, i))}</p>
      </div>
    `).join('');

    // — Testimonials —
    const testiItems = buildContextualTesti(produk, audiensPendek, tujuan);
    const testiCardsHTML = testiItems.map((t, idx) => `
      <div class="${highlightCardClass} text-left relative">
        <div class="text-5xl text-gray-200 opacity-30 absolute top-4 right-6 font-serif leading-none">"</div>
        <div class="flex text-yellow-400 mb-4 text-base md:text-lg">★★★★★</div>
        <p class="mb-6 md:mb-8 relative z-10 leading-relaxed text-sm md:text-base ${isElegant ? 'text-gray-300' : 'text-gray-700'}">"${ai?.testiTexts?.[idx] || t.text}"</p>
        <div class="flex items-center border-t ${isElegant ? 'border-gray-800' : 'border-gray-100'} pt-4 md:pt-5">
          <div class="w-11 h-11 rounded-full mr-3 md:mr-4 overflow-hidden border-2 ${theme.border} shrink-0">
            <img src="https://i.pravatar.cc/100?img=${t.img}" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <div class="font-bold text-sm md:text-base ${isElegant ? 'text-gray-200' : 'text-gray-800'}">${t.name}</div>
            <div class="text-xs md:text-sm font-normal ${isElegant ? 'text-gray-500' : 'text-gray-400'}">${t.job}</div>
          </div>
        </div>
      </div>
    `).join('');

    // — FAQ —
    const faqItems = buildContextualFAQ(produk, audiensPendek, tujuan, deskripsi);
    const faqHTML = faqItems.map((f, idx) => `
      <details class="group ${isElegant ? 'bg-[#161616] border-gray-800' : 'bg-gray-50 border-gray-200'} border ${roundedClass} shadow-sm overflow-hidden">
        <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-5 md:p-6 ${isElegant ? 'text-gray-200 hover:text-white' : 'text-gray-800 hover:text-gray-900'} transition-colors text-sm md:text-base">
          <span class="pr-4">${f.q}</span>
          <span class="transition-transform duration-300 group-open:rotate-180 ${theme.text} shrink-0">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </summary>
        <div class="px-5 md:px-6 pb-5 md:pb-6 border-t ${isElegant ? 'border-gray-800' : 'border-gray-100'}">
          <p class="pt-4 leading-relaxed text-sm md:text-base ${isElegant ? 'text-gray-400' : 'text-gray-600'}">${ai?.faqAnswers?.[idx] || f.a}</p>
        </div>
      </details>
    `).join('');

    // — Price —
    const hargaAngka = parseInt(formData.harga.replace(/\D/g, '')) || 0;
    const hargaCoret = hargaAngka > 0 ? `Rp ${(hargaAngka * 2).toLocaleString('id-ID')}` : '';

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${produk}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${fontImport}
    * { box-sizing: border-box; }
    body { font-family: ${fontFamily}; }
    ${isElegant ? "h1, h2, h3 { font-family: 'Playfair Display', serif; }" : ""}
    .aspect-video { aspect-ratio: 16 / 9; }
    html { scroll-behavior: smooth; }
    img { max-width: 100%; }
    ${themeCSS}
  </style>
</head>
<body class="${bodyClass} antialiased overflow-x-hidden">
${isPlayful ? '<div class="playful-top"></div>' : ''}

  <!-- HERO -->
  <header class="${heroBgClass} py-16 md:py-28 lg:py-36 px-5 md:px-8">
    ${!isElegant && !isPlayful ? `
    <div class="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] ${theme.light} rounded-full blur-[80px] md:blur-[120px] opacity-60 -z-10 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-56 md:w-[400px] h-56 md:h-[400px] ${theme.light} rounded-full blur-[60px] md:blur-[100px] opacity-50 -z-10 pointer-events-none"></div>
    ` : ''}
    <div class="max-w-4xl mx-auto text-center relative z-10">
      ${eyebrowHTML}
      <h1 class="text-3xl md:text-5xl lg:text-[3.75rem] ${isElegant ? 'font-bold' : 'font-black'} leading-[1.12] mb-4 md:mb-6 tracking-tight ${isElegant ? 'text-white' : ''}">
        ${ai?.headline ? `<span class="text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient} leading-tight">${ai.headline}</span>` : headlines.headline}
      </h1>
      <p class="text-base md:text-xl ${isElegant ? 'text-gray-400' : 'text-gray-600'} mb-0 max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
        ${formatCopy(heroSubHeadline)}
      </p>
      ${heroMedia}
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 md:mt-12 relative z-20">
        <a href="${orderUrl}" class="${btnClass} py-4 md:py-5 px-8 md:px-12 text-base md:text-lg w-full sm:w-auto inline-flex items-center justify-center text-center">
          ${formData.teksCTA || 'Ambil Penawaran Ini'}
          ${!isElegant ? `<svg class="w-5 h-5 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>` : ''}
        </a>
      </div>
      ${trustHTML}
    </div>
  </header>

  <!-- MIDDLE STRATEGY -->
  ${middleStrategyHTML}

  <!-- FEATURES -->
  <section class="py-16 md:py-28 px-5 md:px-8 ${sectionBgAlt}">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 md:mb-16 max-w-2xl md:max-w-3xl mx-auto">
        ${isPlayful ? '<span class="section-label">KEUNGGULAN KAMI</span>' : ''}
        <h2 class="text-2xl md:text-4xl ${isElegant ? 'font-serif text-white' : 'font-bold text-gray-900'} mb-3 md:mb-4">
          Mengapa ${audiensPendek} Memilih ${produk}
        </h2>
        ${isElegant ? '<span class="elegant-line"></span>' : ''}
        <p class="text-sm md:text-lg ${isElegant ? 'text-gray-500 mt-6' : 'text-gray-500 mt-3 md:mt-4'}">
          Tiga hal utama yang membuat ${produk} berbeda — dan mengapa ribuan orang tidak mau kembali ke cara lama.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        ${featureCardsHTML}
      </div>
    </div>
  </section>

  <!-- DEMO SECTION (jika ada image + youtube) -->
  ${demoSectionHTML}

  <!-- BONUS -->
  ${formData.bonus ? `
  <section class="py-16 md:py-24 px-5 md:px-8 ${theme.primary}">
    <div class="max-w-3xl md:max-w-4xl mx-auto bg-white p-8 md:p-16 ${roundedClass} shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-yellow-400 rounded-bl-full opacity-20 -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
      <div class="text-center relative z-10">
        <span class="inline-block bg-red-100 text-red-600 font-black px-4 md:px-5 py-2 text-xs md:text-sm rounded-full mb-4 md:mb-6 tracking-widest uppercase">🎁 Bonus Khusus Hari Ini</span>
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Dapatkan Ekstra Ini Bersama ${produk}:</h3>
        <p class="text-xl md:text-2xl text-gray-800 font-bold border-b-4 border-dashed ${theme.border} pb-4 md:pb-6 inline-block">"${formData.bonus}"</p>
        <p class="text-gray-400 mt-3 md:mt-4 text-xs md:text-sm">Bonus hanya berlaku untuk pembelian melalui halaman ini. Stok terbatas.</p>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- TESTIMONIALS -->
  ${formData.useTesti ? `
  <section class="py-16 md:py-28 px-5 md:px-8 ${isElegant ? 'bg-[#111]' : 'bg-white'} border-y ${isElegant ? 'border-gray-800' : 'border-gray-100'}">
    <div class="max-w-5xl md:max-w-6xl mx-auto">
      <div class="text-center mb-10 md:mb-14">
        ${isPlayful ? '<span class="section-label">MEREKA SUDAH BUKTIKAN</span>' : '<span class="text-xs font-bold tracking-[0.2em] ' + (isElegant ? 'text-gray-500' : 'text-gray-400') + ' uppercase mb-3 block">Testimoni Nyata</span>'}
        <h2 class="text-2xl md:text-4xl ${isElegant ? 'font-serif text-white' : 'font-bold text-gray-900'}">
          Apa Kata Mereka yang Sudah Buktikan ${produk}
        </h2>
        ${isElegant ? '<span class="elegant-line"></span>' : ''}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        ${testiCardsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- COUNTDOWN -->
  ${formData.useCountdown ? `
  <section class="py-10 md:py-14 px-5 md:px-8 bg-red-600 text-white">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
      <div class="text-center md:text-left">
        <h3 class="text-xl md:text-3xl font-black uppercase tracking-wide">Penawaran ${produk} Berakhir Dalam:</h3>
        <p class="text-red-200 text-sm md:text-base mt-1">Harga spesial ini hanya untuk waktu yang sangat terbatas.</p>
      </div>
      <div class="flex gap-2 md:gap-3 text-center justify-center shrink-0">
        <div class="bg-white text-red-600 p-3 md:p-4 ${roundedClass} w-16 md:w-20 shadow-xl"><div id="hours" class="text-2xl md:text-3xl font-black leading-none">12</div><div class="text-[9px] md:text-[10px] uppercase font-bold mt-1 tracking-wider text-gray-500">Jam</div></div>
        <div class="text-2xl md:text-3xl font-bold flex items-center pb-1">:</div>
        <div class="bg-white text-red-600 p-3 md:p-4 ${roundedClass} w-16 md:w-20 shadow-xl"><div id="mins" class="text-2xl md:text-3xl font-black leading-none">45</div><div class="text-[9px] md:text-[10px] uppercase font-bold mt-1 tracking-wider text-gray-500">Mnt</div></div>
        <div class="text-2xl md:text-3xl font-bold flex items-center pb-1">:</div>
        <div class="bg-white text-red-600 p-3 md:p-4 ${roundedClass} w-16 md:w-20 shadow-xl"><div id="secs" class="text-2xl md:text-3xl font-black leading-none">30</div><div class="text-[9px] md:text-[10px] uppercase font-bold mt-1 tracking-wider text-gray-500">Dtk</div></div>
      </div>
    </div>
  </section>
  <script>
    let t=12*3600+45*60+30;
    setInterval(()=>{t--;document.getElementById('hours').innerText=String(Math.floor(t/3600)).padStart(2,'0');document.getElementById('mins').innerText=String(Math.floor((t%3600)/60)).padStart(2,'0');document.getElementById('secs').innerText=String(t%60).padStart(2,'0');},1000);
  </script>
  ` : ''}

  <!-- BOTTOM CTA -->
  <section class="py-16 md:py-28 px-5 md:px-8 ${isElegant ? 'bg-[#0a0a0a]' : 'bg-gray-50'} border-t ${isElegant ? 'border-gray-800' : 'border-gray-200'}">
    <div class="max-w-2xl md:max-w-3xl mx-auto text-center ${isElegant ? 'bg-[#111] border border-gray-800' : 'bg-white border border-gray-100'} p-8 md:p-16 ${roundedClass} shadow-2xl">
      ${isPlayful ? '<div class="w-full h-2 bg-black rounded-t-xl -mt-8 md:-mt-16 mb-8 md:mb-12 -mx-8 md:-mx-16 px-0"></div>' : ''}
      <h2 class="text-2xl md:text-4xl ${isElegant ? 'font-serif text-white' : 'font-bold text-gray-900'} mb-3 md:mb-5">${ctaTitle}</h2>
      <p class="text-sm md:text-lg mb-8 md:mb-12 ${isElegant ? 'text-gray-400' : 'text-gray-500'} max-w-lg mx-auto leading-relaxed">${ctaSub}</p>
      ${formData.harga ? `
      <div class="${isElegant ? 'bg-[#1a1a1a]' : 'bg-gray-50'} py-6 md:py-8 px-4 ${roundedClass} mb-8 md:mb-10">
        ${hargaCoret ? `<p class="text-xs md:text-sm line-through mb-1.5 ${isElegant ? 'text-gray-600' : 'text-gray-400'}">Harga Normal: ${hargaCoret}</p>` : ''}
        <div class="text-4xl md:text-6xl font-black ${theme.text}">${formData.harga}</div>
        <p class="text-xs mt-2 ${isElegant ? 'text-gray-600' : 'text-gray-400'}">Harga spesial hanya melalui halaman ini</p>
      </div>
      ` : ''}
      <a href="${orderUrl}" class="${btnClass} py-4 md:py-5 px-8 md:px-12 text-lg md:text-xl w-full block text-center">
        ${formData.teksCTA || 'Ambil Penawaran Sekarang'}
      </a>
      <p class="text-xs md:text-sm mt-6 md:mt-8 flex items-center justify-center gap-1.5 font-medium ${isElegant ? 'text-gray-600' : 'text-gray-400'}">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Pembayaran 100% Aman &amp; Terenkripsi. Privasi Terjaga.
      </p>
    </div>
  </section>

  <!-- FAQ -->
  ${formData.useFAQ ? `
  <section class="py-16 md:py-28 px-5 md:px-8 ${isElegant ? 'bg-[#111]' : 'bg-white'} border-t ${isElegant ? 'border-gray-800' : 'border-gray-100'}">
    <div class="max-w-2xl md:max-w-3xl mx-auto">
      <div class="text-center mb-8 md:mb-12">
        ${isPlayful ? '<span class="section-label">PERTANYAAN UMUM</span>' : '<span class="text-xs font-bold tracking-[0.2em] ' + (isElegant ? 'text-gray-500' : 'text-gray-400') + ' uppercase mb-3 block">Pertanyaan Umum</span>'}
        <h2 class="text-2xl md:text-3xl font-bold ${isElegant ? 'text-white' : 'text-gray-900'}">Ada Pertanyaan tentang ${produk}?</h2>
        ${isElegant ? '<span class="elegant-line"></span>' : ''}
      </div>
      <div class="space-y-3 md:space-y-4">${faqHTML}</div>
    </div>
  </section>` : ''}

  <!-- FOOTER -->
  <footer class="bg-gray-950 py-10 md:py-14 px-5 md:px-8 text-center text-gray-400 text-xs md:text-sm">
    <div class="max-w-4xl mx-auto">
      <p class="mb-3 text-gray-300 font-semibold text-sm md:text-base">&copy; 2026 ${produk}. Hak Cipta Dilindungi.</p>
      <p class="text-gray-600 max-w-2xl mx-auto leading-relaxed">Disclaimer: Hasil individual dapat bervariasi tergantung berbagai faktor. Kinerja yang disebutkan merupakan gambaran umum berdasarkan pengalaman nyata pengguna. Pastikan membaca syarat &amp; ketentuan sebelum bertransaksi.</p>
    </div>
  </footer>

  <!-- FLOATING WA -->
  ${formData.useFloatingWA && formData.noWA ? `
  <a href="https://wa.me/${formData.noWA}" target="_blank" rel="noopener" class="fixed bottom-5 right-5 md:bottom-6 md:right-6 bg-[#25D366] text-white p-3.5 md:p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:scale-110 hover:shadow-[0_15px_40px_rgba(37,211,102,0.55)] transition-all duration-300 z-50 flex items-center justify-center">
    <svg class="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
  </a>` : ''}

</body>
</html>`;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeminiError('');

    if (useGemini) {
      try {
        const result = await generateWithGemini();
        setAiContent(result);
      } catch (err: any) {
        setGeminiError(err.message || 'Gagal menghubungi Gemini API.');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setIsGenerated(true);
      setActiveTab('pratinjau');
    } else {
      setAiContent(null);
      setTimeout(() => {
        setIsLoading(false);
        setIsGenerated(true);
        setActiveTab('pratinjau');
      }, 1200);
    }
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(html);
    } else {
      const ta = document.createElement('textarea');
      ta.value = html;
      ta.style.position = 'absolute';
      ta.style.left = '-999999px';
      document.body.prepend(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {} finally { ta.remove(); }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = formData.namaProduk ? formData.namaProduk.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'landing-page';
    a.download = `${fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] font-sans text-gray-800 overflow-hidden">

      {/* SIDEBAR KIRI */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

        <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm shadow-blue-600/30">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">LP Generator V.3</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

          <section>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <Flag size={14} className="mr-2" />
              Core Config
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Jenis Halaman</label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none" value={formData.jenisHalaman} onChange={(e) => handleInputChange('jenisHalaman', e.target.value)}>
                  <option>Landing Page</option>
                  <option>Sales Page</option>
                  <option>Toko Online</option>
                  <option>Blog Page</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Strategi Copy</label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none" value={formData.strategiCopy} onChange={(e) => handleInputChange('strategiCopy', e.target.value)}>
                  <option>AIDA Framework</option>
                  <option>PAS Framework</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Nama Produk / Brand</label>
                <input type="text" placeholder="Misal: Skincare Glow" className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.namaProduk} onChange={(e) => handleInputChange('namaProduk', e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Deskripsi / Detail Penawaran</label>
                <textarea rows={4} placeholder="Ketik detail produk Anda. AI akan mengembangkan & menyintesis jadi copy marketing yang kuat..." className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400 resize-none" value={formData.deskripsi} onChange={(e) => handleInputChange('deskripsi', e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Tujuan Halaman</label>
                <input type="text" placeholder="Misal: Penjualan, Leads, Edukasi, Konsultasi..." className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.tujuan} onChange={(e) => handleInputChange('tujuan', e.target.value)} />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <Users size={14} className="mr-2" />
              Strategi & Audiens
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Target Audiens (Mempengaruhi seluruh copy)</label>
              <textarea rows={3} placeholder="Contoh: Pekerja kantoran sibuk yang ingin berinvestasi saham..." className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400 resize-none" value={formData.targetAudiens} onChange={(e) => handleInputChange('targetAudiens', e.target.value)} />
            </div>
          </section>

          <section>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <Palette size={14} className="mr-2" />
              Desain & Tombol
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Nuansa Desain</label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none" value={formData.nuansaDesain} onChange={(e) => handleInputChange('nuansaDesain', e.target.value)}>
                  <option>Modern & Minimalis</option>
                  <option>Elegan & Mewah</option>
                  <option>Ceria & Playful</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Teks Tombol CTA</label>
                <input type="text" placeholder="Misal: Beli Sekarang" className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow" value={formData.teksCTA} onChange={(e) => handleInputChange('teksCTA', e.target.value)} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Harga</label>
              <input type="text" placeholder="Rp 299.000" className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow" value={formData.harga} onChange={(e) => handleInputChange('harga', e.target.value)} />
            </div>

            {/* ORDER TYPE SELECTOR */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-600 mb-2">Tujuan Tombol CTA</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => handleInputChange('orderType', 'wa')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-bold transition-colors ${formData.orderType === 'wa' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <MessageCircle size={13} /> WhatsApp
                </button>
                <button
                  onClick={() => handleInputChange('orderType', 'link')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-bold transition-colors border-l border-gray-200 ${formData.orderType === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Phone size={13} /> Link / Checkout
                </button>
              </div>
            </div>

            {formData.orderType === 'wa' ? (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Nomor WhatsApp</label>
                  <input type="text" placeholder="628123456789 atau 08123456789" className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-shadow placeholder-gray-400" value={formData.orderWA} onChange={(e) => handleInputChange('orderWA', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                    Greeting WA <span className="font-normal text-gray-400">(auto dari AI, bisa diedit)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Halo kak, saya tertarik dengan ${formData.namaProduk || 'produk ini'}...`}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-[12px] rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-shadow placeholder-gray-400 resize-none"
                    value={formData.waGreeting}
                    onChange={(e) => handleInputChange('waGreeting', e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Kosongkan = pesan greeting otomatis dari AI/template saat generate</p>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">URL Halaman (Checkout / Sales)</label>
                <input type="text" placeholder="https://checkout.example.com" className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.orderLink} onChange={(e) => handleInputChange('orderLink', e.target.value)} />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button key={theme.id} onClick={() => handleInputChange('temaWarna', theme.id)} className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.temaWarna === theme.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'} transition-all`}>
                  <div className="flex space-x-1 mb-2">
                    <div className={`w-3.5 h-3.5 rounded-full ${theme.color1}`}></div>
                    <div className={`w-3.5 h-3.5 rounded-full ${theme.color2}`}></div>
                  </div>
                  <span className={`text-[10px] font-bold ${formData.temaWarna === theme.id ? 'text-blue-600' : 'text-gray-400'}`}>{theme.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="pb-2 border-b border-gray-100 mb-4">
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <Sparkles size={14} className="mr-2" />
              Fitur Tambahan
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-[13px] font-bold text-gray-600">
                    <MessageCircle size={16} className="mr-2.5 text-blue-600" /> Floating WA
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 cursor-pointer accent-blue-600" checked={formData.useFloatingWA} onChange={(e) => handleInputChange('useFloatingWA', e.target.checked)} />
                </div>
                {formData.useFloatingWA && (
                  <div className="ml-6 pl-0.5">
                    <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600">
                      <span className="pl-3 pr-1 text-gray-400"><Phone size={14} /></span>
                      <input type="text" placeholder="628123456789" className="w-full py-2 px-2 text-[13px] font-medium text-gray-700 focus:outline-none placeholder-gray-400" value={formData.noWA} onChange={(e) => handleInputChange('noWA', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-[13px] font-bold text-gray-600">
                  <Clock size={16} className="mr-2.5 text-red-500" /> Countdown Timer
                </div>
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600" checked={formData.useCountdown} onChange={(e) => handleInputChange('useCountdown', e.target.checked)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-[13px] font-bold text-gray-600">
                  <LayoutGrid size={16} className="mr-2.5 text-indigo-500" /> Testimoni
                </div>
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600" checked={formData.useTesti} onChange={(e) => handleInputChange('useTesti', e.target.checked)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-[13px] font-bold text-gray-600">
                  <HelpCircle size={16} className="mr-2.5 text-orange-400" /> FAQ Accordion
                </div>
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600" checked={formData.useFAQ} onChange={(e) => handleInputChange('useFAQ', e.target.checked)} />
              </div>
            </div>
          </section>

          <section className="pb-4">
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <ImageIcon size={14} className="mr-2" />
              Media & Gambar
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex justify-between items-center text-[11px] font-semibold text-gray-600 mb-1.5">
                  <span>Upload Gambar Utama</span>
                  {imageError && <span className="text-red-500 text-[10px]">{imageError}</span>}
                </label>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                <div onClick={() => fileInputRef.current.click()} className={`border border-dashed rounded-xl bg-white flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden ${imageError ? 'border-red-400' : 'border-gray-300'}`}>
                  {formData.gambarUtama ? (
                    <>
                      <img src={formData.gambarUtama} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                      <div className="relative z-10 flex flex-col items-center">
                        <Check size={20} className="text-blue-600 mb-2" strokeWidth={2} />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Gambar Diupload</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={20} className={imageError ? "text-red-400 mb-2" : "text-gray-400 mb-2"} strokeWidth={1.5} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${imageError ? "text-red-500" : "text-gray-400"}`}>Klik Untuk Upload</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-[11px] font-semibold text-gray-600 mb-1.5">
                  <Youtube size={14} className="mr-1.5 text-red-500" strokeWidth={2.5} /> URL YouTube
                </label>
                <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.urlYoutube} onChange={(e) => handleInputChange('urlYoutube', e.target.value)} />
                {formData.gambarUtama && getYoutubeId(formData.urlYoutube) && (
                  <p className="text-[10px] text-blue-500 font-semibold mt-1.5">✓ Gambar di hero, video di section demo terpisah</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Bonus (opsional)</label>
                <input type="text" placeholder="Sebutkan bonus jika ada..." className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.bonus} onChange={(e) => handleInputChange('bonus', e.target.value)} />
              </div>
            </div>
          </section>

          {/* GEMINI AI SECTION */}
          <section className="pb-4">
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <Bot size={14} className="mr-2" />
              AI Copywriter (Gemini)
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              {/* Toggle row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-gray-700">Aktifkan Gemini AI</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Generate copy via Google Gemini</div>
                </div>
                <button
                  onClick={() => { setUseGemini(v => !v); setGeminiError(''); setAiContent(null); }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${useGemini ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${useGemini ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {useGemini && (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-[11px] text-blue-700 leading-relaxed">
                    Gemini AI aktif — copy LP akan dibuat oleh AI saat kamu klik Generate.
                  </div>

                  {geminiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[11px] text-red-600 font-medium leading-relaxed">
                      {geminiError}
                    </div>
                  )}

                  {aiContent && !geminiError && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Copy dihasilkan oleh Gemini AI
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

        </div>

        <div className="p-5 border-t border-gray-100 bg-white shrink-0">
          <button onClick={handleGenerate} disabled={isLoading} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'}`}>
            {isLoading ? (
              <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{useGemini ? 'GEMINI GENERATING...' : 'MERAKIT HALAMAN...'}</>
            ) : (
              <><Sparkles size={18} className="mr-2" />{useGemini ? 'GENERATE dengan Gemini AI' : 'GENERATE LANDING PAGE'}</>
            )}
          </button>
        </div>

      </div>

      {/* AREA UTAMA (KANAN) */}
      <div className="flex-1 flex flex-col bg-white">

        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-6">
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button onClick={() => setActiveTab('pratinjau')} className={`px-4 py-1.5 rounded-md text-[13px] font-bold flex items-center transition-all ${activeTab === 'pratinjau' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <Eye size={16} className="mr-2" /> PRATINJAU
              </button>
              <button onClick={() => { if (!isGenerated) handleGenerate(); setActiveTab('kode'); }} className={`px-4 py-1.5 rounded-md text-[13px] font-bold flex items-center transition-all ${activeTab === 'kode' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <Code size={16} className="mr-2" /> KODE
              </button>
            </div>

            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button onClick={() => setDeviceView('desktop')} className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Monitor size={18} /></button>
              <button onClick={() => setDeviceView('mobile')} className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone size={18} /></button>
            </div>
          </div>

          {isGenerated && (
            <button onClick={handleDownload} className="flex items-center bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-[13px] font-bold transition-colors shadow-sm">
              <Download size={16} className="mr-2" />
              Download HTML
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-[#fcfcfd]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center flex flex-col items-center">
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center"><Sparkles size={28} className="text-blue-600 animate-pulse" /></div>
                </div>
                <h2 className="text-[20px] font-bold text-[#111827] tracking-tight mb-2">Menyintesis Copy & Desain...</h2>
                <p className="text-gray-500 text-sm font-medium animate-pulse">AI sedang mengembangkan narasi dari insight Anda.</p>
              </div>
            </div>
          ) : !isGenerated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center justify-center mb-8 relative">
                  <Sparkles size={36} className="text-blue-600" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent rounded-3xl"></div>
                </div>
                <h2 className="text-[22px] font-extrabold text-[#111827] tracking-tight mb-3">LP GENERATOR V.3</h2>
                <p className="text-gray-400 text-sm font-medium max-w-xs text-center leading-relaxed">Isi kolom di kiri, lalu generate. AI akan sintesis semua input jadi landing page yang seamless.</p>
              </div>
            </div>
          ) : activeTab === 'kode' ? (
            <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
              <div className="bg-[#2d2d2d] px-6 py-3 flex justify-between items-center border-b border-black/20">
                <span className="text-gray-300 font-mono text-sm flex items-center"><Code size={16} className="mr-2" /> index.html</span>
                <button onClick={copyToClipboard} className="flex items-center space-x-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition-colors">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Tersalin!' : 'Copy Code'}</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <pre className="text-sm text-[#a6e22e] font-mono whitespace-pre-wrap"><code>{generateHTML()}</code></pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto w-full h-full flex justify-center bg-gray-200">
              <div className={`transition-all duration-300 ease-in-out bg-white shadow-2xl ${deviceView === 'mobile' ? 'w-[375px] min-h-[812px] my-8 rounded-[40px] border-[12px] border-gray-800 relative overflow-hidden' : 'w-full h-full'}`}>
                <iframe ref={iframeRef} title="Live Preview" srcDoc={generateHTML()} className="w-full h-full border-none" />
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
