import { useState } from "react";
import Modal from "../common/Modal";

function FormularioAlbergue({
    initial,
    onClose,
    onSave,
    ciudad = "",
    ciudadEtiqueta = "",
}) {
    const [form, setForm] = useState({
        nombre: initial?.nombre || "",
        direccion: initial?.direccion || "",
        horario: initial?.horario || "",
        ciudad: ciudad || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
    }

    return (
        <Modal
            onClose={onClose}
            title="Datos del albergue temporal"
        >
            <form onSubmit={handleSubmit} className="form-columna">
                <div>
                    <div className="campo-etiqueta">Nombre del punto</div>

                    <input
                        value={form.nombre}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                nombre: e.target.value,
                            }))
                        }
                        className="campo-input"
                    />
                </div>

                <div>
                    <div className="campo-etiqueta">Dirección</div>

                    <input
                        value={form.direccion}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                direccion: e.target.value,
                            }))
                        }
                        className="campo-input"
                    />
                </div>

                <div>
                    <div className="campo-etiqueta">Horario de atención</div>

                    <input
                        value={form.horario}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                horario: e.target.value,
                            }))
                        }
                        className="campo-input"
                    />
                </div>

                <div>
                    <div className="campo-etiqueta">Ciudad</div>

                    <input
                        readOnly={true}
                        value={ciudadEtiqueta || form.ciudad}
                        className="campo-input"
                    />
                </div>

                <button type="submit" className="boton-enviar">
                    Guardar
                </button>
            </form>
        </Modal>
    );
}

export default FormularioAlbergue;
