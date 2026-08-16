import { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Home,
  PawPrint,
  Search,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  Header,
  Footer,
  Card,
  VisorFoto,
  BannerAyuda,
  BotonReportar,
  BotonCompartir,
  FormularioAlbergue,
  FormularioAvistamiento,
  FormularioLogin,
  FormularioReporte,
} from "./components/index.js";

import { ESTADOS } from "./constants/mascotas.js";
import { useSession } from "./hooks/useSession";
import { useReportes } from "./hooks/useReportes";
import { useAlbergue } from "./hooks/useAlbergue";

import "./App.css";

const ciudades = [
  "Pereira",
  "Dosquebradas",
  "Santa Rosa de Cabal",
];

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ciudad = searchParams.get("ciudad");

  const [showForm, setShowForm] = useState(false);
  const [showAlbergueForm, setShowAlbergueForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [avistamientoDe, setAvistamientoDe] = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  const { session, login, logout } = useSession();

  const {
    reportes,
    avistamientos,
    loading,
    error,
    setError,
    filtroCategoria,
    setFiltroCategoria,
    filtroTipo,
    setFiltroTipo,
    filtroEspecie,
    setFiltroEspecie,
    busqueda,
    setBusqueda,
    filtrados,
    conteos,
    coincidencias,
    agregarReporte,
    agregarAvistamiento,
    cambiarEstado,
    borrarReporte,
  } = useReportes(ciudad);

  const { albergues, guardarAlbergue } = useAlbergue(ciudad);

  // ---------------------------------------------------------
  // Si entran directamente a "/" sin ciudad
  // ---------------------------------------------------------

  useEffect(() => {
    if (!ciudad) {
      navigate("/home", { replace: true });
    }
  }, [ciudad, navigate]);

  // ---------------------------------------------------------
  // Acciones que combinan lógica del hook con estado de UI
  // ---------------------------------------------------------

  const handleLogin = async (email, password) => {
    const error = await login(email, password);
    if (error) return error;

    setShowLogin(false);
    return null;
  };

  const handleGuardarReporte = async (form, file) => {
    const pin = await agregarReporte(form, file);
    if (pin) setShowForm(false);
    return pin;
  };

  const handleAgregarAvistamiento = async (reporte_id, form) => {
    const ok = await agregarAvistamiento(reporte_id, form);
    if (ok) setAvistamientoDe(null);
    return ok;
  };

  const handleGuardarAlbergue = async (info) => {
    const ok = await guardarAlbergue(info);
    if (ok) {
      setShowAlbergueForm(false);
    } else {
      setError("No se pudo guardar (¿sigues con sesión iniciada?).");
    }
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="pagina">
      <Header
        session={session}
        onLogin={() => setShowLogin(true)}
        onLogout={logout}
      />

      <div className="app-contenedor">
        {/* Encabezado ciudad */}

        <div className="app-encabezado">
          <div>
            <h1 className="app-titulo">
              Reportes de {ciudad}
            </h1>

            <div className="app-subtitulo">
              Reportes de mascotas
              perdidas y encontradas
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="app-boton-cambiar"
          >
            <ArrowLeft size={15} />

            Cambiar ciudad
          </button>
        </div>

        {/* Albergues */}

        <div className="app-albergues">
          {albergues.length === 0 && (
            <div className="app-albergue">
              <div className="app-albergue-contenido">
                <Home
                  size={18}
                  color="#1F6E5C"
                  className="app-albergue-icono"
                />
                <div>
                  <div className="app-albergue-titulo">
                    Punto de acopio / albergue temporal
                  </div>
                  <div className="app-albergue-vacio">
                    Aún no se ha registrado la ubicación
                  </div>
                </div>
              </div>
            </div>
          )}

          {albergues.map((a) => (
            <div
              key={a.id}
              className="app-albergue app-albergue--lista"
            >
              <div className="app-albergue-contenido">
                <Home
                  size={18}
                  color="#1F6E5C"
                  className="app-albergue-icono"
                />
                <div>
                  <div className="app-albergue-titulo">
                    {a.nombre || "Punto de acopio / albergue temporal"}
                  </div>
                  <div className="app-albergue-datos">
                    {a.direccion && <div>{a.direccion}</div>}
                    {a.horario && (
                      <div className="app-albergue-horario">
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
              className="app-albergue-editar"
            >
              Editar
            </button>
          )}
        </div>

        {/* Error */}

        {error && (
          <div className="alerta app-error">
            {error}
          </div>
        )}

        {/* Buscador */}

        <div className="app-buscador-fila">
          <div className="app-buscador">
            <Search size={15} className="app-buscador-icono" />

            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="app-buscador-input"
            />
          </div>

          <button
            onClick={() => {
              setFiltroCategoria("mascotas");
              setFiltroEspecie("todas");
              setFiltroTipo("todos");
            }}
            className={`app-boton-filtro ${
              filtroCategoria === "mascotas"
                ? "app-boton-filtro--activo"
                : ""
            }`}
          >
            <PawPrint size={"16px"} /> Mascotas
          </button>

          {filtroCategoria === "mascotas" && (
            <select
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="app-select"
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

        <div className="app-filtros-estado">
          {["todos", ...Object.keys(ESTADOS)].map((t) => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className={`app-boton-estado ${
                filtroTipo === t ? "app-boton-estado--activo" : ""
              }`}
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
          <div className="app-estado app-estado--cargando">
            <Loader2 className="animate-spin" size={16} />

            Cargando reportes...
          </div>
        ) : filtrados.length === 0 ? (
          <div className="app-estado">
            No hay reportes con
            estos filtros
            todavía.
          </div>
        ) : (
          <div className="reportes-grid">
            {filtrados.map((r) => (
              <Card
                key={r.id}
                reporte={r}
                session={session}
                avistamientos={avistamientos.filter(
                  (a) => a.reporte_id === r.id
                )}
                coincidencias={coincidencias(r)}
                onCambiarEstado={cambiarEstado}
                onBorrar={borrarReporte}
                onAgregarAvistamiento={() => setAvistamientoDe(r.id)}
                onAmpliarFoto={() => setFotoAmpliada(r.foto_url)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botón reportar */}

      <BotonReportar onClick={() => setShowForm(true)} />

      <BotonCompartir />

      <Footer
        onInicio={() => navigate("/home")}
        onReportar={() => setShowForm(true)}
        onCambiarCiudad={() => navigate("/home")}
      />

      {/* Modales */}

      {showForm && (
        <FormularioReporte
          onClose={() => setShowForm(false)}
          onSave={handleGuardarReporte}
          ciudades={ciudades}
        />
      )}

      {showAlbergueForm && (
        <FormularioAlbergue
          initial={albergues[0]}
          onClose={() => setShowAlbergueForm(false)}
          onSave={handleGuardarAlbergue}
        />
      )}

      {showLogin && (
        <FormularioLogin
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {avistamientoDe && (
        <FormularioAvistamiento
          onClose={() => setAvistamientoDe(null)}
          onSave={(form) => handleAgregarAvistamiento(avistamientoDe, form)}
        />
      )}

      {fotoAmpliada && (
        <VisorFoto
          src={fotoAmpliada}
          onClose={() => setFotoAmpliada(null)}
        />
      )}
    </div>
  );
}
