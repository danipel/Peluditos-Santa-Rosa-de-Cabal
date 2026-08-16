import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../common/Modal";

function FormularioReporte({ onClose, onSave, ciudades = [] }) {
  const [searchParams] = useSearchParams();

  const ciudadUrl = searchParams.get("ciudad") || "";

  const ciudadSeleccionada =
    ciudadUrl && ciudadUrl !== "Todos" ? ciudadUrl : "";

  const esTodasLasCiudades = ciudadUrl === "Todos";

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
      color: f.color,
      tamano: f.tamano,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    if (
      !form.ciudad.trim() ||
      (form.categoria === "personas" && !form.nombre.trim()) ||
      !form.sector.trim() ||
      !form.telefono.trim()
    ) {
      return;
    }

    if (form.categoria === "mascotas" && !form.color.trim()) {
      return;
    }

    setEnviando(true);

    const formConNombre = {
      ...form,
      nombre:
        form.categoria === "mascotas" && !form.nombre.trim()
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

  // ---------------------------------------------------------
  // Reporte publicado
  // ---------------------------------------------------------

  if (pinGenerado) {
    return (
      <Modal onClose={onClose} title="¡Reporte publicado!">
        <div className="texto-detalle">
          <p>
            Tu reporte ya está visible para todos. Guarda este código por si
            necesitas identificarte luego:
          </p>

          <div className="pin-mostrado">{pinGenerado}</div>

          <button onClick={onClose} className="boton-enviar">
            Entendido
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} title={"Reportar mascota"}>
      <form onSubmit={submit} className="form-columna">
        {/* -------------------------------------------------
            Ciudad
        ------------------------------------------------- */}

        <div>
          <div className="campo-etiqueta">Ciudad *</div>

          {esTodasLasCiudades ? (
            <>
              <select
                value={form.ciudad}
                onChange={(e) => set("ciudad", e.target.value)}
                className="campo-input"
                required
              >
                <option value="">Selecciona una ciudad</option>

                {ciudades.map((nombreCiudad) => (
                  <option key={nombreCiudad} value={nombreCiudad}>
                    {nombreCiudad}
                  </option>
                ))}
              </select>

              <div className="campo-helper">
                Selecciona la ciudad donde corresponde el reporte.
              </div>
            </>
          ) : (
            <>
              <input
                value={form.ciudad}
                className="campo-input campo-input-solo-lectura"
                placeholder="Ciudad"
                required
                readOnly
              />

              <div className="campo-helper">
                Ciudad seleccionada desde la búsqueda inicial.
              </div>
            </>
          )}

          {!form.ciudad && (
            <div className="campo-helper campo-helper-error">
              Debes seleccionar una ciudad antes de crear un reporte.
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
              <div className="campo-etiqueta">Tipo de reporte</div>

              <select
                value={form.estado}
                onChange={(e) => set("estado", e.target.value)}
                className="campo-input"
              >
                <option value="perdido">Perdido — busco a mi mascota</option>

                <option value="avistado">
                  Avistamiento — Lo vi pero no lo tengo conmigo
                </option>

                <option value="en_albergue">Está en el albergue temporal</option>
              </select>
            </div>

            {/* Especie / Nombre */}
            <div className="form-fila">
              <div className="form-flexible">
                <div className="campo-etiqueta">Especie</div>

                <select
                  value={form.especie}
                  onChange={(e) => set("especie", e.target.value)}
                  className="campo-input"
                >
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                </select>
              </div>

              <div className="form-flexible">
                <div className="campo-etiqueta">Nombre</div>

                <input
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  className="campo-input"
                  placeholder="Opcional"
                />

                <div className="campo-helper">
                  Si no se sabe, se usará Perro o Gato según la especie.
                </div>
              </div>
            </div>

            {/* Color / Tamaño */}
            <div className="form-fila">
              <div className="form-flexible">
                <div className="campo-etiqueta">Color *</div>

                <input
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="campo-input"
                  placeholder="Ej: Negro"
                  required
                />
              </div>

              <div className="form-flexible">
                <div className="campo-etiqueta">Tamaño</div>

                <input
                  value={form.tamano}
                  onChange={(e) => set("tamano", e.target.value)}
                  className="campo-input"
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
              <div className="campo-etiqueta">Tipo de reporte</div>

              <select
                value={form.estado}
                onChange={(e) => set("estado", e.target.value)}
                className="campo-input"
              >
                <option value="perdido">Persona desaparecida</option>

                <option value="reunido">Persona localizada</option>
              </select>
            </div>

            {/* Nombre */}
            <div>
              <div className="campo-etiqueta">Nombre completo *</div>

              <input
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                className="campo-input"
                placeholder="Nombre completo"
                required
              />
            </div>

            {/* Edad / Género */}
            <div className="form-fila">
              <div className="form-flexible">
                <div className="campo-etiqueta">Edad</div>

                <input
                  type="number"
                  min="0"
                  max="120"
                  value={form.edad}
                  onChange={(e) => set("edad", e.target.value)}
                  className="campo-input"
                  placeholder="Opcional"
                />
              </div>

              <div className="form-flexible">
                <div className="campo-etiqueta">Género</div>

                <select
                  value={form.genero}
                  onChange={(e) => set("genero", e.target.value)}
                  className="campo-input"
                >
                  <option value="">No especificado</option>

                  <option value="femenino">Femenino</option>

                  <option value="masculino">Masculino</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------
            Sector
        ------------------------------------------------- */}

        <div>
          <div className="campo-etiqueta">
            Último sector / barrio conocido *
          </div>

          <input
            value={form.sector}
            onChange={(e) => set("sector", e.target.value)}
            className="campo-input"
            placeholder="Ej: Centro, Cuba..."
            required
          />

          <div className="campo-helper">
            Indica dónde fue vista por última vez.
          </div>
        </div>

        {/* -------------------------------------------------
            Descripción
        ------------------------------------------------- */}

        <div>
          <div className="campo-etiqueta">
            Descripción / señas particulares
          </div>

          <textarea
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            className="campo-input campo-textarea-grande"
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
          <div className="campo-etiqueta">Foto</div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="campo-archivo"
          />

          <div className="campo-helper">
            Una foto clara ayuda a identificar el reporte.
          </div>
        </div>

        {/* -------------------------------------------------
            Teléfono
        ------------------------------------------------- */}

        <div>
          <div className="campo-etiqueta">
            Teléfono de contacto (WhatsApp) *
          </div>

          <input
            type="tel"
            value={form.telefono}
            onChange={(e) =>
              set("telefono", e.target.value.replace(/\D/g, ""))
            }
            className="campo-input"
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
          disabled={enviando || !form.ciudad}
          className="boton-enviar"
        >
          {enviando ? "Publicando..." : "Publicar reporte"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioReporte;
