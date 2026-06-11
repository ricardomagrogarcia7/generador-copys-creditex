import { useState, useRef, useCallback } from "react";

const BRANDS = {
  MBO: {
    label: "MBO",
    color: "#1a1a1a",
    accent: "#C8A96E",
    bg: "#F7F5F0",
    subbrands: null,
    hasWhatsApp: true,
    systemPrompt: `Eres el experto en copywriting de MBO, marca peruana de moda masculina premium (NSE A y B+) fundada en 2012 por Creditex.

ESENCIA: "Diseño en serio, no en serie." Comunidad, no solo clientes. Talento local, visión global.

PERFILES DE CONSUMIDOR:
- Creador Explorador: innova, experimenta tendencias
- Networker: cool, extrovertido, social
- Wise Officeman: clásico, sabe lo que le gusta
- Experimentado: práctico, figura paterna, tradicional

TONO: Cercano (sin modismos ni jerga), aspiracional, directo. Como un amigo con criterio que te habla con confianza.

VOCABULARIO PERMITIDO: algodón pima, hilados finos, confeccionado en Perú, marca responsable, ecoamigable, Vitale Barberis Canonico (solo ternos), casual, semiformal, formal (solo ternos), elegante (solo ternos), promoción, prendas versátiles, atemporal, colección, ComunidadMBO.

PALABRAS PROHIBIDAS: oferta, sport elegante, aliados de Creditex, poliéster/spandex/sintéticos (nunca mencionarlos), "estilo" como atributo ("no te da estilo"), abusar de "versátil", coloquialismos, lisuras.

REGLA DE ORO DEL COPY: Las primeras 125 caracteres son SAGRADAS. Deben contener el gancho principal + la información clave de la campaña ANTES del "ver más". Prioriza que el descuento o dinámica de campaña quede en esa zona.

EMOJIS: Máximo 2 por copy (1 hook visual al inicio + 1 cierre). Usar solo emojis de esta lista aprobada: 🧵 👕 👔 🪡 ✂️ 🤍 🌿 🪴 🌱 ☀️ 🌊 🏔️ 🇵🇪 ✨ 🎨 🖤 🤎 🩶 🩵 🌸 ☕ 🍽️ 🥂 ✈️ 🏖️ 🎉 💬 🤝 👀 💡 📲 ⏳ 🍷 🏅 📅
EMOJIS PROHIBIDOS: 🔥 💥 😍 🥵 💸 🤑 🛍️ (en exceso) 🚨 💯

HASHTAGS: Siempre al final del copy. Deben ser relevantes a la campaña y creativos.
CTA: Máximo 3 palabras. Directo, dinámico, sin puntuación.
PARA CAMPAÑAS DE TRÁFICO/RECONOCIMIENTO A TIENDAS: El copy y CTA deben generar intención de visitar la tienda física. El mensaje WhatsApp debe invitar a descubrir la colección o coordinar visita.`,
  },
  CF: {
    label: "Creditex Factory",
    color: "#1C2B4A",
    accent: "#D4862A",
    bg: "#F5F7FA",
    subbrands: ["Marc Boehler", "Pimafine", "Landford Plus"],
    hasWhatsApp: true,
    systemPrompt: `Eres el experto en copywriting de Creditex Factory, formato outlet premium peruano con el concepto "De todo para todos" (NSE B y B+).

HISTORIA: Más de 40 años de trayectoria. Respaldado por Creditex, la empresa textil con mayor integración vertical del Perú. Calidad 100% peruana.

PILARES: Calidad, certificaciones internacionales (OEKO-TEX, GOTS, WRAP, BASC), experiencia de compra.

SUBMARCAS Y SUS PERFILES:
- Marc Boehler: Hombres de 45-60 años, padres de familia, profesionales, funcionales, prácticos. Tono: serio, confiable, directo.
- Pimafine: Mujeres de 45-60 años, madres de hogar, personas de oficina, prácticas. Tono: cercano, funcional, cálido.
- Landford Plus: Hombres plus size. Camisería formal, tallas grandes (15 33 – 19 37). Tono: incluyente, directo, empoderador.

TONO GENERAL CF: Cercano pero funcional. No aspiracional como MBO. Habla desde la utilidad, la calidad peruana y la relación calidad-precio.

VOCABULARIO CLAVE: calidad, algodón pima, confección peruana, garantía, precio justo, variedad, tallas, familia, uso diario, oficina, formal, clásico.

REGLA DE ORO DEL COPY: Las primeras 125 caracteres son SAGRADAS. Gancho + información clave antes del "ver más".
EMOJIS: Máximo 2 por copy. CTA: Máximo 3 palabras.
PARA TRÁFICO/RECONOCIMIENTO: Copy orientado a generar visita a tienda física o ecommerce. Adaptar por submarca.`,
  },
  NT: {
    label: "Norman & Taylor",
    color: "#2C3A2C",
    accent: "#8B7355",
    bg: "#F8F6F2",
    subbrands: null,
    hasWhatsApp: false,
    systemPrompt: `Eres el experto en copywriting de Norman & Taylor, la marca de lujo de Creditex. 19 años de historia. Camisería premium y trajes a la medida (NSE A y A+).

PERFIL DEL CONSUMIDOR: Hombres de 50 años a más. Gerentes, políticos, abogados, ejecutivos de alto nivel. Poder adquisitivo elevado. Valoran calidad, exclusividad y experiencia personalizada.

ESENCIA: Alianza con Vitale Barberis Canonico (telas italianas más antiguas del mundo). Línea 160/2 Experience (telas extra finas).

TONO: Sofisticado, corporativo, formal, técnico y directo. Sin coloquialismos. Sin hipérboles baratas.

VOCABULARIO CLAVE: algodón pima peruano, telas italianas, Vitale Barberis Canonico, confección a la medida, 160/2 Experience, hilados extrafinos, exclusividad, elegancia contenida.

REGLAS ABSOLUTAS:
- SIN emojis. Ninguno.
- SIN CTA. No incluir llamada a la acción.
- Copy contenido y preciso. Menos es más.
- Las primeras 125 caracteres deben contener la idea central de la campaña.
- Tono editorial, no comercial. Informa y posiciona, no vende de forma obvia.
CANALES: Meta Ads y LinkedIn Ads.`,
  },
};

const OBJECTIVES = [
  { value: "ventas", label: "Ventas / Conversión" },
  { value: "trafico_tienda", label: "Tráfico a tienda física" },
  { value: "trafico_web", label: "Tráfico a ecommerce" },
  { value: "reconocimiento", label: "Reconocimiento de marca" },
  { value: "descuento", label: "Campaña de descuento / promoción" },
  { value: "lanzamiento", label: "Lanzamiento de colección" },
  { value: "linkedin", label: "LinkedIn (solo NT)" },
];

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.75;

export default function GeneradorCopys() {
  const [step, setStep] = useState("config");
  const [brand, setBrand] = useState("MBO");
  const [subbrand, setSubbrand] = useState("");
  const [objective, setObjective] = useState("ventas");
  const [brief, setBrief] = useState("");
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [copied, setCopied] = useState({});
  const fileRef = useRef();

  const currentBrand = BRANDS[brand];

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
      reader.onload = (ev) => {
        const img = new Image();
        img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
          const base64 = compressed.split(",")[1];
          const compressedBytes = Math.round((base64.length * 3) / 4);
          resolve({ data: base64, mediaType: "image/jpeg", originalSize: file.size, compressedSize: compressedBytes, dimensions: { width, height } });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setCompressing(true);
    setError("");
    try {
      const result = await compressImage(file);
      setImageData(result);
    } catch (err) {
      setError("Error al procesar la imagen: " + err.message);
      setImage(null);
    } finally {
      setCompressing(false);
    }
  };

  const copyText = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const generate = useCallback(async () => {
    if (!brief && !imageData) {
      setError("Necesitas subir un creativo o escribir un brief.");
      return;
    }
    setError("");
    setStep("generating");
    setResults(null);
    setProgress("Gemini 2.5 Flash está generando los copys...");

    try {
      const selectedObjective = OBJECTIVES.find(o => o.value === objective)?.label || objective;
      const isTrafico = objective === "trafico_tienda" || objective === "trafico_web" || objective === "reconocimiento";
      const isNT = brand === "NT";

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageData?.data || null,
          mimeType: imageData?.mediaType || "image/jpeg",
          systemPrompt: currentBrand.systemPrompt,
          brandLabel: currentBrand.label,
          subbrand,
          objectiveLabel: selectedObjective,
          brief,
          isNT,
          isTrafico,
          hasWhatsApp: currentBrand.hasWhatsApp,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = typeof errData?.error === 'string'
          ? errData.error
          : errData?.error?.message || `Error ${res.status}`;
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || 'Error desconocido');
      }

      setResults(data.result);
      setStep("results");
    } catch (err) {
      setError("Error al generar: " + err.message);
      setStep("config");
    }
  }, [brand, subbrand, objective, brief, imageData, currentBrand]);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const brandStyle = { "--brand-color": currentBrand.color, "--brand-accent": currentBrand.accent, "--brand-bg": currentBrand.bg };

  return (
    <div style={{ ...brandStyle, minHeight: "100vh", background: "var(--brand-bg)", fontFamily: "'Georgia', serif", transition: "background 0.4s" }}>
      <div style={{ background: "var(--brand-color)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: "var(--brand-accent)", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 4 }}>CREDITEX GROUP</div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: "bold", letterSpacing: "0.05em" }}>GENERADOR DE COPYS</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(BRANDS).map(([key, b]) => (
            <button key={key} onClick={() => { setBrand(key); setSubbrand(""); setResults(null); setStep("config"); }}
              style={{ padding: "8px 16px", borderRadius: 4, border: brand === key ? `2px solid ${b.accent}` : "2px solid transparent", background: brand === key ? b.accent : "rgba(255,255,255,0.1)", color: brand === key ? "#fff" : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.2s" }}>
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
        {(step === "config" || step === "generating") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {currentBrand.subbrands && (
              <Section title="Submarca" accent={currentBrand.accent}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {currentBrand.subbrands.map(s => (
                    <Chip key={s} label={s} selected={subbrand === s} accent={currentBrand.accent} onClick={() => setSubbrand(subbrand === s ? "" : s)} />
                  ))}
                </div>
              </Section>
            )}

            <Section title="Objetivo de campaña" accent={currentBrand.accent}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {OBJECTIVES.filter(o => brand === "NT" ? true : o.value !== "linkedin").map(o => (
                  <Chip key={o.value} label={o.label} selected={objective === o.value} accent={currentBrand.accent} onClick={() => setObjective(o.value)} />
                ))}
              </div>
            </Section>

            <Section title="Creativo (opcional)" accent={currentBrand.accent}>
              <div onClick={() => !compressing && fileRef.current.click()}
                style={{ border: `2px dashed ${image ? currentBrand.accent : "#ccc"}`, borderRadius: 8, padding: "24px", textAlign: "center", cursor: compressing ? "wait" : "pointer", background: image ? `${currentBrand.accent}10` : "transparent", transition: "all 0.2s" }}>
                {compressing ? (
                  <div style={{ color: currentBrand.accent, fontSize: 14 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>Comprimiendo imagen...
                  </div>
                ) : image && imageData ? (
                  <div>
                    <img src={URL.createObjectURL(image)} alt="" style={{ maxHeight: 160, borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ fontSize: 12, color: currentBrand.accent, fontWeight: "bold" }}>{image.name}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 6, fontFamily: "monospace" }}>{imageData.dimensions.width}×{imageData.dimensions.height}px · {formatBytes(imageData.compressedSize)}</div>
                    <div style={{ fontSize: 10, color: "#22C55E", marginTop: 2, fontFamily: "monospace" }}>↓ {Math.round((1 - imageData.compressedSize / imageData.originalSize) * 100)}% más liviana (original: {formatBytes(imageData.originalSize)})</div>
                  </div>
                ) : (
                  <div style={{ color: "#999", fontSize: 14 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                    Haz clic para subir el creativo
                    <div style={{ fontSize: 11, marginTop: 4, color: "#bbb" }}>Compresión automática · Gemini 2.5 Flash analiza y genera · JPG, PNG, WEBP</div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImage} style={{ display: "none" }} />
              </div>
              {image && !compressing && (
                <button onClick={() => { setImage(null); setImageData(null); }} style={{ marginTop: 8, background: "none", border: "none", color: "#999", fontSize: 12, cursor: "pointer" }}>✕ Quitar imagen</button>
              )}
            </Section>

            <Section title="Brief de campaña" accent={currentBrand.accent}>
              <textarea value={brief} onChange={e => setBrief(e.target.value)}
                placeholder="Describe la campaña: producto, dinámica de descuento, fechas, mensaje clave, cualquier detalle relevante..."
                rows={5} style={{ width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 14, resize: "vertical", fontFamily: "Georgia, serif", boxSizing: "border-box", lineHeight: 1.6 }} />
            </Section>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "12px 16px", color: "#DC2626", fontSize: 13 }}>{error}</div>}

            <button onClick={generate} disabled={step === "generating" || compressing}
              style={{ background: (step === "generating" || compressing) ? "#ccc" : currentBrand.accent, color: "#fff", border: "none", borderRadius: 6, padding: "16px 32px", fontSize: 15, fontWeight: "bold", letterSpacing: "0.08em", cursor: (step === "generating" || compressing) ? "not-allowed" : "pointer", width: "100%", transition: "all 0.2s" }}>
              {step === "generating" ? `⏳ ${progress}` : compressing ? "Procesando imagen..." : "GENERAR COPYS →"}
            </button>
          </div>
        )}

        {step === "results" && results && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: currentBrand.accent, letterSpacing: "0.1em", fontFamily: "monospace" }}>RESULTADOS · GEMINI 2.5 FLASH</div>
                <div style={{ fontSize: 22, fontWeight: "bold", color: currentBrand.color }}>{currentBrand.label}{subbrand ? ` · ${subbrand}` : ""}</div>
              </div>
              <button onClick={() => { setStep("config"); setResults(null); }} style={{ background: currentBrand.color, color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 13, cursor: "pointer", letterSpacing: "0.05em" }}>← NUEVA GENERACIÓN</button>
            </div>

            <ResultSection title="TEXTO PRIMARIO" subtitle="Primeras 125 caracteres = gancho antes del 'ver más'" accent={currentBrand.accent} color={currentBrand.color}>
              {results.texto_primario?.map((v, i) => <CopyCard key={i} index={i + 1} text={v} id={`tp_${i}`} copied={copied} onCopy={copyText} accent={currentBrand.accent} showCharCount />)}
            </ResultSection>

            <ResultSection title="TITULAR" accent={currentBrand.accent} color={currentBrand.color}>
              {results.titular?.map((v, i) => <CopyCard key={i} index={i + 1} text={v} id={`ti_${i}`} copied={copied} onCopy={copyText} accent={currentBrand.accent} compact />)}
            </ResultSection>

            <ResultSection title="DESCRIPCIÓN" accent={currentBrand.accent} color={currentBrand.color}>
              {results.descripcion?.map((v, i) => <CopyCard key={i} index={i + 1} text={v} id={`de_${i}`} copied={copied} onCopy={copyText} accent={currentBrand.accent} compact />)}
            </ResultSection>

            {results.cta && (
              <ResultSection title="CTA" subtitle="Máximo 3 palabras · Para el botón" accent={currentBrand.accent} color={currentBrand.color}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {results.cta.map((v, i) => (
                    <button key={i} onClick={() => copyText(`cta_${i}`, v)} style={{ padding: "10px 20px", borderRadius: 6, background: copied[`cta_${i}`] ? "#22C55E" : currentBrand.color, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: "bold", letterSpacing: "0.05em", transition: "all 0.2s" }}>
                      {copied[`cta_${i}`] ? "✓" : v}
                    </button>
                  ))}
                </div>
              </ResultSection>
            )}

            {(results.whatsapp_bienvenida || results.whatsapp_predefinido) && (
              <ResultSection title="MENSAJES WHATSAPP" subtitle="Para campañas de tráfico y reconocimiento" accent={currentBrand.accent} color={currentBrand.color}>
                {results.whatsapp_bienvenida && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, color: "#999", marginBottom: 6, fontFamily: "monospace" }}>BIENVENIDA (empresa)</div><CopyCard text={results.whatsapp_bienvenida} id="wa_b" copied={copied} onCopy={copyText} accent={currentBrand.accent} compact /></div>}
                {results.whatsapp_predefinido && <div><div style={{ fontSize: 11, color: "#999", marginBottom: 6, fontFamily: "monospace" }}>PREDEFINIDO (usuario)</div><CopyCard text={results.whatsapp_predefinido} id="wa_p" copied={copied} onCopy={copyText} accent={currentBrand.accent} compact /></div>}
              </ResultSection>
            )}

            {results.hashtags && (
              <ResultSection title="HASHTAGS" subtitle="Para el final del copy" accent={currentBrand.accent} color={currentBrand.color}>
                <CopyCard text={results.hashtags} id="hash" copied={copied} onCopy={copyText} accent={currentBrand.accent} compact />
              </ResultSection>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.12em", color: accent, marginBottom: 10, fontWeight: "bold" }}>{title}</div>
      {children}
    </div>
  );
}

function ResultSection({ title, subtitle, children, accent, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ marginBottom: subtitle ? 4 : 14 }}>
        <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.12em", color: accent, fontWeight: "bold" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function CopyCard({ text, id, copied, onCopy, accent, compact, showCharCount, index }) {
  const first125 = text?.substring(0, 125) || "";
  const rest = text?.substring(125) || "";
  return (
    <div style={{ background: "#F8F8F8", borderRadius: 8, padding: compact ? "12px 14px" : "16px 18px", position: "relative", border: "1px solid #EBEBEB" }}>
      {index && <div style={{ fontSize: 10, color: "#bbb", fontFamily: "monospace", marginBottom: 6 }}>VARIANTE {index}</div>}
      {showCharCount ? (
        <div style={{ fontSize: 14, lineHeight: 1.7, color: "#1a1a1a", marginRight: 36 }}>
          <span style={{ background: `${accent}20`, borderRadius: 3, padding: "1px 2px" }}>{first125}</span>
          <span style={{ color: "#666" }}>{rest}</span>
        </div>
      ) : (
        <div style={{ fontSize: 14, lineHeight: 1.7, color: "#1a1a1a", marginRight: 36 }}>{text}</div>
      )}
      <button onClick={() => onCopy(id, text)} style={{ position: "absolute", top: 12, right: 12, background: copied[id] ? "#22C55E" : accent, color: "#fff", border: "none", borderRadius: 5, padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s" }}>
        {copied[id] ? "✓" : "COPIAR"}
      </button>
      {showCharCount && <div style={{ fontSize: 10, color: "#bbb", marginTop: 6, fontFamily: "monospace" }}>{text?.length} chars · <span style={{ color: accent }}>resaltado = primeros 125</span></div>}
    </div>
  );
}

function Chip({ label, selected, accent, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 20, border: selected ? `2px solid ${accent}` : "2px solid #ddd", background: selected ? accent : "transparent", color: selected ? "#fff" : "#555", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}
