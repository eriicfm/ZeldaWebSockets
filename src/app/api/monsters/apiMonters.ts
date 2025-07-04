const urlbase = "http://localhost:3001";
export interface Monster {
  _id: number;
  category: string;
  name: string;
  common_locations: string[];
  description: string;
  drops: string[];
  id_num: number;
  image: string;
}
// Function to get all monsters from the APi
export async function getMonsters(): Promise<Monster[]> {
  try {
    const response = await fetch(urlbase + "/monsters");

    if (!response.ok) {
      throw new Error(`Error fetching monsters: ${response.status}`);
    }

    const monsters: Monster[] = await response.json();
    return monsters;
  } catch (error) {
    console.error("Failed to fetch monsters:", error);
    throw error;
  }
}

export async function getMonstersId(id: number): Promise<Monster[]> {
  try {
    console.log("Fetching monster with ID:", id);
    const response = await fetch(`${urlbase}/monsters/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching monster: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Raw API response:", responseData);

    // Verifica si la respuesta es un array o un solo objeto
    const monsters: Monster[] = Array.isArray(responseData)
      ? responseData
      : [responseData]; // Si es un solo objeto, conviértelo en array

    console.log("Processed monster data:", monsters);
    return monsters;
  } catch (error) {
    console.error(`Failed to fetch monster with ID ${id}:`, error);
    throw error;
  }
}

// Function to post a new monster to the API
export async function postMonster(monster: Monster): Promise<void> {
  try {
    console.log("Sending to API:", JSON.stringify(monster));
    const response = await fetch(urlbase + "/monsters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monster),
    });

    if (!response.ok) {
      // Intenta obtener más información sobre el error
      let errorMessage = `Error posting monster: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch {
        // Si no hay JSON de error, ignora esta parte
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Failed to post monster:", error);
    throw error;
  }
}

export async function putMonster(id: number, monster: Monster): Promise<void> {
  try {
    const response = await fetch(urlbase + "/monsters/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monster),
    });

    if (!response.ok) {
      throw new Error(`Error updating monster: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to update monster:", error);
    throw error;
  }
}

export async function deleteMonster(id: number): Promise<void> {
  try {
    const response = await fetch(urlbase + "/monsters/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting monster: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete monster:", error);
    throw error;
  }
}
