import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Header,
    Footer,
    FormularioLogin,
    TarjetaCiudad,
    JsonLd,
    BotonArriba,
    CtaReportar,
} from "./components/index.js";

import { useSession } from "./hooks/useSession";
import { fetchConteosGlobales } from "./services/reportesService";

import "./home.css";

const SITE_URL = import.meta.env.VITE_SITE_URL || "";

export default function Home() {
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [conteosGlobales, setConteosGlobales] = useState(null);
    const { session, login, logout } = useSession();

    useEffect(() => {
        fetchConteosGlobales()
            .then(setConteosGlobales)
            .catch(() => {});
    }, []);

    async function handleLogin(email, password) {
        const error = await login(email, password);
        if (error) return error;

        setShowLogin(false);
        return null;
    }

    const tarjetas = [
        {
            titulo: "Pereira",
            slug: "pereira",
            imagen: "/images/pereira.jpg",
        },
        {
            titulo: "Dosquebradas",
            slug: "dosquebradas",
            imagen: "/images/dosquebradas.jpg",
        },
        {
            titulo: "Santa Rosa de Cabal",
            slug: "santa-rosa-de-cabal",
            imagen: "/images/santa-rosa.jpg",
        },
        {
            titulo: "Todos",
            slug: "todos",
            imagen: "/images/todos.png",
        },
    ];

    function seleccionarCiudad(slug) {
        navigate(`/${slug}`);
    }

    return (
        <div className="pagina">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: "Ciudades con reportes de mascotas perdidas",
                    itemListElement: tarjetas.map((t, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        name: t.titulo,
                        url: `${SITE_URL}/${t.slug}`,
                    })),
                }}
            />

            <Header
                session={session}
                onLogin={() => setShowLogin(true)}
                onLogout={logout}
            />

            {showLogin && (
                <FormularioLogin
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                />
            )}

            <main className="home-main">
                <h1 className="home-titulo">
                    Selecciona un ciudad
                </h1>

                <p className="home-subtitulo">
                    Elige el ciudad que deseas consultar
                </p>

                <CtaReportar
                    titulo="¿Perdiste a tu mascota?"
                    texto="Publícala gratis y la comunidad de Risaralda te ayudará a encontrarla."
                    etiquetaBoton="Reportar mascota"
                    onReportar={() =>
                        navigate("/todos", {
                            state: { reportar: true },
                        })
                    }
                    onVerReportes={() => navigate("/todos")}
                />

                <p className="home-resumen">
                    {conteosGlobales ? (
                        <>
                            Ya hay{" "}
                            <strong>{conteosGlobales.total}</strong> reportes en
                            Risaralda:{" "}
                            <strong>
                                {conteosGlobales.porEspecie.perro || 0}
                            </strong>{" "}
                            perros y{" "}
                            <strong>
                                {conteosGlobales.porEspecie.gato || 0}
                            </strong>{" "}
                            gatos. Elige tu ciudad para ayudar a reunirlos.
                        </>
                    ) : (
                        "Ayuda a reencontrar mascotas perdidas en Pereira, Dosquebradas y Santa Rosa de Cabal."
                    )}
                </p>

                <ul className="home-grid">
                    {tarjetas.map((tarjeta) => (
                        <li
                            key={tarjeta.titulo}
                            className="home-grid-item"
                        >
                            <TarjetaCiudad
                                titulo={tarjeta.titulo}
                                imagen={tarjeta.imagen}
                                onClick={() =>
                                    seleccionarCiudad(
                                        tarjeta.slug
                                    )
                                }
                            />
                        </li>
                    ))}
                </ul>
            </main>

            <Footer
                onInicio={() => navigate("/home")}
                onReportar={() => navigate("/todos")}
                onCambiarCiudad={() => navigate("/home")}
            />

            <BotonArriba />
        </div>
    );
}
