import "./TarjetaCiudad.css";

export default function TarjetaCiudad({
    imagen,
    titulo,
    onClick,
}) {
    return (
        <div
            onClick={onClick}
            className="tarjeta-ciudad"
        >
            <img
                src={imagen}
                alt={titulo}
                className="tarjeta-ciudad-imagen"
            />

            <div className="tarjeta-ciudad-overlay" />

            <div className="tarjeta-ciudad-contenido">
                <h2>{titulo}</h2>
            </div>
        </div>
    );
}