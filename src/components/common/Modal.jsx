import { useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import "./Modal.css";

export default function Modal({ title, onClose, children }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ArrowLeft
              size={16}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />

            {title}
          </div>

          <X
            size={18}
            className="modal-close-btn"
            style={{
              cursor: "pointer",
              color: "#8A8A85",
            }}
            onClick={onClose}
          />
        </div>

        {/* Aquí aparece el contenido */}
        {children}
      </div>
    </div>
  );
}