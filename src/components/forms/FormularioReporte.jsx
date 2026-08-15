import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../common/Modal";

function FormularioReporte({
  onClose,
  onSave,
  ciudades = [],
}) {
  const [searchParams] = useSearchParams();

  const ciudadUrl =
    searchParams.get("ciudad") || "";

  const ciudadSeleccionada =
    ciudadUrl && ciudadUrl !== "Todos"
      ? ciudadUrl
      : "";

  const esTodasLasCiudades =
    ciudadUrl === "Todos";

  const [form, setForm] = useState({
    ciudad: ciudadSeleccionada,

    // Categoría principal
    categoria: "mascotas",

    // Estado
    estado: "perdido",

    // Mascotas
    especie: "perro",
    nombre: "",
    color: "",
    tamano: "",

    // Común
    sector: "",
    descripcion: "",
    telefono: "",
  });

  const [file, setFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [pinGenerado, setPinGenerado] = useState(null);

  function set(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

  function cambiarCategoria(categoria) {
    setForm((f) => ({
      ...f,
      categoria,
      especie: "perro",
      estado: "perdido",
      color:f.color,
      tamano:f.tamano,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    if (
      !form.ciudad.trim() ||
      (form.categoria === "personas" &&
        !form.nombre.trim()) ||
      !form.sector.trim() ||
      !form.telefono.trim()
    ) {
      return;
    }

    if (
      form.categoria === "mascotas" &&
      !form.color.trim()
    ) {
      return;
    }

    setEnviando(true);

    const formConNombre = {
      ...form,
      nombre:
        form.categoria === "mascotas" &&
        !form.nombre.trim()
          ? form.especie === "gato"
            ? "Gato"
            : "Perro"
          : form.nombre,
    };

    const pin = await onSave(formConNombre, file);

    setEnviando(false);

    if (pin) {
      setPinGenerado(pin);
    }
  }

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

  const helperStyle = {
    fontSize: 11.5,
    color: "#777",
    marginTop: 4,
  };

  // ---------------------------------------------------------
  // Reporte publicado
  // ---------------------------------------------------------

  if (pinGenerado) {
    return (
      <Modal
        onClose={onClose}
        title="¡Reporte publicado!"
      >
        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          <p>
            Tu reporte ya está visible para todos.
            Guarda este código por si necesitas
            identificarte luego:
          </p>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: 4,
              background: "#F6F5F2",
              padding: "14px 0",
              borderRadius: 10,
              margin: "12px 0",
            }}
          >
            {pinGenerado}
          </div>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: "#1F3A34",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Entendido
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      onClose={onClose}
      title={"Reportar mascota"
      }
    >
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* -------------------------------------------------
            Ciudad
        ------------------------------------------------- */}

        <div>
          <div style={labelStyle}>
            Ciudad *
          </div>

          {esTodasLasCiudades ? (
            <>
              <select
                value={form.ciudad}
                onChange={(e) =>
                  set(
                    "ciudad",
                    e.target.value
                  )
                }
                style={inputStyle}
                required
              >
                <option value="">
                  Selecciona una ciudad
                </option>

                {ciudades.map((nombreCiudad) => (
                  <option
                    key={nombreCiudad}
                    value={nombreCiudad}
                  >
                    {nombreCiudad}
                  </option>
                ))}
              </select>

              <div style={helperStyle}>
                Selecciona la ciudad donde
                corresponde el reporte.
              </div>
            </>
          ) : (
            <>
              <input
                value={form.ciudad}
                style={{
                  ...inputStyle,
                  background: "#F6F5F2",
                }}
                placeholder="Ciudad"
                required
                readOnly
              />

              <div style={helperStyle}>
                Ciudad seleccionada desde la
                búsqueda inicial.
              </div>
            </>
          )}

          {!form.ciudad && (
            <div
              style={{
                ...helperStyle,
                color: "#B4472E",
              }}
            >
              Debes seleccionar una ciudad
              antes de crear un reporte.
            </div>
          )}
        </div>

        {/* =================================================
            MASCOTAS
        ================================================= */}

        {form.categoria === "mascotas" && (
          <>
            {/* Tipo de reporte */}

            <div>
              <div style={labelStyle}>
                Tipo de reporte
              </div>

              <select
                value={form.estado}
                onChange={(e) =>
                  set(
                    "estado",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="perdido">
                  Perdido — busco a mi mascota
                </option>

                <option value="avistado">
                  Avistamiento — Lo vi pero no lo tengo conmigo
                </option>

                <option value="en_albergue">
                  Está en el albergue temporal
                </option>
              </select>
            </div>

            {/* Especie / Nombre */}

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>
                  Especie
                </div>

                <select
                  value={form.especie}
                  onChange={(e) =>
                    set(
                      "especie",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="perro">
                    Perro
                  </option>

                  <option value="gato">
                    Gato
                  </option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <div style={labelStyle}>
                  Nombre
                </div>

                <input
                  value={form.nombre}
                  onChange={(e) =>
                    set(
                      "nombre",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                  placeholder="Opcional"
                />

                <div style={helperStyle}>
                  Si no se sabe, se usará
                  Perro o Gato según la especie.
                </div>
              </div>
            </div>

            {/* Color / Tamaño */}

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>
                  Color *
                </div>

                <input
                  value={form.color}
                  onChange={(e) =>
                    set(
                      "color",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                  placeholder="Ej: Negro"
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={labelStyle}>
                  Tamaño
                </div>

                <input
                  value={form.tamano}
                  onChange={(e) =>
                    set(
                      "tamano",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                  placeholder="Ej: Mediano"
                />
              </div>
            </div>
          </>
        )}

        {/* =================================================
            PERSONAS
        ================================================= */}

        {form.categoria === "personas" && (
          <>
            {/* Tipo de reporte */}

            <div>
              <div style={labelStyle}>
                Tipo de reporte
              </div>

              <select
                value={form.estado}
                onChange={(e) =>
                  set(
                    "estado",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="perdido">
                  Persona desaparecida
                </option>

                <option value="reunido">
                  Persona localizada
                </option>
              </select>
            </div>

            {/* Nombre */}

            <div>
              <div style={labelStyle}>
                Nombre completo *
              </div>

              <input
                value={form.nombre}
                onChange={(e) =>
                  set(
                    "nombre",
                    e.target.value
                  )
                }
                style={inputStyle}
                placeholder="Nombre completo"
                required
              />
            </div>

            {/* Edad / Género */}

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>
                  Edad
                </div>

                <input
                  type="number"
                  min="0"
                  max="120"
                  value={form.edad}
                  onChange={(e) =>
                    set(
                      "edad",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                  placeholder="Opcional"
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={labelStyle}>
                  Género
                </div>

                <select
                  value={form.genero}
                  onChange={(e) =>
                    set(
                      "genero",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="">
                    No especificado
                  </option>

                  <option value="femenino">
                    Femenino
                  </option>

                  <option value="masculino">
                    Masculino
                  </option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------
            Sector
        ------------------------------------------------- */}

        <div>
          <div style={labelStyle}>
            Último sector / barrio conocido *
          </div>

          <input
            value={form.sector}
            onChange={(e) =>
              set("sector", e.target.value)
            }
            style={inputStyle}
            placeholder="Ej: Centro, Cuba..."
            required
          />

          <div style={helperStyle}>
            Indica dónde fue vista por última vez.
          </div>
        </div>

        {/* -------------------------------------------------
            Descripción
        ------------------------------------------------- */}

        <div>
          <div style={labelStyle}>
            Descripción / señas particulares
          </div>

          <textarea
            value={form.descripcion}
            onChange={(e) =>
              set(
                "descripcion",
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              minHeight: 70,
              resize: "vertical",
            }}
            placeholder={
              form.categoria === "personas"
                ? "Ropa que llevaba, características particulares, información relevante..."
                : "Collar, manchas, comportamiento, características particulares..."
            }
          />
        </div>

        {/* -------------------------------------------------
            Foto
        ------------------------------------------------- */}

        <div>
          <div style={labelStyle}>
            Foto
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(
                e.target.files[0] || null
              )
            }
            style={{
              marginTop: 4,
              fontSize: 13,
            }}
          />

          <div style={helperStyle}>
            Una foto clara ayuda a identificar
            el reporte.
          </div>
        </div>

        {/* -------------------------------------------------
            Teléfono
        ------------------------------------------------- */}

        <div>
          <div style={labelStyle}>
            Teléfono de contacto (WhatsApp) *
          </div>

          <input
            type="tel"
            value={form.telefono}
            onChange={(e) =>
              set(
                "telefono",
                e.target.value.replace(/\D/g, "")
              )
            }
            style={inputStyle}
            placeholder="Ej: 3001234567"
            inputMode="tel"
            pattern="[0-9]*"
            required
          />
        </div>

        {/* -------------------------------------------------
            Botón
        ------------------------------------------------- */}

        <button
          type="submit"
          disabled={
            enviando ||
            !form.ciudad
          }
          style={{
            background: "#1F3A34",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 700,
            cursor:
              enviando ||
              !form.ciudad
                ? "default"
                : "pointer",
            opacity:
              enviando ||
              !form.ciudad
                ? 0.7
                : 1,
          }}
        >
          {enviando
            ? "Publicando..."
            : "Publicar reporte"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioReporte;