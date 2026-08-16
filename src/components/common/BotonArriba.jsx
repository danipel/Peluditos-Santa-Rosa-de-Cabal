import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import "./BotonArriba.css";

export default function BotonArriba() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alDesplazar = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", alDesplazar, { passive: true });
    alDesplazar();

    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="boton-arriba"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      <ArrowUp size={20} />
    </button>
  );
}
