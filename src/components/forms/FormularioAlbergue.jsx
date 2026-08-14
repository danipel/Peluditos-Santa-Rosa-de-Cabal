import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../common/Modal";

function FormularioAlbergue({ initial, onClose, onSave }) {
    const [searchParams] = useSearchParams();
    const ciudad = searchParams.get("ciudad");

    const [form, setForm] = useState({
        nombre: initial?.nombre || "",
        direccion: initial?.direccion || "",
        horario: initial?.horario || "",
        ciudad: ciudad || "",
    });

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

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
    }

    return (
        <Modal
            onClose={onClose}
            title="Datos del albergue temporal"
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                <div>
                    <div style={labelStyle}>Nombre del punto</div>

                    <input
                        value={form.nombre}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                nombre: e.target.value,
                            }))
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>Dirección</div>

                    <input
                        value={form.direccion}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                direccion: e.target.value,
                            }))
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>Horario de atención</div>

                    <input
                        value={form.horario}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                horario: e.target.value,
                            }))
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>Ciudad</div>

                    <input
                        readOnly={true}
                        value={form.ciudad}
                        style={inputStyle}
                    />
                </div>

                <button
                    type="submit"
                    style={{
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
                    Guardar
                </button>
            </form>
        </Modal>
    );
}

export default FormularioAlbergue;