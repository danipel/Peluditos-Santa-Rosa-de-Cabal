import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
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
  BotonArriba,
  CtaReportar,
  FormularioAlbergue,
  FormularioAvistamiento,
  FormularioLogin,
  FormularioReporte,
  JsonLd,
} from "./components/index.js";

import { ESTADOS, ESPECIES } from "./constants/mascotas.js";
import {
  CIUDADES,
  ciudadPorSlug,
  slugDeCiudad,
} from "./constants/ciudades.js";
import { useSession } from "./hooks/useSession";
import { useReportes } from "./hooks/useReportes";
import { useAlbergue } from "./hooks/useAlbergue";

import "./App.css";

const SITE_URL = import.meta.env.VITE_SITE_URL || "";

const REGISTROS_POR_PAGINA = 14;

function obtenerPaginas(total, actual) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const paginas = new Set([1, total, actual - 1, actual, actual + 1]);
  return Array.from(paginas)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
    .reduce((acc, p) => {
      if (acc.length && p - acc[acc.length - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);
}

export default function App() {
  const navigate = useNavigate();
  const { ciudad: ciudadSlug } = useParams();
  const location = useLocation();
  const ciudadInfo = ciudadPorSlug(ciudadSlug);
  const ciudad = ciudadInfo ? ciudadInfo.valor : null;
  const ciudadNombre = ciudadInfo ? ciudadInfo.nombre : "";

  const [showForm, setShowForm] = useState(false);
  const [showAlbergueForm, setShowAlbergueForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [avistamientoDe, setAvistamientoDe] = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [pagina, setPagina] = useState(1);

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
    conteosPorEspecie,
    coincidencias,
    agregarReporte,
    agregarAvistamiento,
    cambiarEstado,
    borrarReporte,
  } = useReportes(ciudad);

  const { albergues, guardarAlbergue } = useAlbergue(ciudad);

  // ---------------------------------------------------------
  // Paginación
  // ---------------------------------------------------------

  useEffect(() => {
    setPagina(1);
  }, [ciudad, filtroCategoria, filtroEspecie, filtroTipo, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / REGISTROS_POR_PAGINA)
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + REGISTROS_POR_PAGINA);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [paginaActual]);

  // ---------------------------------------------------------
  // Si entran directamente a una ruta sin ciudad válida
  // ---------------------------------------------------------

  useEffect(() => {
    if (!ciudad) {
      navigate("/home", { replace: true });
    }
  }, [ciudad, navigate]);

  // ---------------------------------------------------------
  // Auto-apertura del formulario vía estado de navegación (CTA de Home)
  // ---------------------------------------------------------

  useEffect(() => {
    if (location.state?.reportar) {
      setShowForm(true);
      navigate(".", { replace: true, state: null });
    }
  }, [location, navigate]);

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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Mascotas reportadas en ${ciudadNombre || "Risaralda"}`,
          numberOfItems: filtrados.length,
          itemListElement: filtrados.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: r.nombre || ESPECIES[r.especie] || r.especie,
            image: r.foto_url || undefined,
            url: `${SITE_URL}/${slugDeCiudad(
              ciudad || ""
            )}#reporte-${r.id}`,
          })),
        }}
      />

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
              Reportes de {ciudadNombre}
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
          <>
            <div className="reportes-grid">
              {visibles.map((r) => (
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

            {totalPaginas > 1 && (
              <nav
                className="app-paginacion"
                aria-label="Paginación de reportes"
              >
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="app-paginacion-boton"
                >
                  Anterior
                </button>

                {obtenerPaginas(totalPaginas, paginaActual).map((p, i) =>
                  p === "..." ? (
                    <span key={`sep-${i}`} className="app-paginacion-sep">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`app-paginacion-numero ${
                        p === paginaActual
                          ? "app-paginacion-numero--activo"
                          : ""
                      }`}
                      aria-current={
                        p === paginaActual ? "page" : undefined
                      }
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={paginaActual === totalPaginas}
                  className="app-paginacion-boton"
                >
                  Siguiente
                </button>
              </nav>
            )}
          </>
        )}

        {/* Resumen (TL;DR) y tablas de posicionamiento */}

        {!loading && (
          <section className="app-resumen">
            <h2 className="app-resumen-titulo">
              Resumen en {ciudadNombre}
            </h2>

            <p className="app-resumen-texto">
              Hay <strong>{conteos.todos}</strong> reportes activos:{" "}
              <strong>{conteos.perdido}</strong> perdidos,{" "}
              <strong>{conteos.avistado}</strong> avistados,{" "}
              <strong>{conteos.en_albergue}</strong> en hogar de paso y{" "}
              <strong>{conteos.reunido}</strong> reunidos.
            </p>

            <table className="app-tabla-resumen">
              <caption>
                Mascotas por estado en {ciudadNombre}
              </caption>

              <thead>
                <tr>
                  <th scope="col">Estado</th>
                  <th scope="col">Cantidad</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th scope="row">Perdidos</th>
                  <td>{conteos.perdido}</td>
                </tr>

                <tr>
                  <th scope="row">Avistados</th>
                  <td>{conteos.avistado}</td>
                </tr>

                <tr>
                  <th scope="row">En hogar de paso</th>
                  <td>{conteos.en_albergue}</td>
                </tr>

                <tr>
                  <th scope="row">Reunidos</th>
                  <td>{conteos.reunido}</td>
                </tr>
              </tbody>
            </table>

            <table className="app-tabla-resumen">
              <caption>
                Mascotas por especie en {ciudadNombre}
              </caption>

              <thead>
                <tr>
                  <th scope="col">Especie</th>
                  <th scope="col">Cantidad</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th scope="row">{ESPECIES.perro}</th>
                  <td>{conteosPorEspecie.perro || 0}</td>
                </tr>

                <tr>
                  <th scope="row">{ESPECIES.gato}</th>
                  <td>{conteosPorEspecie.gato || 0}</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* CTA de conversión */}

        {!loading && (
          <CtaReportar
            titulo="¿Tu mascota está perdida?"
            texto="Repórtala ahora y compártela para que la comunidad ayude a encontrarla."
            etiquetaBoton="Reportar mascota"
            onReportar={() => setShowForm(true)}
          />
        )}
      </div>

      {/* Botón reportar */}

      <BotonReportar onClick={() => setShowForm(true)} />

      <BotonCompartir />

      <BotonArriba />

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
          ciudades={CIUDADES}
          ciudadActual={ciudad}
        />
      )}

      {showAlbergueForm && (
        <FormularioAlbergue
          initial={albergues[0]}
          onClose={() => setShowAlbergueForm(false)}
          onSave={handleGuardarAlbergue}
          ciudad={ciudad}
          ciudadEtiqueta={ciudadNombre}
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
