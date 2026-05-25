import React, { useState, useRef } from 'react';
import { 
  Zap, 
  SlidersHorizontal, 
  Flag, 
  Users, 
  Palette, 
  Eye, 
  Code, 
  Monitor, 
  Smartphone, 
  Sparkles,
  MessageCircle,
  Clock,
  LayoutGrid,
  HelpCircle,
  Image as ImageIcon,
  Youtube,
  Phone,
  Copy,
  Check,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pratinjau'); 
  const [deviceView, setDeviceView] = useState('desktop'); 
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState('');
  const iframeRef = useRef(null);
  const fileInputRef = useRef(null);
  
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
    { id: 'emerald', label: 'EMERALD', color1: 'bg-emerald-400', color2: 'bg-emerald-600', tailwind: { primary: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', gradient: 'from-emerald-400 to-emerald-700', soft: 'bg-emerald-100/30' } },
    { id: 'ocean', label: 'OCEAN', color1: 'bg-blue-400', color2: 'bg-blue-600', tailwind: { primary: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-400 to-blue-800', soft: 'bg-blue-100/30' } },
    { id: 'luxury', label: 'LUXURY', color1: 'bg-gray-700', color2: 'bg-gray-900', tailwind: { primary: 'bg-gray-900', hover: 'hover:bg-black', text: 'text-gray-900', light: 'bg-gray-100', border: 'border-gray-300', gradient: 'from-gray-600 to-black', soft: 'bg-gray-200/30' } },
    { id: 'coral', label: 'CORAL', color1: 'bg-rose-400', color2: 'bg-rose-500', tailwind: { primary: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200', gradient: 'from-rose-400 to-rose-700', soft: 'bg-rose-100/30' } },
    { id: 'sunset', label: 'SUNSET', color1: 'bg-orange-400', color2: 'bg-orange-500', tailwind: { primary: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-400 to-orange-700', soft: 'bg-orange-100/30' } },
    { id: 'cyber', label: 'CYBER', color1: 'bg-purple-500', color2: 'bg-fuchsia-600', tailwind: { primary: 'bg-fuchsia-600', hover: 'hover:bg-fuchsia-700', text: 'text-fuchsia-600', light: 'bg-fuchsia-50', border: 'border-fuchsia-200', gradient: 'from-purple-500 to-fuchsia-700', soft: 'bg-fuchsia-100/30' } }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    reader.onloadend = () => {
      handleInputChange('gambarUtama', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getYoutubeId = (url) => {
    if(!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- ENGINE SINTESIS TEKS & DESAIN ---
  const generateHTML = () => {
    const theme = themes.find(t => t.id === formData.temaWarna)?.tailwind || themes[0].tailwind;
    const ytId = getYoutubeId(formData.urlYoutube);
    
    const produk = formData.namaProduk.trim() || 'Produk Revolusioner';
    const audiensRaw = formData.targetAudiens.trim();
    const audiensPendek = audiensRaw ? audiensRaw.split(' ').slice(0, 5).join(' ') : 'Anda';
    const deskripsi = formData.deskripsi.trim() || 'Solusi terbaik untuk mencapai target Anda dengan lebih cepat, aman, dan tanpa hambatan yang berarti.';
    const tujuan = formData.tujuan.toLowerCase().trim() || 'penjualan';
    
    // Pecah deskripsi menjadi array fitur (Sintesis Cerdas)
    const sentences = deskripsi.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
    const features = sentences.length >= 3 ? sentences.slice(0,3) : [
        "Dirancang khusus dengan material dan formula kualitas tertinggi di kelasnya.",
        `Sangat mudah digunakan oleh ${audiensPendek}, tanpa perlu pengalaman khusus.`,
        "Terbukti secara nyata memberikan hasil yang Anda idamkan dalam waktu singkat."
    ];

    // VARIABEL GAYA DESAIN (Ekstrim dan Berbeda)
    let fontImport, fontFamily, btnClass, roundedClass, heroBgClass, sectionBgAlt, highlightCardClass, bodyClass;

    if (formData.nuansaDesain === 'Modern & Minimalis') {
        fontImport = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');";
        fontFamily = "'Inter', sans-serif";
        roundedClass = "rounded-2xl";
        btnClass = `${theme.primary} ${theme.hover} text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transform hover:-translate-y-1 transition-all`;
        bodyClass = "bg-white text-slate-800";
        heroBgClass = "bg-slate-50 relative overflow-hidden";
        sectionBgAlt = "bg-white";
        highlightCardClass = `bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-${theme.text.split('-')[1]}-300 hover:shadow-md transition-all duration-300`;
    } 
    else if (formData.nuansaDesain === 'Elegan & Mewah') {
        fontImport = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');";
        fontFamily = "'Lato', sans-serif";
        roundedClass = "rounded-none";
        btnClass = `bg-gradient-to-r ${theme.gradient} text-white font-bold uppercase tracking-[0.2em] border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-all`;
        bodyClass = "bg-[#0a0a0a] text-gray-300"; // Dark Mode
        heroBgClass = "bg-[#111] border-b border-gray-800";
        sectionBgAlt = "bg-[#0a0a0a]";
        highlightCardClass = `bg-[#161616] p-10 border-t border-l border-gray-800 hover:border-gray-600 transition-colors shadow-2xl`;
    }
    else if (formData.nuansaDesain === 'Ceria & Playful') {
        // Neo-Brutalism Style
        fontImport = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');";
        fontFamily = "'Plus Jakarta Sans', sans-serif";
        roundedClass = "rounded-xl";
        btnClass = `${theme.primary} text-white font-black text-xl rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all uppercase`;
        bodyClass = "bg-[#fffdf8] text-black";
        heroBgClass = `${theme.soft} border-b-4 border-black`;
        sectionBgAlt = "bg-white";
        highlightCardClass = `bg-white p-8 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform`;
    }

    // Logika Power Words Auto-Bold
    const formatCopy = (text) => {
      if (!text) return '';
      let formatted = text.replace(/\n/g, '<br/>');
      const triggers = ['rahasia', 'terbukti', 'ampuh', 'cepat', 'diskon', 'gratis', 'terbaik', 'premium', 'solusi', 'mudah', 'tanpa', 'glowing', 'garansi', 'sekarang', 'terbatas', 'eksklusif', 'langsung', 'otomatis'];
      const boldClass = formData.nuansaDesain === 'Elegan & Mewah' ? `font-bold ${theme.text}` : `font-extrabold ${theme.text}`;
      triggers.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          formatted = formatted.replace(regex, `<strong class="${boldClass}">$&</strong>`);
      });
      return formatted;
    };

    // STRATEGI COPYWRITING: HERO & MIDDLE SECTION
    let eyebrowHTML = '';
    let headlineHTML = '';
    let middleStrategyHTML = '';
    
    if (formData.strategiCopy === 'PAS Framework') {
        // PAS: Problem (Hero) - Agitation (Middle) - Solution (Feature)
        eyebrowHTML = `<span class="inline-block py-1.5 px-4 bg-red-100 text-red-700 text-xs md:text-sm font-bold tracking-wider ${roundedClass} mb-6 uppercase border border-red-200 shadow-sm animate-pulse">APAKAH ANDA MERASA TERJEBAK DENGAN MASALAH INI?</span>`;
        headlineHTML = `Akhiri Rasa Frustasi Anda. Temukan Solusi Pasti dengan <span class="text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient} leading-tight">${produk}</span>!`;
        
        middleStrategyHTML = `
        <section class="py-20 px-6 bg-red-50/50 border-y border-red-100">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Jangan Biarkan Masalah Ini Terus Merugikan Anda!</h2>
                <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                    Setiap hari Anda menunda, Anda membiarkan potensi dan kesempatan berharga terbuang sia-sia. Sebagai <strong>${audiensPendek}</strong>, Anda berhak mendapatkan kemudahan, bukan proses yang menguras tenaga dan pikiran.
                </p>
                <div class="text-xl font-semibold ${theme.text} italic">
                    "Saatnya beralih ke cara yang terbukti berhasil."
                </div>
            </div>
        </section>`;
    } else {
        // AIDA: Attention (Hero) - Interest/Desire (Middle) - Action (Bottom)
        eyebrowHTML = `<span class="inline-block py-1.5 px-4 ${theme.primary} text-white text-xs md:text-sm font-bold tracking-wider ${roundedClass} mb-6 uppercase shadow-sm">✨ SPESIAL UNTUK ${audiensPendek.toUpperCase()}</span>`;
        headlineHTML = `Raih Hasil Maksimal Lebih Cepat dengan <span class="text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient} leading-tight">${produk}</span>`;
        
        middleStrategyHTML = `
        <section class="py-20 px-6 ${theme.soft}">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-3xl md:text-4xl font-bold ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-white' : 'text-gray-900'} mb-6">Bayangkan Jika Anda Bisa Mencapai Target Tanpa Hambatan</h2>
                <p class="text-lg ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-300' : 'text-gray-700'} mb-8 leading-relaxed">
                    Ribuan <strong>${audiensPendek}</strong> lainnya telah membuktikan bahwa mencapai impian tidak harus menguras tenaga. Dengan metode dan fitur yang tepat, Anda bisa menghemat waktu berharga Anda.
                </p>
                <div class="w-16 h-1 ${theme.primary} mx-auto"></div>
            </div>
        </section>`;
    }

    // PENGOLAHAN TUJUAN (CTA)
    let ctaTitle = 'Jangan Tunda Lagi';
    let ctaSub = 'Langkah kecil ini akan membawa perubahan besar.';
    if (tujuan.includes('jual') || tujuan.includes('beli')) {
        ctaTitle = `Miliki ${produk} Sekarang!`;
        ctaSub = 'Stok penawaran ini diatur sangat terbatas untuk menjaga eksklusivitas.';
    } else if (tujuan.includes('lead') || tujuan.includes('wa') || tujuan.includes('konsultasi')) {
        ctaTitle = 'Konsultasi Gratis Sekarang';
        ctaSub = `Mari diskusikan bagaimana ${produk} dapat disesuaikan dengan kebutuhan Anda.`;
    }

    // MEDIA HTML
    let mediaHTML = '';
    if (formData.gambarUtama) {
        mediaHTML = `
        <div class="max-w-3xl mx-auto aspect-video mb-12 shadow-2xl ${roundedClass} overflow-hidden ${formData.nuansaDesain === 'Ceria & Playful' ? 'border-4 border-black' : 'border-4 border-white'} relative group z-10">
            <img src="${formData.gambarUtama}" alt="${produk}" class="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end justify-center pb-6">
                <span class="text-white font-bold tracking-wide text-lg drop-shadow-md">Tampilan Nyata ${produk}</span>
            </div>
        </div>`;
    } else if (ytId) {
        mediaHTML = `
        <div class="max-w-3xl mx-auto aspect-video mb-12 shadow-2xl ${roundedClass} overflow-hidden ${formData.nuansaDesain === 'Ceria & Playful' ? 'border-4 border-black' : 'border-4 border-white'} z-10 relative">
            <iframe class="w-full h-full relative z-10" src="https://www.youtube.com/embed/${ytId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${produk}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      ${fontImport}
      body { font-family: ${fontFamily}; }
      ${formData.nuansaDesain === 'Elegan & Mewah' ? "h1, h2, h3 { font-family: 'Playfair Display', serif; }" : ""}
      .aspect-video { aspect-ratio: 16 / 9; }
      html { scroll-behavior: smooth; }
    </style>
</head>
<body class="${bodyClass} antialiased overflow-x-hidden">

    <!-- HERO SECTION -->
    <header class="${heroBgClass} py-20 lg:py-32 px-6">
        ${formData.nuansaDesain === 'Modern & Minimalis' ? `
        <div class="absolute top-0 right-0 w-[500px] h-[500px] ${theme.light} rounded-full blur-[100px] opacity-70 -z-10 mix-blend-multiply pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] ${theme.light} rounded-full blur-[80px] opacity-60 -z-10 mix-blend-multiply pointer-events-none"></div>
        ` : ''}
        
        <div class="max-w-4xl mx-auto text-center relative z-10">
            ${eyebrowHTML}
            
            <h1 class="text-4xl md:text-5xl lg:text-[4rem] ${formData.nuansaDesain === 'Elegan & Mewah' ? 'font-bold' : 'font-black'} leading-[1.15] mb-6 tracking-tight ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-white' : ''}">
                ${headlineHTML}
            </h1>
            
            <p class="text-lg md:text-xl ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-3xl mx-auto leading-relaxed">
                ${formatCopy(deskripsi)}
            </p>
            
            ${mediaHTML}

            <div class="flex justify-center mt-10 relative z-20">
                <a href="${formData.orderLink || '#'}" class="${btnClass} py-4 px-10 sm:w-auto w-full inline-flex items-center justify-center text-center">
                    ${formData.teksCTA || 'Ambil Penawaran Ini'}
                    ${formData.nuansaDesain !== 'Elegan & Mewah' ? `<svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>` : ''}
                </a>
            </div>
            <p class="text-sm mt-5 flex items-center justify-center font-medium ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-500' : 'text-gray-400'}">
                <svg class="w-4 h-4 mr-1.5 ${theme.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Akses Langsung & Terenkripsi
            </p>
        </div>
    </header>

    <!-- MIDDLE STRATEGY SECTION (Dinamis AIDA/PAS) -->
    ${middleStrategyHTML}

    <!-- HIGHLIGHT / FEATURES SECTION -->
    <section class="py-24 px-6 ${sectionBgAlt}">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16 max-w-3xl mx-auto">
                <h2 class="text-3xl md:text-4xl ${formData.nuansaDesain === 'Elegan & Mewah' ? 'font-serif text-white' : 'font-bold text-gray-900'} mb-4">
                    Kekuatan Utama ${produk}
                </h2>
                <p class="text-lg ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-400' : 'text-gray-600'}">
                    Diformulasikan khusus untuk menyederhanakan proses Anda dengan hasil maksimal.
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Feature Cards dari Ekstraksi Deskripsi -->
                ${features.map((feat, i) => `
                <div class="${highlightCardClass}">
                    <div class="w-14 h-14 ${theme.light} ${theme.text} ${roundedClass} flex items-center justify-center mb-6">
                        ${i===0 ? `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>` : ''}
                        ${i===1 ? `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>` : ''}
                        ${i===2 ? `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>` : ''}
                    </div>
                    <p class="${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg">${formatCopy(feat)}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- BONUS SECTION -->
    ${formData.bonus ? `
    <section class="py-20 px-6 ${theme.primary}">
        <div class="max-w-4xl mx-auto bg-white p-10 md:p-16 ${roundedClass} shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-bl-full opacity-20 -mr-10 -mt-10"></div>
            <div class="text-center relative z-10">
                <span class="inline-block bg-red-100 text-red-600 font-black px-5 py-2 text-sm rounded-full mb-6 tracking-widest uppercase">🎁 Spesial Untuk Pembeli Hari Ini</span>
                <h3 class="text-3xl font-bold text-gray-900 mb-6">Dapatkan Bonus Eksklusif:</h3>
                <p class="text-2xl text-gray-800 font-bold border-b-4 border-dashed ${theme.border} pb-6 inline-block">"${formData.bonus}"</p>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- TESTIMONI SECTION -->
    ${formData.useTesti ? `
    <section class="py-24 px-6 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#111]' : 'bg-white'} border-y ${formData.nuansaDesain === 'Elegan & Mewah' ? 'border-gray-800' : 'border-gray-100'}">
        <div class="max-w-5xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl ${formData.nuansaDesain === 'Elegan & Mewah' ? 'font-serif text-white' : 'font-bold text-gray-900'} mb-14">Kepercayaan Mereka Adalah Bukti</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="${highlightCardClass} text-left relative">
                    <div class="text-5xl text-gray-200 opacity-50 absolute top-4 right-6 font-serif">"</div>
                    <div class="flex text-yellow-400 mb-5 text-xl">★★★★★</div>
                    <p class="mb-8 relative z-10 leading-relaxed text-lg">"Investasi terbaik tahun ini. Sejak menggunakan ini, ${tujuan ? 'target ' + tujuan : 'pekerjaan'} saya jadi jauh lebih ringan."</p>
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full mr-4 overflow-hidden border-2 ${theme.border}"><img src="https://i.pravatar.cc/100?img=47" class="w-full h-full object-cover" /></div>
                        <div class="font-bold">Andi K. <span class="block text-sm font-normal opacity-70">Wiraswasta</span></div>
                    </div>
                </div>
                <div class="${highlightCardClass} text-left relative">
                    <div class="text-5xl text-gray-200 opacity-50 absolute top-4 right-6 font-serif">"</div>
                    <div class="flex text-yellow-400 mb-5 text-xl">★★★★★</div>
                    <p class="mb-8 relative z-10 leading-relaxed text-lg">"Kualitasnya tidak diragukan lagi. Sangat merekomendasikan ${produk} untuk siapa saja yang butuh solusi cepat."</p>
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full mr-4 overflow-hidden border-2 ${theme.border}"><img src="https://i.pravatar.cc/100?img=32" class="w-full h-full object-cover" /></div>
                        <div class="font-bold">Rina M. <span class="block text-sm font-normal opacity-70">Karyawan</span></div>
                    </div>
                </div>
                <div class="${highlightCardClass} text-left relative">
                    <div class="text-5xl text-gray-200 opacity-50 absolute top-4 right-6 font-serif">"</div>
                    <div class="flex text-yellow-400 mb-5 text-xl">★★★★★</div>
                    <p class="mb-8 relative z-10 leading-relaxed text-lg">"Pelayanan luar biasa dan barang sesuai ekspektasi. Ini adalah pembelian ketiga saya."</p>
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full mr-4 overflow-hidden border-2 ${theme.border}"><img src="https://i.pravatar.cc/100?img=12" class="w-full h-full object-cover" /></div>
                        <div class="font-bold">Budi S. <span class="block text-sm font-normal opacity-70">Freelancer</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- COUNTDOWN SECTION -->
    ${formData.useCountdown ? `
    <section class="py-12 px-6 bg-red-600 text-white text-center">
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div class="mb-6 md:mb-0 text-left">
                <h3 class="text-2xl md:text-3xl font-black uppercase tracking-wide">Peringatan: Penawaran Terbatas!</h3>
                <p class="text-red-100 text-lg">Jangan lewatkan kesempatan ini. Kesempatan ditutup dalam:</p>
            </div>
            <div class="flex gap-3 text-center justify-center">
                <div class="bg-white text-red-600 p-4 ${roundedClass} w-20 shadow-xl">
                    <div id="hours" class="text-3xl font-black">12</div>
                    <div class="text-[10px] uppercase font-bold mt-1 tracking-wider text-gray-500">Jam</div>
                </div>
                <div class="text-3xl font-bold py-3">:</div>
                <div class="bg-white text-red-600 p-4 ${roundedClass} w-20 shadow-xl">
                    <div id="mins" class="text-3xl font-black">45</div>
                    <div class="text-[10px] uppercase font-bold mt-1 tracking-wider text-gray-500">Mnt</div>
                </div>
                <div class="text-3xl font-bold py-3">:</div>
                <div class="bg-white text-red-600 p-4 ${roundedClass} w-20 shadow-xl">
                    <div id="secs" class="text-3xl font-black">30</div>
                    <div class="text-[10px] uppercase font-bold mt-1 tracking-wider text-gray-500">Dtk</div>
                </div>
            </div>
        </div>
    </section>
    <script>
        let time = 12 * 3600 + 45 * 60 + 30;
        setInterval(() => {
            time--;
            document.getElementById('hours').innerText = String(Math.floor(time / 3600)).padStart(2, '0');
            document.getElementById('mins').innerText = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
            document.getElementById('secs').innerText = String(time % 60).padStart(2, '0');
        }, 1000);
    </script>
    ` : ''}

    <!-- BOTTOM CTA -->
    <section class="py-24 px-6 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#0a0a0a]' : 'bg-gray-50'} border-t ${formData.nuansaDesain === 'Elegan & Mewah' ? 'border-gray-800' : 'border-gray-200'}">
        <div class="max-w-3xl mx-auto text-center ${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#111] border border-gray-800' : 'bg-white border border-gray-100'} p-10 md:p-16 ${roundedClass} shadow-2xl relative">
            <h2 class="text-3xl md:text-4xl ${formData.nuansaDesain === 'Elegan & Mewah' ? 'font-serif text-white' : 'font-bold text-gray-900'} mb-4 mt-4">
                ${ctaTitle}
            </h2>
            <p class="text-lg mb-10 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-400' : 'text-gray-500'}">${ctaSub}</p>
            
            ${formData.harga ? `
            <div class="${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#161616]' : 'bg-gray-50'} py-8 ${roundedClass} mb-10">
                <p class="text-sm line-through mb-2 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-500' : 'text-gray-400'}">Harga Normal: Rp ${parseInt(formData.harga.replace(/\D/g,'')) * 2 || '0'}</p>
                <div class="text-5xl md:text-6xl font-black ${theme.text}">
                    ${formData.harga}
                </div>
            </div>
            ` : ''}

            <a href="${formData.orderLink || '#'}" class="${btnClass} py-5 px-10 text-xl w-full block text-center">
                ${formData.teksCTA || 'Tindak Lanjuti Sekarang'}
            </a>
            <p class="text-sm mt-8 flex items-center justify-center font-medium ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-500' : 'text-gray-400'}">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Pembayaran 100% Aman. Privasi Terjaga.
            </p>
        </div>
    </section>

    <!-- FAQ SECTION -->
    ${formData.useFAQ ? `
    <section class="py-24 px-6 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#111]' : 'bg-white'} border-t ${formData.nuansaDesain === 'Elegan & Mewah' ? 'border-gray-800' : 'border-gray-100'}">
        <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-white' : 'text-gray-900'} mb-12 text-center">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div class="space-y-4">
                <details class="group ${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#161616] border-gray-800' : 'bg-gray-50 border-gray-200'} border ${roundedClass} cursor-pointer shadow-sm">
                    <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-6 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-200' : 'text-gray-800'}">
                        <span>Apakah produk ini cocok untuk saya?</span>
                        <span class="transition group-open:rotate-180 ${theme.text}">
                            <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                    </summary>
                    <p class="mt-3 p-6 pt-0 leading-relaxed border-t ${formData.nuansaDesain === 'Elegan & Mewah' ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-600'}">Jika Anda adalah ${audiensPendek.toLowerCase()}, maka formulasi kami dibuat secara spesifik untuk memecahkan hambatan yang Anda alami.</p>
                </details>
                <details class="group ${formData.nuansaDesain === 'Elegan & Mewah' ? 'bg-[#161616] border-gray-800' : 'bg-gray-50 border-gray-200'} border ${roundedClass} cursor-pointer shadow-sm">
                    <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-6 ${formData.nuansaDesain === 'Elegan & Mewah' ? 'text-gray-200' : 'text-gray-800'}">
                        <span>Bagaimana proses pelayanannya?</span>
                        <span class="transition group-open:rotate-180 ${theme.text}">
                            <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                    </summary>
                    <p class="mt-3 p-6 pt-0 leading-relaxed border-t ${formData.nuansaDesain === 'Elegan & Mewah' ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-600'}">Sangat cepat dan terjamin. Kami mengutamakan kepuasan Anda dengan protokol layanan standar tinggi.</p>
                </details>
            </div>
        </div>
    </section>` : ''}

    <!-- FOOTER -->
    <footer class="bg-gray-950 py-12 px-6 text-center text-gray-400 text-sm">
        <div class="max-w-4xl mx-auto">
            <p class="mb-4 text-gray-300 font-bold">&copy; 2026 ${produk}. Hak Cipta Dilindungi.</p>
            <p class="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">Disclaimer: Hasil yang didapat dapat berbeda pada setiap individu tergantung dari berbagai faktor. Pastikan untuk membaca seluruh ketentuan layanan dan kebijakan privasi kami sebelum melakukan transaksi.</p>
        </div>
    </footer>

    <!-- FLOATING WA -->
    ${formData.useFloatingWA ? `
    <a href="https://wa.me/${formData.noWA}" target="_blank" class="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 flex items-center justify-center animate-bounce">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
    </a>` : ''}

</body>
</html>`;
  };

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsGenerated(true);
      setActiveTab('pratinjau');
    }, 2000);
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    document.execCommand('copy');
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(html);
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = html;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try { document.execCommand('copy'); } catch (error) {} finally { textArea.remove(); }
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
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none"
                  value={formData.jenisHalaman}
                  onChange={(e) => handleInputChange('jenisHalaman', e.target.value)}
                >
                  <option>Landing Page</option>
                  <option>Sales Page</option>
                  <option>Toko Online</option>
                  <option>Blog Page</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Strategi Copy</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none"
                  value={formData.strategiCopy}
                  onChange={(e) => handleInputChange('strategiCopy', e.target.value)}
                >
                  <option>AIDA Framework</option>
                  <option>PAS Framework</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Nama Produk / Brand</label>
                <input 
                  type="text" 
                  placeholder="Misal: Skincare Glow"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400"
                  value={formData.namaProduk}
                  onChange={(e) => handleInputChange('namaProduk', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Deskripsi / Detail Penawaran</label>
                <textarea 
                  rows={4}
                  placeholder="Ketik paragraf panjang. Sistem akan memecahnya jadi fitur & mem-bold kata pemicu otomatis..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400 resize-none"
                  value={formData.deskripsi}
                  onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Tujuan Halaman</label>
                <input 
                  type="text" 
                  placeholder="Misal: Penjualan, Mengumpulkan Leads, Edukasi..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400"
                  value={formData.tujuan}
                  onChange={(e) => handleInputChange('tujuan', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              <Users size={14} className="mr-2" />
              Strategi & Audiens
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Target Audiens (Mempengaruhi Copy)</label>
              <textarea 
                rows={3}
                placeholder="Contoh: Pekerja kantoran sibuk yang ingin berinvestasi..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400 resize-none"
                value={formData.targetAudiens}
                onChange={(e) => handleInputChange('targetAudiens', e.target.value)}
              />
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
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none"
                  value={formData.nuansaDesain}
                  onChange={(e) => handleInputChange('nuansaDesain', e.target.value)}
                >
                  <option>Modern & Minimalis</option>
                  <option>Elegan & Mewah</option>
                  <option>Ceria & Playful</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Teks Tombol CTA</label>
                <input 
                  type="text" 
                  placeholder="Misal: Beli Sekarang"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                  value={formData.teksCTA}
                  onChange={(e) => handleInputChange('teksCTA', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Harga</label>
                <input 
                  type="text" 
                  placeholder="Rp 299.000"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                  value={formData.harga}
                  onChange={(e) => handleInputChange('harga', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Order Link</label>
                <input 
                  type="text" 
                  placeholder="URL Web / WA"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400"
                  value={formData.orderLink}
                  onChange={(e) => handleInputChange('orderLink', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleInputChange('temaWarna', theme.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                    formData.temaWarna === theme.id 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  } transition-all`}
                >
                  <div className="flex space-x-1 mb-2">
                    <div className={`w-3.5 h-3.5 rounded-full ${theme.color1}`}></div>
                    <div className={`w-3.5 h-3.5 rounded-full ${theme.color2}`}></div>
                  </div>
                  <span className={`text-[10px] font-bold ${formData.temaWarna === theme.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {theme.label}
                  </span>
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
                    <MessageCircle size={16} className="mr-2.5 text-blue-600" />
                    Floating WA
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 cursor-pointer accent-blue-600"
                    checked={formData.useFloatingWA}
                    onChange={(e) => handleInputChange('useFloatingWA', e.target.checked)}
                  />
                </div>
                {formData.useFloatingWA && (
                  <div className="ml-6 pl-0.5">
                    <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600">
                      <span className="pl-3 pr-1 text-gray-400"><Phone size={14} /></span>
                      <input 
                        type="text" 
                        placeholder="628123456789"
                        className="w-full py-2 px-2 text-[13px] font-medium text-gray-700 focus:outline-none placeholder-gray-400"
                        value={formData.noWA}
                        onChange={(e) => handleInputChange('noWA', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                  <div className="flex items-center text-[13px] font-bold text-gray-600">
                    <Clock size={16} className="mr-2.5 text-red-500" /> Countdown Timer
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600" checked={formData.useCountdown} onChange={(e) => handleInputChange('useCountdown', e.target.checked)}/>
              </div>

              <div className="flex items-center justify-between">
                  <div className="flex items-center text-[13px] font-bold text-gray-600">
                    <LayoutGrid size={16} className="mr-2.5 text-indigo-500" /> Testi Slider
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600" checked={formData.useTesti} onChange={(e) => handleInputChange('useTesti', e.target.checked)}/>
              </div>

              <div className="flex items-center justify-between">
                  <div className="flex items-center text-[13px] font-bold text-gray-600">
                    <HelpCircle size={16} className="mr-2.5 text-orange-400" /> FAQ Accordion
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600" checked={formData.useFAQ} onChange={(e) => handleInputChange('useFAQ', e.target.checked)}/>
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
                  <Youtube size={14} className="mr-1.5 text-red-500" strokeWidth={2.5}/> URL YouTube
                </label>
                <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.urlYoutube} onChange={(e) => handleInputChange('urlYoutube', e.target.value)} />
              </div>

              <div>
                <input type="text" placeholder="Sebutkan bonus jika ada..." className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" value={formData.bonus} onChange={(e) => handleInputChange('bonus', e.target.value)} />
              </div>
            </div>
          </section>

        </div>

        <div className="p-5 border-t border-gray-100 bg-white shrink-0">
          <button onClick={handleGenerate} disabled={isLoading} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'}`}>
            {isLoading ? (
              <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> MERAKIT HALAMAN...</>
            ) : (
              <><Sparkles size={18} className="mr-2" /> GENERATE LANDING PAGE</>
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
              <button onClick={() => { if(!isGenerated) handleGenerate(); setActiveTab('kode'); }} className={`px-4 py-1.5 rounded-md text-[13px] font-bold flex items-center transition-all ${activeTab === 'kode' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <Code size={16} className="mr-2" /> KODE
              </button>
            </div>

            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button onClick={() => setDeviceView('desktop')} className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Monitor size={18} /></button>
              <button onClick={() => setDeviceView('mobile')} className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone size={18} /></button>
            </div>
          </div>
          
          {isGenerated && (
            <button 
              onClick={handleDownload} 
              className="flex items-center bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-[13px] font-bold transition-colors shadow-sm"
            >
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
                <h2 className="text-[20px] font-bold text-[#111827] tracking-tight mb-2">Memproses Insight Anda...</h2>
                <p className="text-gray-500 text-sm font-medium animate-pulse">Menyusun struktur naratif dan adaptasi desain.</p>
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
                <p className="text-gray-400 text-sm font-medium">Beri kami insight. Kami merakitnya menjadi halaman penjualan.</p>
              </div>
            </div>
          ) : activeTab === 'kode' ? (
            <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
              <div className="bg-[#2d2d2d] px-6 py-3 flex justify-between items-center border-b border-black/20">
                <span className="text-gray-300 font-mono text-sm flex items-center"><Code size={16} className="mr-2"/> index.html</span>
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