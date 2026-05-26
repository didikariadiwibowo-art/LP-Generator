import React, { useState, useEffect, useCallback } from "react";
import {
  Zap,
  Copy,
  Monitor,
  Smartphone,
  Sparkles,
  Layout,
  Check,
  AlertCircle,
  Settings2,
  Palette,
  Youtube,
  Gift,
  Code,
  Type,
  ChevronDown,
  Target,
  RefreshCw,
  Eye,
  Terminal,
  Download,
  Users,
  Flag,
  MousePointer2,
  MessageCircle,
  Clock,
  LayoutGrid,
  Image as ImageIcon,
  X,
  FileText
} from "lucide-react";

/* ================= CONFIG ================= */
const SUPPORTED_MODEL = "gemini-2.5-flash-preview-09-2025";
const apiKey = ""; 

/* ================= THEMES ================= */
const THEMES = [
  { name: "Emerald", primary: "#059669", accent: "#10b981" },
  { name: "Ocean", primary: "#2563eb", accent: "#3b82f6" },
  { name: "Luxury", primary: "#1e1e1e", accent: "#4b5563" },
  { name: "Coral", primary: "#f43f5e", accent: "#fb7185" },
  { name: "Sunset", primary: "#ea580c", accent: "#f97316" },
  { name: "Cyber", primary: "#7c3aed", accent: "#a78bfa" },
];

/* ================= HELPERS ================= */
const getYouTubeId = (url) => {
  if (!url) return "";
  const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&?#]+)/);
  return match ? match[1] : "";
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/* ================= APP ================= */
export default function App() {
  // 🔹 State Input Form Lengkap
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState(""); 
  const [pageType, setPageType] = useState("Landing Page");
  const [pageGoal, setPageGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [designVibe, setDesignVibe] = useState("Modern & Minimalis");
  const [ctaText, setCtaText] = useState("Beli Sekarang");
  const [productImage, setProductImage] = useState(null); 
  
  // Fitur Tambahan (Toggles)
  const [useFloatingWA, setUseFloatingWA] = useState(true);
  const [useCountdown, setUseCountdown] = useState(false);
  const [useTestimonialSlider, setUseTestimonialSlider] = useState(true);

  // State Pendukung
  const [priceValue, setPriceValue] = useState("");
  const [bonusInfo, setBonusInfo] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [orderUrl, setOrderUrl] = useState("");
  const [framework, setFramework] = useState("AIDA");
  const [primaryColor, setPrimaryColor] = useState("#059669");
  const [accentColor, setAccentColor] = useState("#10b981");
  const [fontFamily, setFontFamily] = useState("Plus Jakarta Sans");
  
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [viewTab, setViewTab] = useState("preview");
  const [error, setError] = useState(null);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
        setError("Ukuran gambar maksimal 1MB ya, bro.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /* ================= API CALL ================= */
  const generateWithBackoff = async (payload, attempt = 0) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${SUPPORTED_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.status === 429 && attempt < 5) {
        await wait(Math.pow(2, attempt) * 1000);
        return generateWithBackoff(payload, attempt + 1);
      }
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      return await response.json();
    } catch (err) {
      if (attempt < 5) {
        await wait(Math.pow(2, attempt) * 1000);
        return generateWithBackoff(payload, attempt + 1);
      }
      throw err;
    }
  };

  /* ================= HTML WRAPPER ================= */
  const constructFullHtml = useCallback((bodyContent) => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${productName || 'Landing Page'}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --primary: ${primaryColor};
  --accent: ${accentColor};
  --font-main: '${fontFamily}', sans-serif;
}
html, body { margin: 0 !important; padding: 0 !important; scroll-behavior: smooth; width: 100% !important; }
body { font-family: var(--font-main); overflow-x: hidden; color: #1e293b; line-height: 1.6; background-color: #ffffff; }
.main-inner, .column-center-inner, .post-body { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }

/* AUTO CONTRAST UTILITIES */
.bg-dark { background-color: #0f172a; color: #f8fafc !important; }
.bg-dark h1, .bg-dark h2, .bg-dark h3 { color: #ffffff !important; }
.bg-dark p { color: #cbd5e1 !important; }

/* BUTTONS */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white !important;
  font-weight: 800;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  transition: 0.3s;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  text-decoration: none !important;
  border: none;
  cursor: pointer;
}
.btn-primary:hover { transform: translateY(-3px); filter: brightness(1.1); }

/* FAQ Accordion */
.faq-item.active .faq-content { max-height: 500px; padding-bottom: 1.5rem; }
.faq-content { max-height: 0; overflow: hidden; transition: 0.3s ease-out; }
.faq-item.active .faq-icon { transform: rotate(180deg); }

.reveal { opacity: 0; transform: translateY(20px); transition: 0.6s ease-out; }
.reveal.active { opacity: 1; transform: translateY(0); }

/* Sticky CTA */
#sticky-cta.hidden-cta { transform: translateY(120px); opacity: 0; }
#sticky-cta { transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: fixed; bottom: 1rem; left: 1rem; right: 1rem; z-index: 9999; }
@media (min-width: 768px) { #sticky-cta { width: 350px; left: auto; right: 2rem; } }

/* Floating WA */
.wa-float { position: fixed; bottom: 2rem; left: 2rem; z-index: 9998; transition: 0.3s; }
.wa-float:hover { transform: scale(1.1); }

/* Image Style */
.product-img { width: 100%; height: auto; border-radius: 1.5rem; object-fit: cover; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
</style>
</head>
<body>
<div id="lp-wrapper">${bodyContent}</div>
<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sticky = document.getElementById('sticky-cta');
window.addEventListener('scroll', () => {
  window.scrollY > 500 ? sticky?.classList.remove('hidden-cta') : sticky?.classList.add('hidden-cta');
});

document.querySelectorAll('.faq-trigger').forEach(t => {
  t.addEventListener('click', () => t.parentElement.classList.toggle('active'));
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
    }
  });
});
</script>
</body>
</html>`;
  }, [primaryColor, accentColor, fontFamily, productName]);

  /* ================= GENERATE ACTION ================= */
  const handleGenerate = async () => {
    if (!productName || !orderUrl) {
      setError("Nama Produk & Link Order wajib diisi.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    const ytId = getYouTubeId(youtubeUrl);

    let structurePrompt = "";
    if (pageType === "Landing Page" || pageType === "Sales Page") {
      structurePrompt = `
        STRUKTUR KONTEN:
        - Hero Section (Judul Menjual + Subjudul + CTA "${ctaText}")
        - Masalah yang dialami ${targetAudience}
        - Solusi / Manfaat utama produk
        - Fitur / Keunggulan Detail berdasarkan deskripsi: ${productDesc}
        - Social Proof: Testimoni (3-4 testimoni dummy realistis)
        - Bonus / Penawaran Eksklusif: "${bonusInfo}"
        - Pricing Section (id="pricing"): Tampilkan harga ${priceValue}
        - Final CTA Akhir
        - Footer Sederhana
      `;
    } else if (pageType === "Toko Online") {
      structurePrompt = `
        STRUKTUR KONTEN:
        - Header Brand
        - Grid Produk (Minimal 4 item dummy terinspirasi dari deskripsi: ${productDesc})
        - Nama Produk, Harga ${priceValue}, dan Tombol "${ctaText}" (Link ke ${orderUrl})
        - Deskripsi Keunggulan Toko
        - Footer Lengkap
      `;
    } else {
      structurePrompt = `
        STRUKTUR KONTEN:
        - Header & Navigasi
        - Layout Artikel Rapi berdasarkan deskripsi: ${productDesc}
        - Sidebar Opsional
        - CTA Subscribe / WhatsApp
        - Footer
      `;
    }

    // REVISI: Pengetatan instruksi penghapusan elemen gambar jika tidak tersedia.
    const prompt = `
Generate a professional, high-converting ${pageType} for Blogspot using Tailwind CSS.
Product Name: "${productName}"
Description: "${productDesc}"
Goal: "${pageGoal}"
Audience: "${targetAudience}"
Design: "${designVibe}"
CTA: "${ctaText}"
Framework: ${framework}
Price: ${priceValue}
Order Link: ${orderUrl}

${structurePrompt}

GAMBAR PRODUK (CRITICAL):
- IMAGE_AVAILABLE: ${!!productImage}
- Jika IMAGE_AVAILABLE adalah true, selipkan tag <img src="{{PRODUCT_IMAGE}}" class="product-img"> di posisi yang paling persuasif.
- Jika IMAGE_AVAILABLE adalah false, JANGAN menuliskan tag <img>, JANGAN gunakan placeholder gambar apapun, dan JANGAN sisakan kontainer div kosong untuk gambar. Hapus seluruh elemen yang berkaitan dengan gambar dan fokuslah 100% pada tata letak teks dan copywriting.

OPSIONAL FITUR:
- Floating WhatsApp Button: ${useFloatingWA}
- Countdown Timer (JS): ${useCountdown}
- Testimonial Slider (CSS/JS): ${useTestimonialSlider}
- Sticky Mobile CTA: Always include (id="sticky-cta")

ATURAN OUTPUT:
1. Tampilkan HANYA kode HTML lengkap.
2. Dilarang memberikan penjelasan/teks apapun di luar kode.
3. Dilarang menggunakan pembungkus markdown (\`\`\`html).
4. Gunakan copywriting Bahasa Indonesia yang persuasif.
`;

    try {
      const data = await generateWithBackoff({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "You are an Elite Direct Response Web Developer. You output ONLY raw HTML code without any comments atau markdown fences." }] }
      });
      let content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Post-processing penggantian placeholder
      if (productImage) {
        content = content.replace(/{{PRODUCT_IMAGE}}/g, productImage);
      } else {
        // Jika AI tetap mengeluarkan placeholder meski dilarang, kita hapus di sini sebagai pengaman.
        content = content.replace(/{{PRODUCT_IMAGE}}/g, "");
      }
      
      setGeneratedHtml(content.trim());
      setViewTab("preview");
    } catch (e) {
      setError("Koneksi gagal atau proses terlalu berat. Coba kurangi deskripsi atau pastikan gambar < 1MB, bro.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= UTILS ================= */
  const copyToClipboard = () => {
    const text = constructFullHtml(generatedHtml);
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    document.body.removeChild(textArea);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-[430px] flex flex-col bg-white border-r shadow-2xl z-20 overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between bg-white sticky top-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-lg">
              <Zap className="text-white fill-white" size={18} />
            </div>
            <h1 className="font-black text-lg tracking-tight">BloggerLP <span className="text-emerald-600">AI</span></h1>
          </div>
          <Settings2 size={18} className="text-slate-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar pb-32">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs font-medium text-rose-600">{error}</p>
            </div>
          )}

          {/* 1. Core Config */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Flag size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Core Config</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Jenis Halaman</label>
                <select value={pageType} onChange={e => setPageType(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option>Landing Page</option>
                  <option>Sales Page</option>
                  <option>Toko Online</option>
                  <option>Blog Page</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Strategi Copy</label>
                <select value={framework} onChange={e => setFramework(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none">
                  <option value="AIDA">AIDA Framework</option>
                  <option value="PAS">PAS Framework</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1">Nama Produk / Brand</label>
              <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Skincare Whitening Glow" />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1">Deskripsi Produk / Detail Penawaran</label>
              <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} className="w-full h-28 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Jelaskan fitur, manfaat, dan apa yang membuat produk Anda spesial..." />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1">Tujuan Halaman</label>
              <input value={pageGoal} onChange={e => setPageGoal(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Misal: Jualan produk, Leads WA..." />
            </div>
          </div>

          {/* 2. Strategy & Audience */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Users size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Strategi & Audiens</span>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1">Target Audiens</label>
              <textarea value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="w-full h-20 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none resize-none" placeholder="Siapa target pasar Anda secara spesifik?..." />
            </div>
          </div>

          {/* 3. Design & CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Palette size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Desain & Tombol</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Nuansa Desain</label>
                <input value={designVibe} onChange={e => setDesignVibe(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" placeholder="Modern, Islami, Tech..." />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Teks Tombol CTA</label>
                <input value={ctaText} onChange={e => setCtaText(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" placeholder="Daftar Sekarang" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Harga</label>
                <input value={priceValue} onChange={e => setPriceValue(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" placeholder="Rp 299.000" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Order Link</label>
                <input value={orderUrl} onChange={e => setOrderUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" placeholder="Link WhatsApp/Web" />
              </div>
            </div>

            {/* Themes */}
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(t => (
                <button key={t.name} onClick={() => { setPrimaryColor(t.primary); setAccentColor(t.accent); }} className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${primaryColor === t.primary ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Fitur Opsional */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fitur Tambahan</span>
            </div>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-emerald-500" />
                <span className="text-xs font-semibold text-slate-600">Floating WA</span>
              </div>
              <input type="checkbox" checked={useFloatingWA} onChange={e => setUseFloatingWA(e.target.checked)} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-rose-500" />
                <span className="text-xs font-semibold text-slate-600">Countdown Timer</span>
              </div>
              <input type="checkbox" checked={useCountdown} onChange={e => setUseCountdown(e.target.checked)} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-indigo-500" />
                <span className="text-xs font-semibold text-slate-600">Testi Slider</span>
              </div>
              <input type="checkbox" checked={useTestimonialSlider} onChange={e => setUseTestimonialSlider(e.target.checked)} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
            </label>
          </div>

          {/* 5. Assets & Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ImageIcon size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Media & Gambar</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 ml-1">Upload Gambar Utama (Opsional)</label>
              <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-emerald-400 transition-all bg-slate-50">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {productImage ? (
                  <div className="relative">
                    <img src={productImage} alt="Preview" className="w-full h-32 object-contain rounded-lg shadow-sm" />
                    <button onClick={(e) => { e.stopPropagation(); setProductImage(null); }} className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg text-rose-500 z-20 hover:bg-rose-50"><X size={14} /></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Klik untuk Upload</span>
                  </div>
                )}
              </div>
            </div>

            <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" placeholder="Link Video YouTube (Opsional)" />
            <textarea value={bonusInfo} onChange={e => setBonusInfo(e.target.value)} className="w-full h-16 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none resize-none" placeholder="Sebutkan bonus jika ada..." />
          </div>
        </div>

        <div className="p-6 bg-white border-t sticky bottom-0 z-30 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
          <button onClick={handleGenerate} disabled={isGenerating} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100 ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1 active:scale-95'}`}>
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? "OPTIMASI LP..." : "GENERATE BLOGGER LP"}
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 md:h-20 bg-white border-b flex items-center justify-between px-4 md:px-8 shrink-0 z-10 transition-all">
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex bg-slate-100 p-1 md:p-1.5 rounded-xl border border-slate-200 overflow-hidden">
              <button onClick={() => setViewTab("preview")} className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black transition-all ${viewTab === "preview" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}><Eye size={14}/> PRATINJAU</button>
              <button onClick={() => setViewTab("code")} className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black transition-all ${viewTab === "code" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}><Terminal size={14}/> KODE</button>
            </div>
            {viewTab === "preview" && (
              <div className="hidden sm:flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button onClick={() => setPreviewMode("desktop")} className={`p-2 rounded-lg transition-all ${previewMode === "desktop" ? "bg-white text-emerald-600" : "text-slate-400"}`}><Monitor size={18}/></button>
                <button onClick={() => setPreviewMode("mobile")} className={`p-2 rounded-lg transition-all ${previewMode === "mobile" ? "bg-white text-emerald-600" : "text-slate-400"}`}><Smartphone size={18}/></button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {generatedHtml && (
              <>
                <button onClick={() => { const b = new Blob([constructFullHtml(generatedHtml)], {type:'text/html'}); const u = URL.createObjectURL(b); const l = document.createElement('a'); l.href=u; l.download='lp.html'; l.click(); }} className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-200"><Download size={14}/> <span className="hidden xs:inline">UNDUH</span></button>
                <button onClick={copyToClipboard} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
                  {isCopied ? <Check size={14}/> : <Copy size={14}/>} <span className="hidden xs:inline">{isCopied ? "DISALIN!" : "SALIN"}</span>
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-10 overflow-hidden flex flex-col items-center">
          {generatedHtml ? (
            <div className="w-full h-full flex justify-center items-start animate-in fade-in duration-500">
              {viewTab === "preview" ? (
                <div className={`transition-all duration-700 bg-white shadow-2xl relative ${previewMode === "mobile" ? "w-[390px] h-full rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-slate-900 overflow-hidden ring-4 ring-slate-800" : "w-full max-w-6xl h-full rounded-2xl border border-slate-200 overflow-hidden"}`}>
                  <iframe title="Preview" srcDoc={constructFullHtml(generatedHtml)} className="w-full h-full border-none" />
                </div>
              ) : (
                <div className="w-full max-w-6xl h-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                  <textarea spellCheck="false" readOnly value={constructFullHtml(generatedHtml)} className="flex-1 w-full bg-transparent p-4 md:p-8 text-slate-300 font-mono text-xs md:text-sm outline-none resize-none custom-scrollbar" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl flex items-center justify-center animate-bounce">
                <Sparkles size={40} className="text-emerald-500 opacity-60 md:size-[48px]" />
              </div>
              <div className="text-center px-4">
                <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tighter">BloggerLP Engine V3</h2>
                <p className="text-xs md:text-sm font-medium text-slate-400">Siap mencetak cuan di Blogspot dengan landing page berkelas.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @media (max-width: 480px) { .xs\\:inline { display: none; } }
      `}</style>
    </div>
  );
}