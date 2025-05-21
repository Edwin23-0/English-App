import { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Learning.css";


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
  const [loading, setLoading] = useState(false);

  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [cantidadTotal, setCantidadTotal] = useState<number | null>(null);
  const [cantidadMostrar, setCantidadMostrar] = useState<number | null>(null);
  const [contador, setContador] = useState(0);

  // Nuevos estados
  const [listaPalabras, setListaPalabras] = useState<Palabra[]>([]);
  const [todasCompletadas, setTodasCompletadas] = useState(true); // Controla botón "50 (Todas)"
  const [reiniciarPaso2, setReiniciarPaso2] = useState(0);

  


  // Verifica si el usuario ya vio todas las palabras alguna vez
  const verificarCompletadas = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/palabras/completadas/${USER_ID}`);
      setTodasCompletadas(res.data.completado);
    } catch (error) {
      console.error("❌ Error al verificar completadas:", error);
    }
  };

  useEffect(() => {
    if (paso === 2) {
      verificarCompletadas();
    }
  }, [paso]);
  

  // Carga palabras: usa ruta de todas o pendientes según cantidadMostrar
  const cargarPalabras = async () => {
    setLoading(true);
    try {
  let res;

  if (cantidadMostrar === -1) {
    // Traer todas las palabras sin filtrar
    res = await axios.get(`http://localhost:5000/palabras/todas/${USER_ID}`);
    setCantidadMostrar(res.data.length); // Establece la cantidad total
  } else {
    // Traer solo pendientes según repetición
    res = await axios.get(`http://localhost:5000/palabras/pendientes/${USER_ID}`, {
      params: {
        limite: cantidadTotal ?? 50,  // Total a seleccionar del backend
        ver: cantidadMostrar ?? 10,   // Cantidad de palabras a mostrar al usuario
      },
    });
  }
      const palabrasObtenidas: Palabra[] = res.data;
      setListaPalabras(palabrasObtenidas);

      if (palabrasObtenidas.length === 0) {
        setPalabra(null);
      } else {
        setPalabra(palabrasObtenidas[0]);
      }

      setContador(0);
      setMostrarPalabra(false);
    } catch (error: any) {
      console.error("❌ Error cargando palabras:", error);
      setPalabra(null);
    } finally {
      setLoading(false);
    }
  };

  // Dispara carga al pasar al paso 3
  useEffect(() => {
    if (paso === 3) cargarPalabras();
  }, [paso]);

  // Actualiza palabra mostrada al cambiar contador
  useEffect(() => {
    if (contador < listaPalabras.length) {
      setPalabra(listaPalabras[contador]);
      setMostrarPalabra(false);
    } else {
      setPalabra(null);
    }
  }, [contador]);

  const enviarRespuesta = async (dificultad: "fácil" | "medio" | "difícil") => {
    if (!palabra) return;
    try {
      await axios.post("http://localhost:5000/actualizar_repeticion", {
        palabra_id: palabra.palabra_id,
        usuario_id: USER_ID,
        dificultad,
      });
      setContador((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error al actualizar dificultad:", error);
    }
  };

  // ------------------ RENDERS ------------------

 if (paso === 1) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">¿Cuántas palabras deseas aprender hoy?</h2>
        <div className="space-x-2">
          <button onClick={() => { setCantidadTotal(50); setPaso(2); }} className="bg-blue-500 text-white px-4 py-2 rounded-full">50</button>
          <button onClick={() => { setCantidadTotal(100); setPaso(2); }} className="bg-blue-500 text-white px-4 py-2 rounded-full">100</button>
          <button onClick={() => { setCantidadTotal(200); setPaso(2); }} className="bg-blue-500 text-white px-4 py-2 rounded-full">200</button>
        </div>
      </div>
    </div>
  );
}


  if (paso === 2) {
    return (
      <div key={reiniciarPaso2} className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
        <h2 className="text-2xl font-bold mb-4">¿Cuántas palabras deseas ver en esta sesión?</h2>
        <div className="space-x-2">
          <button onClick={() => { setCantidadMostrar(10); setPaso(3); }} className="bg-green-500 text-white px-4 py-2 rounded-full">10</button>
          <button onClick={() => { setCantidadMostrar(25); setPaso(3); }} className="bg-green-500 text-white px-4 py-2 rounded-full">25</button>
          <button
            onClick={() => { setCantidadMostrar(-1); setPaso(3); }}
            className={`px-4 py-2 rounded-full text-white ${todasCompletadas ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!todasCompletadas}
          >
            50 (Todas)
          </button>
        </div>
        {!todasCompletadas && (
          <p className="text-sm text-red-600 mt-3">
            Recuerda que debes completar tus palabras actuales antes de elegir "50 (Todas)".
          </p>
        )}
      </div>
    );
  }
  

  if (loading) return (
  <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
    ⏳ Cargando palabra...
  </div>
);

  if (!palabra) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-green-50">
        <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 ¡Felicidades!</h2>
        <p className="text-lg text-gray-700">Has repasado todas las palabras por ahora. Vuelve más tarde para seguir practicando.</p>
<button 
  onClick={() => {
    setListaPalabras([]);
    setContador(0);
    setReiniciarPaso2(prev => prev + 1);
    setPaso(2);
  }} 
  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
>
  Volver al inicio
</button>


      </div>
    );
  }

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4">
    <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full text-center">
      <p className="text-sm text-gray-500 mb-2">
        Palabra {contador + 1} de {cantidadMostrar}
      </p>
      <img src={palabra.imagen_url} alt="imagen palabra" className="image" />
{!mostrarPalabra ? (
  <button onClick={() => setMostrarPalabra(true)} className="revealButton">
    Revelar palabra
  </button>
) : (
  <div>
    <h2 className="text-2xl font-bold mt-2">{palabra.palabra_en}</h2>
    <p className="text-lg text-gray-600">{palabra.palabra_es}</p>

            <div className="mt-4 space-x-2">
              <button onClick={() => enviarRespuesta("fácil")} className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-full">Fácil</button>
              <button onClick={() => enviarRespuesta("medio")} className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full">Medio</button>
              <button onClick={() => enviarRespuesta("difícil")} className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-full">Difícil</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Learning;
