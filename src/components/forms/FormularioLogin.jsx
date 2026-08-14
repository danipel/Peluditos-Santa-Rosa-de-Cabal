import { useState } from "react";
import Modal from "../common/Modal";

function FormularioLogin({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [enviando, setEnviando] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "9px 10px",
    borderRadius: 8,
    border: "1px solid #DAD6CC",
    fontSize: 13.5,
    boxSizing: "border-box",
    marginTop: 4,
  };

  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#4A4A47",
  };

  async function submit(e) {
    e.preventDefault();

    setErr("");
    setEnviando(true);

    const error = await onLogin(email, password);

    setEnviando(false);

    if (error) {
      setErr(error);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title="Acceso administrador"
    >
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {err && (
          <div
            style={{
              background: "#FBE9E4",
              color: "#B4472E",
              padding: "8px 10px",
              borderRadius: 8,
              fontSize: 12.5,
            }}
          >
            {err}
          </div>
        )}

        <div>
          <div style={labelStyle}>Correo</div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <div style={labelStyle}>Contraseña</div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            background: "#1F3A34",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 700,
            cursor: enviando ? "default" : "pointer",
            opacity: enviando ? 0.7 : 1,
          }}
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioLogin;