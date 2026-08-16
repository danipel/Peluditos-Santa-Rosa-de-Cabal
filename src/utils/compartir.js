import { TEXTO_COMPARTIR, TITULO_COMPARTIR } from "../constants/mascotas";

export function tieneCompartirNativo() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  );
}

export function conTimeout(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

export async function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await conTimeout(navigator.clipboard.writeText(texto), 1500);
      return;
    } catch (err) {
      // continúa al fallback de execCommand
    }
  }

  await copiarConExecCommand(texto);
}

function copiarConExecCommand(texto) {
  return new Promise((resolve, reject) => {
    const area = document.createElement("textarea");
    area.value = texto;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    try {
      const ok = document.execCommand("copy");
      if (ok) resolve();
      else reject(new Error("execCommand devolvió false"));
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(area);
    }
  });
}

export function construirEnlacesCompartir(url) {
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${TEXTO_COMPARTIR} ${url}`
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(TEXTO_COMPARTIR)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      TEXTO_COMPARTIR
    )}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
  };
}

export function compartirNativo(url) {
  return navigator.share({
    title: TITULO_COMPARTIR,
    text: TEXTO_COMPARTIR,
    url,
  });
}
