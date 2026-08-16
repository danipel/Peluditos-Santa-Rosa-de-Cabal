import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Header,
    Footer,
    FormularioLogin,
    TarjetaCiudad,
} from "./components/index.js";

import { useSession } from "./hooks/useSession";

import "./home.css";

export default function Home() {
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const { session, login, logout } = useSession();

    async function handleLogin(email, password) {
        const error = await login(email, password);
        if (error) return error;

        setShowLogin(false);
        return null;
    }

    const tarjetas = [
        {
            titulo: "Pereira",
            url: "Pereira",
            imagen: "/images/pereira.jpg",
        },
        {
            titulo: "Dosquebradas",
            url: "Dosquebradas",
            imagen: "/images/dosquebradas.jpg",
        },
        {
            titulo: "Santa Rosa de Cabal",
            url: "Sta Rosa",
            imagen: "/images/santa-rosa.jpg",
        },
        {
            titulo: "Todos",
            url: "Todos",
            imagen: "/images/todos.png",
        },
    ];

    function seleccionarCiudad(ciudad) {
        navigate(
            `/?ciudad=${encodeURIComponent(ciudad)}`
        );
    }

    return (
        <div className="pagina">
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

                <div className="home-grid">
                    {tarjetas.map((tarjeta) => (
                        <TarjetaCiudad
                            key={tarjeta.titulo}
                            titulo={tarjeta.titulo}
                            imagen={tarjeta.imagen}
                            onClick={() =>
                                seleccionarCiudad(
                                    tarjeta.url
                                )
                            }
                        />
                    ))}
                </div>
            </main>

            <Footer
                onInicio={() => navigate("/home")}
                onReportar={() => navigate("/?ciudad=Todos")}
                onCambiarCiudad={() => navigate("/home")}
            />
        </div>
    );
}
