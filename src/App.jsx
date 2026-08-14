import { useState, useEffect } from "react";
import { MapPin, Phone, MessageCircle, Plus, X, Home, PawPrint, AlertCircle, Search, ArrowLeft, Loader2, Eye, LogIn, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";
import { ESTADOS, ESPECIES } from "./constants/mascotas.js";
import {
  Header,
  Card,
  VisorFoto,
  FormularioAlbergue,
  FormularioAvistamiento,
  FormularioLogin,
  FormularioReporte,
} from "./components/index.js";



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
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
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

      <Header
        session={session}
        onLogin={() => setShowLogin(true)}
        onLogout={logout}
      />

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
                onAmpliarFoto={() => setFotoAmpliada(r.foto_url)}
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
      {fotoAmpliada && <VisorFoto src={fotoAmpliada} onClose={() => setFotoAmpliada(null)} />}
    </div>
  );
}