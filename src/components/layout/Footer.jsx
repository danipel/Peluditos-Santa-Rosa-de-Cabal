import { Heart, PawPrint } from "lucide-react";
import "./Footer.css";

export default function Footer({
    onInicio,
    onReportar,
    onCambiarCiudad,
}) {
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                {/* Contenido principal */}
                <div className="site-footer-grid">
                    {/* Información */}
                    <div>
                        <div className="site-footer-marca">
                            <PawPrint size={20} />
                            <span className="site-footer-marca-titulo">
                                Apoyo comunitario
                            </span>
                        </div>

                        <p className="site-footer-descripcion">
                            Un espacio para ayudar a encontrar
                            mascotas perdidas, compartir
                            avistamientos y conectar a la comunidad.
                        </p>
                    </div>

                    {/* Enlaces */}
                    <div>
                        <div className="site-footer-titulo-acciones">
                            Acciones
                        </div>

                        <div className="site-footer-acciones">
                            <button
                                onClick={onInicio}
                                className="site-footer-enlace"
                            >
                                Inicio
                            </button>

                            <button
                                onClick={onReportar}
                                className="site-footer-enlace"
                            >
                                Crear reporte
                            </button>

                            <button
                                onClick={onCambiarCiudad}
                                className="site-footer-enlace"
                            >
                                Cambiar ciudad
                            </button>
                        </div>
                    </div>
                </div>

                {/* Apoyo al desarrollo */}
                <div className="site-footer-apoyo">
                    <div className="site-footer-apoyo-inner">
                        <div className="site-footer-apoyo-columna">
                            <div className="site-footer-apoyo-titulo-fila">
                                <Heart size={16} color="#D6E0DC" />
                                <span className="site-footer-apoyo-titulo">
                                    Apoya el desarrollo
                                </span>
                            </div>

                            <p className="site-footer-apoyo-texto">
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
                <div className="site-footer-inferior">
                    <div className="site-footer-nota">
                        Hecho con amor para ayudar a la comunidad desde Santa Rosa de Cabal
                    </div>

                    <div className="site-footer-copyright">
                        © {new Date().getFullYear()} Apoyo
                    </div>
                </div>
            </div>
        </footer>
    );
}
