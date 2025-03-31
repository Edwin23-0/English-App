const API_URL = "http://localhost:5000"; // Ajusta si es necesario

export const getWords = async () => {
  try {
    const response = await fetch(`${API_URL}/palabra`);
    if (!response.ok) throw new Error("Error al obtener las palabras");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
