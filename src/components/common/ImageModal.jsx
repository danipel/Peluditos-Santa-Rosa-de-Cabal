import { useEffect } from "react";
import { X } from "lucide-react";

export default function ImageModal({ src, alt, title, subtitle, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 10, 10, 0.88)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        padding: 16,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Foto en pantalla completa"}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(255, 255, 255, 0.15)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          transition: "background 0.2s",
          zIndex: 61,
        }}
        aria-label="Cerrar vista previa"
      >
        <X size={22} />
      </button>

      {/* Contenedor de imagen */}
      <div
        style={{
          maxWidth: "92vw",
          maxHeight: "84vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt || "Foto de mascota"}
          style={{
            maxWidth: "100%",
            maxHeight: "75vh",
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
          }}
        />
        {(title || subtitle) && (
          <div
            style={{
              marginTop: 12,
              textAlign: "center",
              color: "#fff",
            }}
          >
            {title && (
              <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
            )}
            {subtitle && (
              <div style={{ fontSize: 13, color: "#CCCCCC", marginTop: 3 }}>
                {subtitle}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
