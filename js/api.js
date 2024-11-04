export async function obtenerProductosDeApi() {
  try {
    const response = await fetch(
      "https://jsonblob.com/api/jsonblob/1293856018340372480"
    );
    if (!response.ok) {
      throw new Error("Error al obtener productos de la API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return { products: [], currency: "" };
  }
}