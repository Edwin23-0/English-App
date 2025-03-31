export const fetchWord = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/palabra");
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener palabra:", error);
        return null;
    }
};
