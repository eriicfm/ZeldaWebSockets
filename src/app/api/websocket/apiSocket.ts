const urlbase = "http://localhost:3001";

export interface Vote {
  id_num: number;
  user_id: string;
  value: number;
  total?: number;
}

// Metodo para hacer un voto con post
export async function postVote(vote: Vote): Promise<Vote> {
  try {
    console.log("Sending vote to API:", JSON.stringify(vote));
    const response = await fetch(urlbase + "/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vote),
    });

    if (!response.ok) {
      // Intentar obtener detalles del error
      let errorMessage = `Error posting vote: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch {
        // Si no se puede obtener JSON de error, usar mensaje básico
      }
      throw new Error(errorMessage);
    }

    // Devolver el voto creado/actualizado
    const createdVote = await response.json();
    return createdVote;
  } catch (error) {
    console.error("Failed to post vote:", error);
    throw error;
  }
}

export async function getVotes(): Promise<Vote[]> {
  try {
    const response = await fetch(urlbase + "/votes");
    if (!response.ok) {
      throw new Error(`Error fetching votes: ${response.status}`);
    }
    const data = await response.json();
    console.log("Received votes data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch votes:", error);
    throw error;
  }
}
