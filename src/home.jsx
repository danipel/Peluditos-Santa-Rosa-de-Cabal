import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "./supabaseClient";

import {
    Header,
    Footer,
    FormularioLogin,
    TarjetaCiudad,
} from "./components/index.js";

export default function Home() {
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    async function login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return error.message;

        setShowLogin(false);
        return null;
    }

    async function logout() {
        await supabase.auth.signOut();
        setSession(null);
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
        <div
            style={{
                minHeight: "100vh",
                background: "#F6F5F2",
                fontFamily: "'Inter', system-ui, sans-serif",
                color: "#2A2A28",
            }}
        >
            <Header
                session={session}
                onLogin={() => setShowLogin(true)}
                onLogout={logout}
            />

            {showLogin && (
                <FormularioLogin
                    onClose={() => setShowLogin(false)}
                    onLogin={login}
                />
            )}

            <main
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "60px 24px",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "32px",
                        marginBottom: "12px",
                    }}
                >
                    Selecciona un ciudad
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#777",
                        marginBottom: "40px",
                    }}
                >
                    Elige el ciudad que deseas consultar
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "28px",
                    }}
                >
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
                    onReportar={() => setShowForm(true)}
                    onCambiarCiudad={() => navigate("/home")}
                  />
            
        </div>
    );
}