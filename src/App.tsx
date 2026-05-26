import React, { useState, useCallback } from "react";
import {
  Zap, Copy, Monitor, Smartphone, Sparkles, Check, AlertCircle,
  Palette, RefreshCw, Eye, Terminal, Download, Users, Flag,
  MessageCircle, Clock, LayoutGrid, Image as ImageIcon, X, Bot
} from "lucide-react";

/* ============================================================
   CONFIG
============================================================ */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

/* ============================================================
   THEMES & FONTS
============================================================ */
const THEMES = [
  { name: "EMERALD", primary: "#059669", accent: "#10b981" },
  { name: "OCEAN",   primary: "#2563eb", accent: "#3b82f6" },
  { name: "LUXURY",  primary: "#1e1e1e", accent: "#4b5563" },
  { name: "CORAL",   primary: "#f43f5e", accent: "#fb7185" },
  { name: "SUNSET",  primary: "#ea580c", accent: "#f97316" },
  { name: "CYBER",   primary: "#7c3aed", accent: "#a78bfa" },
];

const FONTS = ["Inter", "Plus Jakarta Sans", "Poppins", "DM Sans", "Nunito", "Outfit", "Raleway"];

/* ============================================================
   HELPERS
============================================================ */
const getYouTubeId = (url: string) => {
  if (!url) return "";
  const m = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
  return m ? m[1] : "";
};
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

/* ============================================================
   APP
============================================================ */
export default function App() {

  // ── Form state ──────────────────────────────────────────
  const [productName,   setProductName]   = useState("");
  const [productDesc,   setProductDesc]   = useState("");
  const [pageType,      setPageType]      = useState("Landing Page");
  const [pageGoal,      setPageGoal]      = useState("");
  const [targetAudience,setTargetAudience]= useState("");
  const [designVibe,    setDesignVibe]    = useState("");
  const [ctaText,       setCtaText]       = useState("Beli Sekarang");
  const [priceValue,    setPriceValue]    = useState("");
  const [orderUrl,      setOrderUrl]      = useState("");
  const [youtubeUrl,    setYoutubeUrl]    = useState("");
  const [bonusInfo,     setBonusInfo]     = useState("");
  const [framework,     setFramework]     = useState("AIDA Framework");
  const [productImage,  setProductImage]  = useState<string | null>(null);

  // ── Optional features ────────────────────────────────────
  const [useFloatingWA,        setUseFloatingWA]        = useState(true);
  const [useCountdown,         setUseCountdown]         = useState(false);
  const [useTestimonialSlider, setUseTestimonialSlider] = useState(true);

  // ── Theme ────────────────────────────────────────────────
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [accentColor,  setAccentColor]  = useState("#3b82f6");
  const [fontFamily,   setFontFamily]   = useState("Inter");

  // ── UI state ─────────────────────────────────────────────
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isGenerating,  setIsGenerating]  = useState(false);
  const [isCopied,      setIsCopied]      = useState(false);
  const [previewMode,   setPreviewMode]   = useState<"desktop"|"mobile">("desktop");
  const [viewTab,       setViewTab]       = useState<"preview"|"code">("preview");
  const [error,         setError]         = useState<string | null>(null);

  /* ── Image upload ─────────────────────────────────────── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { setError("Ukuran gambar maksimal 1MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => setProductImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ── API call with retry & model fallback ─────────────── */
  const callGemini = async (payload: object, attempt = 0): Promise<any> => {
    const model = attempt < 3 ? MODELS[0] : MODELS[1];
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      if (res.status === 429 && attempt < 6) {
        await wait(Math.pow(2, Math.min(attempt, 4)) * 1200);
        return callGemini(payload, attempt + 1);
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      if (attempt < 5) {
        await wait(Math.pow(2, Math.min(attempt, 3)) * 1000);
        return callGemini(payload, attempt + 1);
      }
      throw err;
    }
  };

  /* ── HTML wrapper (CSS custom properties approach) ───────── */
  const constructFullHtml = useCallback((bodyContent: string) => {
    const fontSlug = fontFamily.replace(/ /g, '+');
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${productName || 'Landing Page'}</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://fonts.googleapis.com/css2?family=${fontSlug}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
:root {
  --primary: ${primaryColor};
  --accent:  ${accentColor};
  --font:    '${fontFamily}', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; scroll-behavior: smooth; }
body { font-family: var(--font); overflow-x: hidden; color: #1e293b; line-height: 1.65; background: #fff; }

/* ── Utility: btn-primary ── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff !important; font-weight: 800; padding: 1rem 2.25rem;
  border-radius: .875rem; border: none; cursor: pointer;
  text-decoration: none !important; font-size: 1rem; letter-spacing: .01em;
  box-shadow: 0 10px 30px -5px color-mix(in srgb, var(--primary) 40%, transparent);
  transition: transform .3s, box-shadow .3s, filter .3s;
}
.btn-primary:hover {
  transform: translateY(-3px);
  filter: brightness(1.08);
  box-shadow: 0 20px 45px -8px color-mix(in srgb, var(--primary) 50%, transparent);
}

/* ── Scroll reveal ── */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .65s ease-out, transform .65s ease-out; }
.reveal.active { opacity: 1; transform: none; }

/* ── FAQ accordion ── */
.faq-content { max-height: 0; overflow: hidden; transition: max-height .35s ease-out; }
.faq-item.active .faq-content { max-height: 600px; padding-bottom: 1.25rem; }
.faq-item.active .faq-icon { transform: rotate(180deg); }
.faq-icon { transition: transform .3s; }

/* ── Sticky CTA ── */
#sticky-cta {
  position: fixed; bottom: 1rem; left: 1rem; right: 1rem; z-index: 9999;
  transition: transform .4s cubic-bezier(.4,0,.2,1), opacity .4s;
}
#sticky-cta.hidden-cta { transform: translateY(120%); opacity: 0; pointer-events: none; }
@media (min-width: 768px) { #sticky-cta { width: 360px; left: auto; right: 2rem; } }

/* ── Floating WA ── */
.wa-float { position: fixed; bottom: 2rem; left: 2rem; z-index: 9998; transition: transform .3s; }
.wa-float:hover { transform: scale(1.12); }

/* ── Product image ── */
.product-img { width: 100%; height: auto; border-radius: 1.25rem; object-fit: cover;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,.15); }

/* ── Testimonial slider ── */
.testi-track { display: flex; transition: transform .5s ease; }
.testi-slide { flex: 0 0 100%; }
</style>
</head>
<body>
${bodyContent}
<script>
// Scroll reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Sticky CTA
const stickyCta = document.getElementById('sticky-cta');
if (stickyCta) {
  stickyCta.classList.add('hidden-cta');
  window.addEventListener('scroll', () => {
    scrollY > 500 ? stickyCta.classList.remove('hidden-cta') : stickyCta.classList.add('hidden-cta');
  });
}

// FAQ
document.querySelectorAll('.faq-trigger').forEach(t =>
  t.addEventListener('click', () => t.closest('.faq-item').classList.toggle('active'))
);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const el = document.querySelector(this.getAttribute('href'));
    if (el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' }); }
  });
});

// Testimonial slider (simple auto-slide)
const track = document.querySelector('.testi-track');
if (track) {
  let idx = 0;
  const slides = track.querySelectorAll('.testi-slide');
  const total = slides.length;
  if (total > 1) {
    setInterval(() => {
      idx = (idx + 1) % total;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    }, 4000);
  }
}
<\/script>
</body>
</html>`;
  }, [primaryColor, accentColor, fontFamily, productName]);

  /* ── Main generate action ──────────────────────────────── */
  const handleGenerate = async () => {
    if (!productName.trim() || !orderUrl.trim()) {
      setError("Nama Produk & Link Order wajib diisi dulu ya!");
      return;
    }
    setIsGenerating(true);
    setError(null);

    const ytId = getYouTubeId(youtubeUrl);

    const structurePrompt = pageType === "Toko Online" ? `
STRUKTUR KONTEN (Toko Online):
- Header brand yang menarik
- Grid produk minimal 4 item terinspirasi dari: ${productDesc}
- Setiap item: nama, harga ${priceValue}, tombol "${ctaText}" (href="${orderUrl}")
- Keunggulan toko / USP section
- Footer lengkap` : pageType === "Blog Page" ? `
STRUKTUR KONTEN (Blog Page):
- Header & navigasi
- Konten artikel berdasarkan: ${productDesc}
- Sidebar opsional dengan CTA
- Tombol "${ctaText}" mengarah ke ${orderUrl}
- Footer` : `
STRUKTUR KONTEN (${pageType}):
1. Hero — Headline powerful + subheadline meyakinkan + tombol CTA "${ctaText}" (href="${orderUrl}")
2. Problem — Pain point nyata yang dirasakan oleh: ${targetAudience || 'target audiens'}
3. Solution/Benefit — Solusi konkret & manfaat utama produk
4. Features — 3–4 fitur unggulan dengan detail dari: ${productDesc}
5. Social Proof — 3–4 testimoni dummy realistis (nama + profesi + detail hasil)
${bonusInfo ? `6. Bonus — Tampilkan bonus eksklusif: "${bonusInfo}"` : ''}
${priceValue ? `7. Pricing (id="pricing") — Harga ${priceValue} dengan value stack & urgency` : ''}
8. Final CTA — Penutup kuat dengan risk reversal / garansi
9. Footer — Sederhana + disclaimer`;

    const prompt = `
Generate ${pageType} Blogspot professional & high-converting menggunakan Tailwind CSS CDN.

DATA:
- Produk: "${productName}"
- Deskripsi: "${productDesc}"
- Tujuan: "${pageGoal || 'penjualan & konversi'}"
- Audiens: "${targetAudience || 'umum'}"
- Nuansa Desain: "${designVibe || 'Modern, clean, profesional, mobile-first'}"
- Framework Copy: ${framework}
- CTA: "${ctaText}"
- Harga: ${priceValue || '-'}
- Order Link: ${orderUrl}
${bonusInfo ? `- Bonus: "${bonusInfo}"` : ''}

${structurePrompt}

GAMBAR PRODUK:
- IMAGE_AVAILABLE: ${!!productImage}
- Jika true: <img src="{{PRODUCT_IMAGE}}" class="product-img"> di posisi paling persuasif
- Jika false: JANGAN buat tag img atau placeholder sama sekali — hapus semua kontainer gambar

${ytId ? `VIDEO YOUTUBE: Sertakan embed di section demo/bukti:
<iframe width="100%" style="aspect-ratio:16/9;border-radius:1rem;display:block;" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen></iframe>` : ''}

FITUR OPSIONAL:
- Floating WA Button (bottom-left): ${useFloatingWA} ${useFloatingWA ? `→ href="${orderUrl}" (buka di tab baru)` : ''}
- Countdown Timer (JS real-time): ${useCountdown}
- Testimonial Slider (class="testi-track" + "testi-slide"): ${useTestimonialSlider}
- Sticky Mobile CTA: SELALU sertakan (id="sticky-cta") dengan class="btn-primary hidden-cta"

STYLING WAJIB:
- var(--primary) → warna aksen utama, var(--accent) → gradient kedua, var(--font) → font
- class="btn-primary" untuk SEMUA tombol CTA utama
- class="reveal" untuk setiap section utama (scroll animation aktif)
- Design mobile-first, responsive, visual hierarchy kuat
- Copywriting Bahasa Indonesia: kasual tapi profesional, persuasif, pakai bahasa natural
- Terapkan ${framework} secara ketat di seluruh struktur copy
- Headline wajib menggunakan angka spesifik atau pertanyaan yang memancing

OUTPUT:
- Hanya body content (dari elemen pertama sampai elemen terakhir)
- JANGAN output <!DOCTYPE>, <html>, <head>, <body>, <script src="tailwind">, atau <style>
- Langsung mulai dari <header> atau <section> pertama
- TIDAK ada markdown fence, TIDAK ada komentar di luar HTML
`;

    try {
      const data = await callGemini({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [{ text: "Kamu adalah Elite Direct Response Web Developer & Copywriter Indonesia terbaik. Output HANYA raw HTML body content — mulai langsung dari elemen HTML pertama tanpa <!DOCTYPE>, tanpa <html>, <head>, <body>, tanpa markdown fence, tanpa komentar apapun di luar tag HTML. CSS dan JS sudah disiapkan di wrapper, jadi jangan ulangi import Tailwind atau style global." }]
        },
        generationConfig: { temperature: 0.78, maxOutputTokens: 8192 }
      });

      let content: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      content = content.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

      if (productImage) {
        content = content.replace(/\{\{PRODUCT_IMAGE\}\}/g, productImage);
      } else {
        content = content.replace(/\{\{PRODUCT_IMAGE\}\}/g, "");
      }

      if (!content) throw new Error("Gemini tidak mengembalikan konten.");
      setGeneratedHtml(content);
      setViewTab("preview");
    } catch (e: any) {
      setError(e.message || "Generate gagal. Periksa koneksi atau coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── Copy & Download ─────────────────────────────────── */
  const copyToClipboard = () => {
    const html = constructFullHtml(generatedHtml);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(html);
    } else {
      const ta = document.createElement("textarea");
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const downloadHtml = () => {
    const blob = new Blob([constructFullHtml(generatedHtml)], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${(productName || 'lp').replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="w-[400px] flex flex-col bg-white border-r border-gray-100 shadow-xl z-20 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
              <Zap className="text-white fill-white" size={16} />
            </div>
            <div>
              <h1 className="font-black text-[15px] tracking-tight leading-none">
                LP Generator <span className="text-blue-600">V.3</span>
              </h1>
              <p className="text-[10px] text-gray-400 mt-0.5">AI-Powered Landing Page Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1.5">
            <Bot size={11} className="text-blue-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-600">Gemini AI</span>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28">

          {/* Error */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={14} />
              <p className="text-xs font-medium text-rose-600">{error}</p>
            </div>
          )}

          {/* 1 · Core Config */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Flag size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Core Config</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Jenis Halaman</label>
                <select value={pageType} onChange={e => setPageType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Landing Page</option>
                  <option>Sales Page</option>
                  <option>Toko Online</option>
                  <option>Blog Page</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Framework Copy</label>
                <select value={framework} onChange={e => setFramework(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>AIDA Framework</option>
                  <option>PAS Framework</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                Nama Produk / Brand <span className="text-rose-500">*</span>
              </label>
              <input value={productName} onChange={e => setProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Contoh: Skincare Whitening Glow" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Deskripsi Produk & Detail Penawaran</label>
              <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)}
                className="w-full h-24 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Jelaskan fitur, manfaat, dan apa yang membuat produk Anda spesial..." />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Tujuan Halaman</label>
              <input value={pageGoal} onChange={e => setPageGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Misal: Jualan produk, Generate leads WA..." />
            </div>
          </section>

          {/* 2 · Audience */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Target Audiens</span>
            </div>
            <textarea value={targetAudience} onChange={e => setTargetAudience(e.target.value)}
              className="w-full h-16 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Siapa target pasar Anda? (usia, profesi, masalah yang mereka rasakan...)" />
          </section>

          {/* 3 · Design & CTA */}
          <section className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Palette size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Desain & Tombol</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Nuansa Desain</label>
                <input value={designVibe} onChange={e => setDesignVibe(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Elegan, Islami, Tech, Luxury..." />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Teks Tombol CTA</label>
                <input value={ctaText} onChange={e => setCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beli Sekarang" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Harga</label>
                <input value={priceValue} onChange={e => setPriceValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rp 299.000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  Link Order <span className="text-rose-500">*</span>
                </label>
                <input value={orderUrl} onChange={e => setOrderUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Link WA / Checkout" />
              </div>
            </div>

            {/* Theme presets */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-2">Tema Warna</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {THEMES.map(t => (
                  <button key={t.name}
                    onClick={() => { setPrimaryColor(t.primary); setAccentColor(t.accent); }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all
                      ${primaryColor === t.primary
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400'
                        : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className="flex gap-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: t.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: t.accent }} />
                    </div>
                    <span className={`text-[9px] font-black uppercase ${primaryColor === t.primary ? 'text-blue-600' : 'text-gray-400'}`}>
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom hex pickers */}
              <div className="flex gap-2">
                {[
                  { label: "Primary", value: primaryColor, set: setPrimaryColor },
                  { label: "Accent",  value: accentColor,  set: setAccentColor  },
                ].map(({ label, value, set }) => (
                  <div key={label} className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <input type="color" value={value} onChange={e => set(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" />
                    <div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">{label}</div>
                      <div className="text-[11px] font-mono text-gray-600 leading-none">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Font</label>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {FONTS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </section>

          {/* 4 · Optional Features */}
          <section className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
              <Sparkles size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fitur Tambahan</span>
            </div>
            {[
              { icon: <MessageCircle size={14} className="text-green-500" />,  label: "Floating WhatsApp Button", value: useFloatingWA,        set: setUseFloatingWA },
              { icon: <Clock        size={14} className="text-rose-500"  />,  label: "Countdown Timer",          value: useCountdown,         set: setUseCountdown },
              { icon: <LayoutGrid   size={14} className="text-indigo-500"/>,  label: "Testimonial Slider",       value: useTestimonialSlider, set: setUseTestimonialSlider },
            ].map(item => (
              <label key={item.label} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                </div>
                <button onClick={() => item.set(v => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.value ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${item.value ? 'translate-x-[18px]' : 'translate-x-1'}`} />
                </button>
              </label>
            ))}
          </section>

          {/* 5 · Media */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <ImageIcon size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Media & Gambar</span>
            </div>

            {/* Image upload */}
            <div className="relative cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-all bg-gray-50 group">
              <input type="file" accept="image/*" onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              {productImage ? (
                <div className="relative">
                  <img src={productImage} alt="Preview" className="w-full h-28 object-contain rounded-lg" />
                  <button onClick={e => { e.stopPropagation(); setProductImage(null); }}
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-rose-500 z-20 hover:bg-rose-50">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-3 text-gray-400 group-hover:text-blue-400 transition-colors">
                  <ImageIcon size={22} className="mb-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Upload Gambar Produk (Maks. 1MB)</span>
                </div>
              )}
            </div>

            <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="🎬 Link Video YouTube (Opsional)" />

            <textarea value={bonusInfo} onChange={e => setBonusInfo(e.target.value)}
              className="w-full h-14 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="🎁 Bonus / Penawaran Eksklusif (Opsional)" />
          </section>

        </div>{/* end scrollable form */}

        {/* Generate Button */}
        <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
          <button onClick={handleGenerate} disabled={isGenerating}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg
              ${isGenerating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.98]'}`}>
            {isGenerating ? <RefreshCw className="animate-spin" size={17} /> : <Sparkles size={17} />}
            {isGenerating ? "AI GENERATING..." : "GENERATE dengan Gemini AI"}
          </button>
        </div>

      </aside>

      {/* ═══════════════ MAIN AREA ═══════════════ */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* View tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button onClick={() => setViewTab("preview")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all
                  ${viewTab === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                <Eye size={13} /> PRATINJAU
              </button>
              <button onClick={() => setViewTab("code")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all
                  ${viewTab === "code" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                <Terminal size={13} /> KODE HTML
              </button>
            </div>
            {/* Device toggle */}
            {viewTab === "preview" && (
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button onClick={() => setPreviewMode("desktop")}
                  className={`p-1.5 rounded-lg transition-all ${previewMode === "desktop" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}>
                  <Monitor size={15} />
                </button>
                <button onClick={() => setPreviewMode("mobile")}
                  className={`p-1.5 rounded-lg transition-all ${previewMode === "mobile" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}>
                  <Smartphone size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {generatedHtml && (
            <div className="flex items-center gap-2">
              <button onClick={downloadHtml}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all border border-gray-200">
                <Download size={13} /> UNDUH HTML
              </button>
              <button onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all
                  ${isCopied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
                {isCopied ? <Check size={13} /> : <Copy size={13} />}
                {isCopied ? "DISALIN!" : "SALIN KODE"}
              </button>
            </div>
          )}
        </header>

        {/* Preview Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col items-center bg-slate-50">
          {generatedHtml ? (
            <div className="w-full h-full flex justify-center items-start">
              {viewTab === "preview" ? (
                <div className={`transition-all duration-500 bg-white shadow-2xl
                  ${previewMode === "mobile"
                    ? "w-[390px] h-full rounded-[2.5rem] border-[10px] border-slate-900 overflow-hidden ring-4 ring-slate-800"
                    : "w-full max-w-6xl h-full rounded-2xl border border-gray-200 overflow-hidden"}`}>
                  <iframe title="LP Preview" srcDoc={constructFullHtml(generatedHtml)} className="w-full h-full border-none" />
                </div>
              ) : (
                <div className="w-full max-w-6xl h-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="ml-2 text-xs text-slate-400 font-mono">
                      {(productName || 'lp').replace(/\s+/g, '-').toLowerCase()}.html
                    </span>
                  </div>
                  <textarea spellCheck={false} readOnly value={constructFullHtml(generatedHtml)}
                    className="flex-1 w-full bg-transparent p-6 text-slate-300 font-mono text-xs outline-none resize-none leading-relaxed" />
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center space-y-5 text-gray-400">
              <div className="w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                <Sparkles size={44} className="text-blue-500 opacity-40" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">LP Generator V.3</h2>
                <p className="text-sm text-gray-400 mt-1.5">Isi form di kiri — lalu klik Generate.</p>
                <p className="text-xs text-gray-300 mt-1">Powered by Gemini AI • Full HTML generation</p>
              </div>
            </div>
          )}
        </div>

      </main>

      <style>{`
        aside > div::-webkit-scrollbar { width: 4px; }
        aside > div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 8px; }
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-thumb { background: #334155; border-radius: 8px; }
      `}</style>
    </div>
  );
}
