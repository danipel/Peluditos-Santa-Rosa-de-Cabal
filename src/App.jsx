import { useState, useEffect } from "react";
import { MapPin, Phone, MessageCircle, Plus, X, Home, PawPrint, AlertCircle, Search, ArrowLeft, Loader2, Eye, LogIn, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";

const ESTADOS = {
  perdido: { label: "Perdido", color: "#B4472E", bg: "#FBE9E4" },
  en_albergue: { label: "En albergue", color: "#1F6E5C", bg: "#E1F0EA" },
  reunido: { label: "Reunido", color: "#5B5B5B", bg: "#EBEBEB" },
};

const ESPECIES = { perro: "Perro", gato: "Gato" };

export default function App() {
  const [reportes, setReportes] = useState([]);
  const [avistamientos, setAvistamientos] = useState([]);
  const [albergue, setAlbergue] = useState({ nombre: "", direccion: "", horario: "" });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAlbergueForm, setShowAlbergueForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [avistamientoDe, setAvistamientoDe] = useState(null); // reporte_id activo
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEspecie, setFiltroEspecie] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  async function cargarReportes() {
    const { data, error } = await supabase.from("reportes").select("*").order("created_at", { ascending: false });
    if (error) setError("No se pudieron cargar los reportes.");
    else setReportes(data);
  }

  async function cargarAvistamientos() {
    const { data, error } = await supabase.from("avistamientos").select("*").order("created_at", { ascending: false });
    if (!error) setAvistamientos(data);
  }

  async function cargarAlbergue() {
    const { data, error } = await supabase.from("albergue_info").select("*").eq("id", 1).single();
    if (!error && data) setAlbergue(data);
  }

  useEffect(() => {
    (async () => {
      await Promise.all([cargarReportes(), cargarAvistamientos(), cargarAlbergue()]);
      setLoading(false);
    })();

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));

    const canal = supabase
      .channel("cambios-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reportes" }, cargarReportes)
      .on("postgres_changes", { event: "*", schema: "public", table: "avistamientos" }, cargarAvistamientos)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function subirFoto(file) {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("fotos").upload(path, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("fotos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function agregarReporte(form, file) {
    setError("");
    try {
      let foto_url = null;
      if (file) foto_url = await subirFoto(file);
      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      const { error: insertError } = await supabase.from("reportes").insert({
        estado: form.estado,
        especie: form.especie,
        nombre: form.nombre || null,
        color: form.color,
        tamano: form.tamano || null,
        sector: form.sector,
        descripcion: form.descripcion || null,
        foto_url,
        telefono: form.telefono,
        pin,
      });
      if (insertError) throw insertError;
      setShowForm(false);
      await cargarReportes();
      return pin;
    } catch (e) {
      setError("No se pudo publicar el reporte: " + e.message);
      return null;
    }
  }

  async function agregarAvistamiento(reporte_id, form) {
    setError("");
    const { error } = await supabase.from("avistamientos").insert({
      reporte_id,
      sector: form.sector,
      hora: form.hora || null,
      descripcion: form.descripcion || null,
      telefono: form.telefono || null,
    });
    if (error) {
      setError("No se pudo guardar el avistamiento: " + error.message);
      return false;
    }
    setAvistamientoDe(null);
    await cargarAvistamientos();
    return true;
  }

  async function cambiarEstado(id, estado) {
    const { error } = await supabase.from("reportes").update({ estado }).eq("id", id);
    if (error) setError("No se pudo actualizar el estado.");
    else cargarReportes();
  }

  async function guardarAlbergue(info) {
    const { error } = await supabase.from("albergue_info").update(info).eq("id", 1);
    if (error) setError("No se pudo guardar (¿sigues con sesión iniciada?).");
    else {
      setAlbergue(info);
      setShowAlbergueForm(false);
    }
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    setShowLogin(false);
    return null;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  function coincidencias(reporte) {
    if (reporte.estado === "reunido") return [];
    const enSuSector = (arr) => arr.filter((x) => x.sector && x.sector.trim().toLowerCase() === reporte.sector.trim().toLowerCase());
    if (reporte.estado === "perdido") {
      const avistadosCoincidentes = enSuSector(avistamientos.filter((a) => a.reporte_id !== reporte.id));
      const enAlbergueCoincidentes = enSuSector(reportes.filter((r) => r.id !== reporte.id && r.estado === "en_albergue" && r.especie === reporte.especie));
      return [...avistadosCoincidentes, ...enAlbergueCoincidentes];
    }
    return [];
  }

  const filtrados = reportes.filter((r) => {
    if (filtroTipo !== "todos" && r.estado !== filtroTipo) return false;
    if (filtroEspecie !== "todas" && r.especie !== filtroEspecie) return false;
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      const campo = `${r.nombre || ""} ${r.color} ${r.sector} ${r.descripcion || ""}`.toLowerCase();
      if (!campo.includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F6F5F2", fontFamily: "'Inter', system-ui, sans-serif", color: "#2A2A28" }}>
      <header style={{ background: "#1F3A34", color: "#F6F5F2", padding: "18px 16px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PawPrint size={26} strokeWidth={2} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.2 }}>Mascotas Perdidas — Pereira</div>
              <div style={{ fontSize: 12.5, opacity: 0.75 }}>Reencuentro tras el sismo del 10 de agosto</div>
            </div>
          </div>
          {session ? (
            <button onClick={logout} title="Cerrar sesión admin" style={{ background: "none", border: "none", color: "#F6F5F2", opacity: 0.8, cursor: "pointer" }}>
              <LogOut size={18} />
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)} title="Acceso administrador" style={{ background: "none", border: "none", color: "#F6F5F2", opacity: 0.5, cursor: "pointer" }}>
              <LogIn size={18} />
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #DAD6CC", borderLeft: "4px solid #1F6E5C", borderRadius: 10, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Home size={18} color="#1F6E5C" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>Punto de acopio / albergue temporal</div>
              {albergue.nombre || albergue.direccion ? (
                <div style={{ fontSize: 13, color: "#4A4A47", marginTop: 2 }}>
                  {albergue.nombre && <div>{albergue.nombre}</div>}
                  {albergue.direccion && <div>{albergue.direccion}</div>}
                  {albergue.horario && <div style={{ opacity: 0.8 }}>Horario: {albergue.horario}</div>}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#8A8A85", marginTop: 2 }}>Aún no se ha registrado la ubicación</div>
              )}
            </div>
          </div>
          {session && (
            <button onClick={() => setShowAlbergueForm(true)} style={{ fontSize: 12, color: "#1F6E5C", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Editar
            </button>
          )}
        </div>

        {error && <div style={{ background: "#FBE9E4", color: "#B4472E", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 160px" }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: "#9A9A94" }} />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre, color, sector..." style={{ width: "100%", padding: "8px 10px 8px 32px", borderRadius: 8, border: "1px solid #DAD6CC", fontSize: 13.5, boxSizing: "border-box" }} />
          </div>
          <select value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #DAD6CC", fontSize: 13.5, background: "#fff" }}>
            <option value="todas">Todas las especies</option>
            <option value="perro">Perros</option>
            <option value="gato">Gatos</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {["todos", "perdido", "en_albergue", "reunido"].map((t) => (
            <button key={t} onClick={() => setFiltroTipo(t)} style={{ padding: "5px 12px", borderRadius: 999, border: "1px solid " + (filtroTipo === t ? "#1F3A34" : "#DAD6CC"), background: filtroTipo === t ? "#1F3A34" : "#fff", color: filtroTipo === t ? "#fff" : "#4A4A47", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              {t === "todos" ? "Todos" : ESTADOS[t].label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9A9A94", fontSize: 13.5, display: "flex", justifyContent: "center", gap: 6 }}>
            <Loader2 className="animate-spin" size={16} /> Cargando reportes...
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9A9A94", fontSize: 13.5 }}>No hay reportes con estos filtros todavía.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtrados.map((r) => (
              <Card
                key={r.id}
                reporte={r}
                session={session}
                avistamientos={avistamientos.filter((a) => a.reporte_id === r.id)}
                coincidencias={coincidencias(r)}
                onCambiarEstado={cambiarEstado}
                onAgregarAvistamiento={() => setAvistamientoDe(r.id)}
              />
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setShowForm(true)} style={{ position: "fixed", bottom: 20, right: 20, background: "#1F3A34", color: "#fff", border: "none", borderRadius: 999, padding: "13px 18px", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,0.25)", cursor: "pointer" }}>
        <Plus size={18} /> Reportar
      </button>

      {showForm && <FormularioReporte onClose={() => setShowForm(false)} onSave={agregarReporte} />}
      {showAlbergueForm && <FormularioAlbergue initial={albergue} onClose={() => setShowAlbergueForm(false)} onSave={guardarAlbergue} />}
      {showLogin && <FormularioLogin onClose={() => setShowLogin(false)} onLogin={login} />}
      {avistamientoDe && <FormularioAvistamiento onClose={() => setAvistamientoDe(null)} onSave={(form) => agregarAvistamiento(avistamientoDe, form)} />}
    </div>
  );
}

function Card({ reporte, session, avistamientos, coincidencias, onCambiarEstado, onAgregarAvistamiento }) {
  const estado = ESTADOS[reporte.estado] || ESTADOS.perdido;
  const tel = (reporte.telefono || "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(`Hola, escribo por el reporte de ${ESPECIES[reporte.especie].toLowerCase()} en ${reporte.sector} (Mascotas Perdidas Pereira).`);

  return (
    <div style={{ background: "#fff", border: "1px solid #DAD6CC", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 12, padding: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: 10, background: "#EFEDE6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {reporte.foto_url ? <img src={reporte.foto_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <PawPrint size={26} color="#B4AF9F" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>
              {reporte.nombre ? reporte.nombre : ESPECIES[reporte.especie]} <span style={{ fontWeight: 400, color: "#8A8A85", fontSize: 12.5 }}>{reporte.nombre ? `· ${ESPECIES[reporte.especie]}` : ""}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: estado.color, background: estado.bg, padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>{estado.label}</span>
          </div>
          <div style={{ fontSize: 13, color: "#4A4A47", marginTop: 3 }}>
            {reporte.color}
            {reporte.tamano ? ` · ${reporte.tamano}` : ""}
          </div>
          <div style={{ fontSize: 12.5, color: "#8A8A85", display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
            <MapPin size={12} /> {reporte.sector}
          </div>
          {reporte.descripcion && <div style={{ fontSize: 12.5, color: "#5B5B57", marginTop: 4 }}>{reporte.descripcion}</div>}
        </div>
      </div>

      {avistamientos.length > 0 && (
        <div style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#8A6D00", display: "flex", alignItems: "center", gap: 4 }}>
            <Eye size={12} /> {avistamientos.length} avistamiento{avistamientos.length > 1 ? "s" : ""}
          </div>
          {avistamientos.slice(0, 3).map((a) => (
            <div key={a.id} style={{ fontSize: 12, color: "#6B6B66", paddingLeft: 16 }}>
              {a.sector}
              {a.hora ? ` · ${a.hora}` : ""}
              {a.descripcion ? ` — ${a.descripcion}` : ""}
            </div>
          ))}
        </div>
      )}

      {coincidencias.length > 0 && (
        <div style={{ background: "#FAF1D6", padding: "8px 12px", fontSize: 12.5, color: "#7A5F00", display: "flex", gap: 6 }}>
          <AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
          <span>Hay actividad ({avistamientos.length ? "avistamientos" : "reportes"}) en el mismo sector — revisa si coincide.</span>
        </div>
      )}

      <div style={{ display: "flex", borderTop: "1px solid #EFEDE6" }}>
        {tel && reporte.estado !== "reunido" && (
          <>
            <a href={`tel:${tel}`} style={{ flex: 1, textAlign: "center", padding: "9px 0", fontSize: 12.5, fontWeight: 600, color: "#1F3A34", textDecoration: "none", display: "flex", justifyContent: "center", gap: 5, alignItems: "center", borderRight: "1px solid #EFEDE6" }}>
              <Phone size={13} /> Llamar
            </a>
            <a href={`https://wa.me/57${tel}?text=${waMsg}`} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", padding: "9px 0", fontSize: 12.5, fontWeight: 600, color: "#1F6E5C", textDecoration: "none", display: "flex", justifyContent: "center", gap: 5, alignItems: "center", borderRight: "1px solid #EFEDE6" }}>
              <MessageCircle size={13} /> WhatsApp
            </a>
          </>
        )}
        {reporte.estado !== "reunido" && (
          <button onClick={onAgregarAvistamiento} style={{ flex: 1.3, border: "none", background: "transparent", fontSize: 12.5, fontWeight: 600, color: "#8A6D00", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRight: "1px solid #EFEDE6" }}>
            <Eye size={13} /> + Avistamiento
          </button>
        )}
        {session && (
          <select value={reporte.estado} onChange={(e) => onCambiarEstado(reporte.id, e.target.value)} style={{ flex: 1.2, border: "none", background: "transparent", fontSize: 12.5, fontWeight: 600, color: "#4A4A47", textAlign: "center", cursor: "pointer" }}>
            {Object.entries(ESTADOS).map(([k, v]) => (
              <option key={k} value={k}>
                Marcar: {v.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function FormularioAvistamiento({ onClose, onSave }) {
  const [form, setForm] = useState({ sector: "", hora: "", descripcion: "", telefono: "" });
  const [enviando, setEnviando] = useState(false);
  const inputStyle = { width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #DAD6CC", fontSize: 13.5, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "#4A4A47" };

  async function submit(e) {
    e.preventDefault();
    if (!form.sector.trim()) return;
    setEnviando(true);
    await onSave(form);
    setEnviando(false);
  }

  return (
    <Modal onClose={onClose} title="Registrar avistamiento">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={labelStyle}>Sector donde lo viste *</div>
          <input value={form.sector} onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))} style={inputStyle} required />
        </div>
        <div>
          <div style={labelStyle}>Hora aproximada</div>
          <input value={form.hora} onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))} style={inputStyle} placeholder="Ej: hoy 3:00 p.m." />
        </div>
        <div>
          <div style={labelStyle}>Descripción del avistamiento</div>
          <textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="Hacia dónde iba, estado del animal..." />
        </div>
        <div>
          <div style={labelStyle}>Tu contacto (por si el grupo de búsqueda necesita más info)</div>
          <input value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} style={inputStyle} placeholder="Opcional" />
        </div>
        <button type="submit" disabled={enviando} style={{ background: "#8A6D00", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: enviando ? "default" : "pointer", opacity: enviando ? 0.7 : 1 }}>
          {enviando ? "Guardando..." : "Guardar avistamiento"}
        </button>
      </form>
    </Modal>
  );
}

function FormularioLogin({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [enviando, setEnviando] = useState(false);
  const inputStyle = { width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #DAD6CC", fontSize: 13.5, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "#4A4A47" };

  async function submit(e) {
    e.preventDefault();
    setEnviando(true);
    const error = await onLogin(email, password);
    setEnviando(false);
    if (error) setErr(error);
  }

  return (
    <Modal onClose={onClose} title="Acceso administrador">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {err && <div style={{ background: "#FBE9E4", color: "#B4472E", padding: "8px 10px", borderRadius: 8, fontSize: 12.5 }}>{err}</div>}
        <div>
          <div style={labelStyle}>Correo</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <div style={labelStyle}>Contraseña</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
        </div>
        <button type="submit" disabled={enviando} style={{ background: "#1F3A34", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </Modal>
  );
}

function FormularioReporte({ onClose, onSave }) {
  const [form, setForm] = useState({ estado: "perdido", especie: "perro", nombre: "", color: "", tamano: "", sector: "", descripcion: "", telefono: "" });
  const [file, setFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [pinGenerado, setPinGenerado] = useState(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.color.trim() || !form.sector.trim() || !form.telefono.trim()) return;
    setEnviando(true);
    const pin = await onSave(form, file);
    setEnviando(false);
    if (pin) setPinGenerado(pin);
  }

  const inputStyle = { width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #DAD6CC", fontSize: 13.5, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "#4A4A47" };

  if (pinGenerado) {
    return (
      <Modal onClose={onClose} title="¡Reporte publicado!">
        <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
          <p>Tu reporte ya está visible para todos. Guarda este código por si necesitas identificarte luego:</p>
          <div style={{ fontSize: 26, fontWeight: 800, textAlign: "center", letterSpacing: 4, background: "#F6F5F2", padding: "14px 0", borderRadius: 10, margin: "12px 0" }}>{pinGenerado}</div>
          <button onClick={onClose} style={{ width: "100%", background: "#1F3A34", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Entendido
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} title="Nuevo reporte">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={labelStyle}>Tipo de reporte</div>
          <select value={form.estado} onChange={(e) => set("estado", e.target.value)} style={inputStyle}>
            <option value="perdido">Perdido — busco a mi mascota</option>
            <option value="en_albergue">Está en el albergue temporal</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Especie</div>
            <select value={form.especie} onChange={(e) => set("especie", e.target.value)} style={inputStyle}>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Nombre (si se sabe)</div>
            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} style={inputStyle} placeholder="Opcional" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Color *</div>
            <input value={form.color} onChange={(e) => set("color", e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Tamaño</div>
            <input value={form.tamano} onChange={(e) => set("tamano", e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div>
          <div style={labelStyle}>Sector / barrio *</div>
          <input value={form.sector} onChange={(e) => set("sector", e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <div style={labelStyle}>Descripción / señas particulares</div>
          <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} />
        </div>
        <div>
          <div style={labelStyle}>Foto</div>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: 4, fontSize: 13 }} />
        </div>
        <div>
          <div style={labelStyle}>Teléfono de contacto (WhatsApp) *</div>
          <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} style={inputStyle} placeholder="Ej: 3001234567" required />
        </div>
        <button type="submit" disabled={enviando} style={{ background: "#1F3A34", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: enviando ? "default" : "pointer", opacity: enviando ? 0.7 : 1 }}>
          {enviando ? "Publicando..." : "Publicar reporte"}
        </button>
      </form>
    </Modal>
  );
}

function FormularioAlbergue({ initial, onClose, onSave }) {
  const [form, setForm] = useState({ nombre: initial.nombre || "", direccion: initial.direccion || "", horario: initial.horario || "" });
  const inputStyle = { width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #DAD6CC", fontSize: 13.5, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "#4A4A47" };

  return (
    <Modal onClose={onClose} title="Datos del albergue temporal">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={labelStyle}>Nombre del punto</div>
          <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>Dirección</div>
          <input value={form.direccion} onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>Horario de atención</div>
          <input value={form.horario} onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))} style={inputStyle} />
        </div>
        <button type="submit" style={{ background: "#1F3A34", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Guardar
        </button>
      </form>
    </Modal>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,18,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }} onClick={onClose}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 18 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15.5 }}>
            <ArrowLeft size={16} style={{ cursor: "pointer" }} onClick={onClose} /> {title}
          </div>
          <X size={18} style={{ cursor: "pointer", color: "#8A8A85" }} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
