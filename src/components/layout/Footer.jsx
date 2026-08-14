import {
    Heart,
    PawPrint,
    ExternalLink,
} from "lucide-react";

export default function Footer({
    onInicio,
    onReportar,
    onCambiarCiudad,
}) {
    return (
        <footer
            style={{
                marginTop: 40,
                background: "#1F3A34",
                color: "#FFFFFF",
                padding: "32px 16px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: 720,
                    margin: "0 auto",
                }}
            >
                {/* Contenido principal */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "minmax(0, 1.5fr) minmax(140px, 1fr)",
                        gap: 32,
                        paddingBottom: 28,
                    }}
                >
                    {/* Información */}

                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 10,
                            }}
                        >
                            <PawPrint size={20} />

                            <span
                                style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                }}
                            >
                                Apoyo comunitario
                            </span>
                        </div>

                        <p
                            style={{
                                margin: 0,
                                color: "#D6E0DC",
                                fontSize: 13.5,
                                lineHeight: 1.6,
                                maxWidth: 420,
                            }}
                        >
                            Un espacio para ayudar a encontrar
                            mascotas perdidas, compartir
                            avistamientos y conectar a la comunidad.
                        </p>
                    </div>

                    {/* Enlaces */}

                    <div>
                        <div
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                color: "#AFC5BE",
                                marginBottom: 10,
                            }}
                        >
                            Acciones
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            <button
                                onClick={onInicio}
                                style={{
                                    padding: 0,
                                    border: "none",
                                    background: "none",
                                    color: "#FFFFFF",
                                    textAlign: "left",
                                    fontSize: 13,
                                    cursor: "pointer",
                                }}
                            >
                                Inicio
                            </button>

                            <button
                                onClick={onReportar}
                                style={{
                                    padding: 0,
                                    border: "none",
                                    background: "none",
                                    color: "#FFFFFF",
                                    textAlign: "left",
                                    fontSize: 13,
                                    cursor: "pointer",
                                }}
                            >
                                Crear reporte
                            </button>

                            <button
                                onClick={onCambiarCiudad}
                                style={{
                                    padding: 0,
                                    border: "none",
                                    background: "none",
                                    color: "#FFFFFF",
                                    textAlign: "left",
                                    fontSize: 13,
                                    cursor: "pointer",
                                }}
                            >
                                Cambiar ciudad
                            </button>
                        </div>
                    </div>
                </div>

                {/* Apoyo al desarrollo */}

                <div
                    style={{
                        borderTop:
                            "1px solid rgba(255,255,255,0.12)",
                        borderBottom:
                            "1px solid rgba(255,255,255,0.12)",
                        padding: "22px 0",
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 20,
                            flexWrap: "wrap",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                minWidth: 240,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 7,
                                    marginBottom: 7,
                                }}
                            >
                                <Heart
                                    size={16}
                                    color="#D6E0DC"
                                />

                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                    }}
                                >
                                    Apoya el desarrollo
                                </span>
                            </div>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#C3D2CD",
                                    fontSize: 12.5,
                                    lineHeight: 1.6,
                                }}
                            >
                                Este proyecto es desarrollado y
                                mantenido de forma independiente.
                                Si quieres contribuir a que siga
                                creciendo, puedes apoyar su
                                desarrollo mediante una Llave de Bre-b  3174958556.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Parte inferior */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            color: "#AFC5BE",
                            fontSize: 12,
                        }}
                    >
                        Hecho con amor para ayudar a la comunidad desde Santa Rosa de Cabal
                    </div>

                    <div
                        style={{
                            color: "#8FA9A1",
                            fontSize: 11.5,
                        }}
                    >
                        © {new Date().getFullYear()} Apoyo
                    </div>
                </div>
            </div>
        </footer>
    );
}
