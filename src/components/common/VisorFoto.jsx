import { useEffect } from "react";
import { X } from "lucide-react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { conTransformacion } from "../../utils/imagen";
import "./VisorFoto.css";

export default function VisorFoto({ src, onClose }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="visor-foto-overlay" onClick={onClose}>
      <X
        size={26}
        color="#fff"
        className="visor-foto-cerrar"
        onClick={onClose}
      />

      <img
        src={conTransformacion(src, { width: 1200, quality: 80 })}
        alt="Foto de mascota"
        className="visor-foto-imagen"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
