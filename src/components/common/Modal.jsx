import { ArrowLeft, X } from "lucide-react";

export default function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20, 20, 18, 0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 480,
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: "16px 16px 0 0",
          padding: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
              fontSize: 15.5,
            }}
          >
            <ArrowLeft
              size={16}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />

            {title}
          </div>

          <X
            size={18}
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