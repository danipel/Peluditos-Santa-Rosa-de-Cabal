import { useEffect } from "react";
import { X } from "lucide-react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,9,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        padding: 16,
        overscrollBehavior: "none",
      }}
      onClick={onClose}
    >
      <X
        size={26}
        color="#fff"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          cursor: "pointer",
        }}
        onClick={onClose}
      />

      <img
        src={src}
        alt="Foto de mascota"
        style={{
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: 8,
          objectFit: "contain",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}