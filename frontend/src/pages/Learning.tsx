import { useState, useEffect } from "react";
import axios from "axios";

const USER_ID = 1; // Cambiar según el usuario logueado

type Palabra = {
  respuesta_id: number;
  palabra_id: number;
  imagen_url: string;
  palabra_en: string;
  palabra_es: string;
};

const Learning = () => {
  const [palabra, setPalabra] = useState<Palabra | null>(null);
  const [mostrarPalabra, setMostrarPalabra] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarPalabra = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/palabras/pendientes/${USER_ID}`);
      
      if (res.data.length === 0) {
        setPalabra(null);
      } else {
        setPalabra(res.data[0]); // Tomamos la primera palabra pendiente
      }
  
      setMostrarPalabra(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPalabra(null); // No hay palabras pendientes
      } else {
        console.error("❌ Error cargando palabra:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    cargarPalabra();
  }, []);

  const enviarRespuesta = async (dificultad: "fácil" | "medio" | "difícil") => {
    if (!palabra) return;

    try {
      await axios.post("http://localhost:5000/actualizar_repeticion", {
        palabra_id: palabra.palabra_id,
        usuario_id: USER_ID,
        dificultad: dificultad,
      });
      cargarPalabra();
    } catch (error) {
      console.error("❌ Error al actualizar dificultad:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">⏳ Cargando palabra...</div>;
  }

  if (!palabra) {
    return (
      <div className="text-center mt-10 text-xl">
        🎉 No hay palabras pendientes por ahora
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full text-center">
        <img
          src={palabra.imagen_url}
          alt="imagen palabra"
          className="w-full h-64 object-cover rounded-xl mb-4"
        />

        {!mostrarPalabra && (
          <button
            onClick={() => setMostrarPalabra(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition"
          >
            Revelar palabra
          </button>
        )}

        {mostrarPalabra && (
          <div>
            <h2 className="text-2xl font-bold mt-2">{palabra.palabra_en}</h2>
            <p className="text-lg text-gray-600">{palabra.palabra_es}</p>

            <div className="mt-4 space-x-2">
              <button
                onClick={() => enviarRespuesta("fácil")}
                className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-full"
              >
                Fácil
              </button>
              <button
                onClick={() => enviarRespuesta("medio")}
                className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full"
              >
                Medio
              </button>
              <button
                onClick={() => enviarRespuesta("difícil")}
                className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-full"
              >
                Difícil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
