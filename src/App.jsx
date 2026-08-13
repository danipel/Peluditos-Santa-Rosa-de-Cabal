import { useState } from "react";
import { useReportes } from "./hooks/useReportes";
import { useAlbergue } from "./hooks/useAlbergue";
import {
  Header,
  AlbergueBanner,
  FormularioAlbergue,
  ReportesFiltros,
  ReportesLista,
  FormularioReporte,
  BotonReportar,
} from "./components";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [showAlbergueForm, setShowAlbergueForm] = useState(false);

  const {
    filtrados,
    loading,
    error,
    filtroTipo,
    setFiltroTipo,
    filtroEspecie,
    setFiltroEspecie,
    busqueda,
    setBusqueda,
    agregarReporte,
    cambiarEstado,
    coincidencias,
  } = useReportes();

  const { albergue, albergueError, guardarAlbergue } = useAlbergue();

  const handleGuardarAlbergue = async (info) => {
    const success = await guardarAlbergue(info);
    if (success) {
      setShowAlbergueForm(false);
    }
  };

  const currentError = error || albergueError;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F5F2",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#2A2A28",
      }}
    >
      <Header />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <AlbergueBanner
          albergue={albergue}
          onEditar={() => setShowAlbergueForm(true)}
        />

        {currentError && (
          <div
            style={{
              background: "#FBE9E4",
              color: "#B4472E",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {currentError}
          </div>
        )}

        <ReportesFiltros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEspecie={filtroEspecie}
          setFiltroEspecie={setFiltroEspecie}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
        />

        <ReportesLista
          reportes={filtrados}
          loading={loading}
          coincidencias={coincidencias}
          onCambiarEstado={cambiarEstado}
        />
      </div>

      <BotonReportar onClick={() => setShowForm(true)} />

      {showForm && (
        <FormularioReporte
          onClose={() => setShowForm(false)}
          onSave={agregarReporte}
        />
      )}

      {showAlbergueForm && (
        <FormularioAlbergue
          initial={albergue}
          onClose={() => setShowAlbergueForm(false)}
          onSave={handleGuardarAlbergue}
        />
      )}
    </div>
  );
}
