/**
 * Helpers para redimensionar y comprimir imágenes en el navegador
 * antes de subirlas a Supabase Storage.
 */

const MIME_SOPORTADOS = ["image/jpeg", "image/png", "image/webp"];

/**
 * Comprime y redimensiona una imagen manteniendo su proporción.
 *
 * @param {File} file Archivo de imagen original.
 * @param {{ maxWidth?: number, maxHeight?: number, quality?: number }} opciones
 * @returns {Promise<File>} Archivo procesado (o el original si no aplica).
 */
export async function comprimirImagen(
  file,
  { maxWidth = 800, maxHeight = 800, quality = 0.7 } = {}
) {
  if (!file || !file.type.startsWith("image/")) return file;

  // Formatos no rasterizables (gif animado, svg, avif, etc.) se suben sin cambios.
  if (!MIME_SOPORTADOS.includes(file.type)) return file;

  try {
    const urlObjeto = URL.createObjectURL(file);
    const img = await cargarImagen(urlObjeto);
    URL.revokeObjectURL(urlObjeto);

    const { width, height } = calcularDimensiones(img, maxWidth, maxHeight);

    // No ampliar imágenes que ya son pequeñas.
    if (width >= img.naturalWidth && height >= img.naturalHeight) {
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // Fondo blanco para preservar transparencias (PNG) al convertir a JPEG.
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await convertirCanvasABlob(canvas, quality);
    if (!blob) return file;

    // Si el resultado no es más liviano, se conserva el original.
    if (blob.size >= file.size) return file;

    return new File([blob], renombrarArchivo(file), {
      type: blob.type || file.type,
    });
  } catch (err) {
    // Ante cualquier fallo se sube la imagen original sin interrumpir el flujo.
    return file;
  }
}

function cargarImagen(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = url;
  });
}

function calcularDimensiones(img, maxWidth, maxHeight) {
  const factor = Math.min(
    1,
    maxWidth / img.naturalWidth,
    maxHeight / img.naturalHeight
  );

  return {
    width: Math.round(img.naturalWidth * factor),
    height: Math.round(img.naturalHeight * factor),
  };
}

function convertirCanvasABlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/jpeg",
      quality
    );
  });
}

function renombrarArchivo(file) {
  const base = file.name.replace(/\.[^.]+$/, "") || "imagen";
  return `${base}.jpg`;
}

/**
 * Añade los parámetros de transformación de Supabase Storage (ImgProxy)
 * a una URL pública de imagen para servirse redimensionada y comprimida.
 *
 * @param {string} url URL pública del objeto en el bucket.
 * @param {{ width?: number, quality?: number }} opciones
 * @returns {string} URL con los parámetros de transformación.
 */
export function conTransformacion(url, { width = 800, quality = 70 } = {}) {
  if (!url) return url;
  const separador = url.includes("?") ? "&" : "?";
  return `${url}${separador}width=${width}&quality=${quality}`;
}
