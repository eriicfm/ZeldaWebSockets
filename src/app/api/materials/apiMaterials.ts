const urlbase = "http://localhost:3001";
export interface Material {
  id_num: number;
  name: string;
  category: "materiales";
  common_locations?: string[];
  description: string;
  cooking_effect?: string;
  hearts_recovered?: number;
  image: string;
}
// Function to get all monsters from the APi
export async function getMaterials(): Promise<Material[]> {
  try {
    const response = await fetch(urlbase + "/materials");

    if (!response.ok) {
      throw new Error(`Error fetching monsters: ${response.status}`);
    }

    const materials: Material[] = await response.json();
    return materials;
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    throw error;
  }
}

export async function getMaterialsId(id: number): Promise<Material[]> {
  try {
    console.log("Fetching material with ID:", id);
    const response = await fetch(`${urlbase}/materials/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching material: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Raw API response:", responseData);

    // Verifica si la respuesta es un array o un solo objeto
    const materials: Material[] = Array.isArray(responseData)
      ? responseData
      : [responseData]; // Si es un solo objeto, conviértelo en array

    console.log("Processed material data:", materials);
    return materials;
  } catch (error) {
    console.error(`Failed to fetch material with ID ${id}:`, error);
    throw error;
  }
}

// Function to post a new monster to the API
export async function postMaterial(material: Material): Promise<void> {
  try {
    console.log("Sending to API:", JSON.stringify(material));
    const response = await fetch(urlbase + "/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });

    if (!response.ok) {
      throw new Error(`Error posting monster: ${response.status}`);
    }

    console.log("Material posted successfully!");
  } catch (error) {
    console.error("Failed to post material:", error);
    throw error;
  }
}

// Function to update a monster in the API
export async function putMaterial(
  id: number,
  material: Material
): Promise<void> {
  try {
    console.log("Sending to API:", JSON.stringify(material));
    const response = await fetch(`${urlbase}/materials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });

    if (!response.ok) {
      throw new Error(`Error updating material: ${response.status}`);
    }

    console.log("Material updated successfully!");
  } catch (error) {
    console.error("Failed to update material:", error);
    throw error;
  }
}

// Function to delete a monster from the API
export async function deleteMaterial(id: number): Promise<void> {
  try {
    const response = await fetch(`${urlbase}/materials/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting material: ${response.status}`);
    }

    console.log("Material deleted successfully!");
  } catch (error) {
    console.error("Failed to delete material:", error);
    throw error;
  }
}
