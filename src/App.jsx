import { useState, useEffect, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  X,
  Home,
  PawPrint,
  AlertCircle,
  Search,
  ArrowLeft,
  Loader2,
  Eye,
  LogIn,
  LogOut,
} from "lucide-react";

import { supabase } from "./supabaseClient";

import {
  Header,
  Footer,
  Card,
  VisorFoto,
  BannerAyuda,
  BotonReportar,
  FormularioAlbergue,
  FormularioAvistamiento,
  FormularioLogin,
  FormularioReporte,
} from "./components/index.js";

import {
  ESTADOS,
  ESPECIES,
} from "./constants/mascotas.js";


const ciudades = [
  "Pereira",
  "Dosquebradas",
  "Santa Rosa de Cabal",
];

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filtroCategoria, setFiltroCategoria] = useState("mascotas");
  const ciudad = searchParams.get("ciudad");

  const [reportes, setReportes] = useState([]);
  const [avistamientos, setAvistamientos] = useState([]);

  const [albergues, setAlbergues] = useState([]);

  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showAlbergueForm, setShowAlbergueForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [avistamientoDe, setAvistamientoDe] = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEspecie, setFiltroEspecie] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  // ---------------------------------------------------------
  // Si entran directamente a "/" sin ciudad
  // ---------------------------------------------------------

  useEffect(() => {
    if (!ciudad) {
      navigate("/home", { replace: true });
    }
  }, [ciudad, navigate]);

  // ---------------------------------------------------------
  // Cargar reportes
  // ---------------------------------------------------------

  async function cargarReportes() {
    if (!ciudad) return;

    let query = supabase
      .from("reportes")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    // "Todos" no aplica filtro por ciudad
    if (ciudad !== "Todos") {
      query = query.eq("ciudad", ciudad);
    }

    const { data, error } = await query;

    if (error) {
      setError("No se pudieron cargar los reportes.");
      return;
    }

    setReportes(data || []);
  }

  // ---------------------------------------------------------
  // Cargar avistamientos
  // ---------------------------------------------------------

  async function cargarAvistamientos() {
    const { data, error } = await supabase
      .from("avistamientos")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setAvistamientos(data || []);
    }
  }

  // ---------------------------------------------------------
  // Cargar información del albergue
  // ---------------------------------------------------------

  async function cargarAlbergue() {
    const { data, error } = await supabase
      .from("albergue_info")
      .select("*")
      .eq("ciudad", ciudad)
      .order("id", { ascending: true });

    if (!error) {
      setAlbergues(data || []);
    }
  }

  // ---------------------------------------------------------
  // Carga inicial
  // ---------------------------------------------------------

  useEffect(() => {
    if (!ciudad) return;

    setLoading(true);

    (async () => {
      await Promise.all([
        cargarReportes(),
        cargarAvistamientos(),
        cargarAlbergue(),
      ]);

      setLoading(false);
    })();
  }, [ciudad]);

  // ---------------------------------------------------------
  // Sesión
  // ---------------------------------------------------------

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      });

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------
  // Realtime
  // ---------------------------------------------------------

  useEffect(() => {
    if (!ciudad) return;

    const canal = supabase
      .channel(`cambios-realtime-${ciudad}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reportes",
        },
        () => {
          cargarReportes();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "avistamientos",
        },
        () => {
          cargarAvistamientos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [ciudad]);

  // ---------------------------------------------------------
  // Subir foto
  // ---------------------------------------------------------

  async function subirFoto(file) {
    const ext = file.name.split(".").pop();

    const path = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("fotos")
      .upload(path, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("fotos")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  // ---------------------------------------------------------
  // Agregar reporte
  // ---------------------------------------------------------

  async function agregarReporte(form, file) {
    setError("");

    if (!ciudad) {
      setError(
        "No se pudo determinar el ciudad del reporte."
      );

      return null;
    }

    try {
      let foto_url = null;

      if (file) {
        foto_url = await subirFoto(file);
      }

      const pin = Math.floor(
        1000 + Math.random() * 9000
      ).toString();

      const { error: insertError } = await supabase
        .from("reportes")
        .insert({
          ciudad: form.ciudad,
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

      if (insertError) {
        throw insertError;
      }

      setShowForm(false);

      await cargarReportes();

      return pin;
    } catch (e) {
      setError(
        "No se pudo publicar el reporte: " +
        e.message
      );

      return null;
    }
  }

  // ---------------------------------------------------------
  // Agregar avistamiento
  // ---------------------------------------------------------

  async function agregarAvistamiento(
    reporte_id,
    form
  ) {
    setError("");

    const { error } = await supabase
      .from("avistamientos")
      .insert({
        reporte_id,
        sector: form.sector,
        hora: form.hora || null,
        descripcion:
          form.descripcion || null,
        telefono:
          form.telefono || null,
      });

    if (error) {
      setError(
        "No se pudo guardar el avistamiento: " +
        error.message
      );

      return false;
    }

    setAvistamientoDe(null);

    await cargarAvistamientos();

    return true;
  }

  // ---------------------------------------------------------
  // Cambiar estado
  // ---------------------------------------------------------

  async function cambiarEstado(id, estado) {
    const { error } = await supabase
      .from("reportes")
      .update({ estado })
      .eq("id", id);

    if (error) {
      setError(
        "No se pudo actualizar el estado."
      );
    } else {
      await cargarReportes();
    }
  }

  // ---------------------------------------------------------
  // Borrar reporte (solo admin)
  // ---------------------------------------------------------

  async function borrarReporte(id) {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este reporte? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    const { error: avistamientosError } = await supabase
      .from("avistamientos")
      .delete()
      .eq("reporte_id", id);

    if (avistamientosError) {
      setError(
        "No se pudo eliminar el reporte."
      );
      return;
    }

    const { data, error } = await supabase
      .from("reportes")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      setError(
        "No se pudo eliminar el reporte."
      );
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "No se pudo eliminar: falta la política RLS de DELETE en Supabase."
      );
      return;
    }

    await cargarReportes();
    await cargarAvistamientos();
  }

  // ---------------------------------------------------------
  // Guardar información del albergue
  // ---------------------------------------------------------

  async function guardarAlbergue(info) {
    const { error } = await supabase
      .from("albergue_info")
      .update(info)
      .eq("id", 1);

    if (error) {
      setError(
        "No se pudo guardar (¿sigues con sesión iniciada?)."
      );
    } else {
      await cargarAlbergue();
      setShowAlbergueForm(false);
    }
  }

  // ---------------------------------------------------------
  // Login
  // ---------------------------------------------------------

  async function login(email, password) {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return error.message;
    }

    setShowLogin(false);

    return null;
  }

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------

  async function logout() {
    await supabase.auth.signOut();
  }

  // ---------------------------------------------------------
  // Coincidencias
  // ---------------------------------------------------------

  function coincidencias(reporte) {
    if (reporte.estado === "reunido") {
      return [];
    }

    const enSuSector = (arr) =>
      arr.filter(
        (x) =>
          x.sector &&
          reporte.sector &&
          x.sector
            .trim()
            .toLowerCase() ===
          reporte.sector
            .trim()
            .toLowerCase()
      );

    if (reporte.estado === "perdido") {
      const avistadosCoincidentes =
        enSuSector(
          avistamientos.filter(
            (a) =>
              a.reporte_id !==
              reporte.id
          )
        );

      const enAlbergueCoincidentes =
        enSuSector(
          reportes.filter(
            (r) =>
              r.id !== reporte.id &&
              r.estado ===
              "en_albergue" &&
              r.especie ===
              reporte.especie
          )
        );

      return [
        ...avistadosCoincidentes,
        ...enAlbergueCoincidentes,
      ];
    }

    return [];
  }

  // ---------------------------------------------------------
  // Filtros
  // ---------------------------------------------------------

  const cumpleFiltrosBase = (r) => {
    // Categoría
    if (
      filtroCategoria === "mascotas" &&
      r.especie === "persona"
    ) {
      return false;
    }

    if (
      filtroCategoria === "personas" &&
      r.especie !== "persona"
    ) {
      return false;
    }

    // Especie
    if (
      filtroCategoria === "mascotas" &&
      filtroEspecie !== "todas" &&
      r.especie !== filtroEspecie
    ) {
      return false;
    }

    // Búsqueda
    if (busqueda.trim()) {
      const q = busqueda
        .trim()
        .toLowerCase();

      const campo =
        `${r.nombre || ""}`.toLowerCase();

      if (!campo.includes(q)) {
        return false;
      }
    }

    return true;
  };

  const filtrados = reportes.filter((r) => {
    if (!cumpleFiltrosBase(r)) {
      return false;
    }

    // Estado
    if (
      filtroTipo !== "todos" &&
      r.estado !== filtroTipo
    ) {
      return false;
    }

    return true;
  });

  const conteos = useMemo(() => {
    const resultado = { todos: 0 };

    Object.keys(ESTADOS).forEach((estado) => {
      resultado[estado] = 0;
    });

    reportes.forEach((r) => {
      if (!cumpleFiltrosBase(r)) {
        return;
      }

      resultado.todos += 1;

      if (resultado[r.estado] !== undefined) {
        resultado[r.estado] += 1;
      }
    });

    return resultado;
  }, [reportes, filtroCategoria, filtroEspecie, busqueda]);

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F5F2",
        fontFamily:
          "'Inter', system-ui, sans-serif",
        color: "#2A2A28",
      }}
    >
      <style>{`
        .reportes-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .reportes-grid {
            grid-template-columns: repeat(3, 1fr);
            align-items: stretch;
          }
        }
      `}</style>

      <Header
        session={session}
        onLogin={() => setShowLogin(true)}
        onLogout={logout}
      />

      {showLogin && (
        <FormularioLogin
          onClose={() =>
            setShowLogin(false)
          }
          onLogin={login}
        />
      )}

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: 16,
        }}
      >
        {/* Encabezado ciudad */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
              }}
            >
              Reportes de {ciudad}
            </h1>

            <div
              style={{
                color: "#777",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Reportes de mascotas
              perdidas y encontradas
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/home")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "8px 12px",
              borderRadius: 8,
              border:
                "1px solid #DAD6CC",
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              whiteSpace:
                "nowrap",
            }}
          >
            <ArrowLeft
              size={15}
            />

            Cambiar ciudad
          </button>
        </div>

        {/* Albergues */}

        <div style={{ marginBottom: 16 }}>
          {albergues.length === 0 && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #DAD6CC",
                borderLeft: "4px solid #1F6E5C",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <Home
                  size={18}
                  color="#1F6E5C"
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                    Punto de acopio / albergue temporal
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#8A8A85",
                      marginTop: 2,
                    }}
                  >
                    Aún no se ha registrado la ubicación
                  </div>
                </div>
              </div>
            </div>
          )}

          {albergues.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid #DAD6CC",
                borderLeft: "4px solid #1F6E5C",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <Home
                  size={18}
                  color="#1F6E5C"
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {a.nombre || "Punto de acopio / albergue temporal"}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#4A4A47",
                      marginTop: 2,
                    }}
                  >
                    {a.direccion && <div>{a.direccion}</div>}
                    {a.horario && (
                      <div style={{ opacity: 0.8 }}>
                        Horario: {a.horario}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {session && (
            <button
              onClick={() => setShowAlbergueForm(true)}
              style={{
                fontSize: 12,
                color: "#1F6E5C",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Editar
            </button>
          )}
        </div>

        {/* Error */}

        {error && (
          <div
            style={{
              background: "#FBE9E4",
              color: "#B4472E",
              padding:
                "8px 12px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {/* Buscador */}

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Buscador */}

          <div
            style={{
              position: "relative",
              width: 400,
            }}
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                color: "#9A9A94",
              }}
            />

            <input
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar..."
              style={{
                width: "100%",
                padding:
                  "8px 10px 8px 32px",
                borderRadius: 8,
                border:
                  "1px solid #DAD6CC",
                fontSize: 13.5,
                boxSizing: "border-box",
                background: "#fff",
              }}
            />
          </div>

          {/* Mascotas */}

          <button
            onClick={() => {
              setFiltroCategoria("mascotas");
              setFiltroEspecie("todas");
              setFiltroTipo("todos");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "8px 12px",
              borderRadius: 8,
              border:
                filtroCategoria === "mascotas"
                  ? "1px solid #1F3A34"
                  : "1px solid #DAD6CC",
              background:
                filtroCategoria === "mascotas"
                  ? "#1F3A34"
                  : "#fff",
              color:
                filtroCategoria === "mascotas"
                  ? "#fff"
                  : "#4A4A47",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <PawPrint size={"16px"} />  Mascotas
          </button>



          {filtroCategoria === "mascotas" && (
            <select
              value={filtroEspecie}
              onChange={(e) =>
                setFiltroEspecie(e.target.value)
              }
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border:
                  "1px solid #DAD6CC",
                fontSize: 13.5,
                background: "#fff",
              }}
            >
              <option value="todas">
                Todas las mascotas
              </option>

              <option value="perro">
                Perros
              </option>

              <option value="gato">
                Gatos
              </option>
            </select>
          )}
        </div>

        {/* Filtro estado */}

        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {[
            "todos",
            ...Object.keys(ESTADOS),
          ].map((t) => (
            <button
              key={t}
              onClick={() =>
                setFiltroTipo(t)
              }
              style={{
                padding:
                  "5px 12px",
                borderRadius: 999,
                border:
                  "1px solid " +
                  (filtroTipo ===
                    t
                    ? "#1F3A34"
                    : "#DAD6CC"),
                background:
                  filtroTipo ===
                    t
                    ? "#1F3A34"
                    : "#fff",
                color:
                  filtroTipo ===
                    t
                    ? "#fff"
                    : "#4A4A47",
                fontSize: 12.5,
                fontWeight: 600,
                cursor:
                  "pointer",
              }}
            >
              {t === "todos"
                ? `${conteos.todos} Todos`
                : `${conteos[t]} ${ESTADOS[t].label}`}
            </button>
          ))}
        </div>

        {/* Reportes */}

        <BannerAyuda />

        {loading ? (
          <div
            style={{
              textAlign:
                "center",
              padding: 40,
              color: "#9A9A94",
              fontSize: 13.5,
              display:
                "flex",
              justifyContent:
                "center",
              gap: 6,
            }}
          >
            <Loader2
              className="animate-spin"
              size={16}
            />

            Cargando reportes...
          </div>
        ) : filtrados.length === 0 ? (
          <div
            style={{
              textAlign:
                "center",
              padding: 40,
              color: "#9A9A94",
              fontSize: 13.5,
            }}
          >
            No hay reportes con
            estos filtros
            todavía.
          </div>
        ) : (
          <div className="reportes-grid">
            {filtrados.map(
              (r) => (
                <Card
                  key={r.id}
                  reporte={r}
                  session={
                    session
                  }
                  avistamientos={avistamientos.filter(
                    (
                      a
                    ) =>
                      a.reporte_id ===
                      r.id
                  )}
                  coincidencias={coincidencias(
                    r
                  )}
                  onCambiarEstado={
                    cambiarEstado
                  }
                  onBorrar={
                    borrarReporte
                  }
                  onAgregarAvistamiento={() =>
                    setAvistamientoDe(
                      r.id
                    )
                  }
                  onAmpliarFoto={() =>
                    setFotoAmpliada(
                      r.foto_url
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Botón reportar */}

      <BotonReportar
        onClick={() => setShowForm(true)}
      />


      <Footer
        onInicio={() => navigate("/home")}
        onReportar={() => setShowForm(true)}
        onCambiarCiudad={() => navigate("/home")}
      />

      {/* Modales */}

      {
        showForm && (
          <FormularioReporte
            onClose={() =>
              setShowForm(false)
            }
            onSave={agregarReporte}
            ciudades={ciudades}
          />
        )
      }

      {
        showAlbergueForm && (
          <FormularioAlbergue
            initial={albergues[0]}
            onClose={() =>
              setShowAlbergueForm(
                false
              )
            }
            onSave={guardarAlbergue}
          />
        )
      }

      {
        showLogin && (
          <FormularioLogin
            onClose={() =>
              setShowLogin(false)
            }
            onLogin={login}
          />
        )
      }

      {
        avistamientoDe && (
          <FormularioAvistamiento
            onClose={() =>
              setAvistamientoDe(
                null
              )
            }
            onSave={(form) =>
              agregarAvistamiento(
                avistamientoDe,
                form
              )
            }
          />
        )
      }

      {
        fotoAmpliada && (
          <VisorFoto
            src={fotoAmpliada}
            onClose={() =>
              setFotoAmpliada(
                null
              )
            }
          />
        )
      }
    </div >

  );
}