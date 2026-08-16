import { useState } from "react";
import Modal from "../common/Modal";

function FormularioLogin({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [enviando, setEnviando] = useState(false);

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
    <Modal onClose={onClose} title="Acceso administrador">
      <form onSubmit={submit} className="form-columna">
        {err && <div className="alerta">{err}</div>}

        <div>
          <div className="campo-etiqueta">Correo</div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="campo-input"
            required
          />
        </div>

        <div>
          <div className="campo-etiqueta">Contraseña</div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="campo-input"
            required
          />
        </div>

        <button type="submit" disabled={enviando} className="boton-enviar">
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioLogin;
