"use client";

import { useState, useEffect, useCallback } from "react";
import { Vote, postVote, getVotes } from "@/app/api/websocket/apiSocket";
import { v4 as uuidv4 } from "uuid"; // Asegúrate de instalar este paquete con: npm install uuid @types/uuid

/**
 * Hook personalizado para manejar las funcionalidades de votación
 */
export const useVotes = () => {
  const [isVoting, setIsVoting] = useState(false);
  const [votingError, setVotingError] = useState<string | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);

  const getUserId = useCallback(() => {
    if (typeof window !== "undefined") {
      let userId = localStorage.getItem("user_id");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("user_id", userId);
      }
      return userId;
    }
    return uuidv4();
  }, []);

  // Función para enviar un voto
  const handleVote = useCallback(
    async (itemId: number, voteValue: number = 1) => {
      setIsVoting(true);
      setVotingError(null);

      try {
        const userId = getUserId();

        const vote: Vote = {
          id_num: itemId,
          user_id: userId,
          value: voteValue,
        };

        await postVote(vote);

        // Actualizar la lista de votos después de votar
        await fetchVotes();

        return true;
      } catch (error) {
        console.error("Error al enviar voto:", error);
        setVotingError(
          error instanceof Error ? error.message : "Error desconocido al votar"
        );
        return false;
      } finally {
        setIsVoting(false);
      }
    },
    [getUserId]
  );

  const fetchVotes = useCallback(async () => {
    setIsLoadingVotes(true);

    try {
      const votesData = await getVotes();
      console.log("Fetched votes data:", votesData);
      setVotes(votesData);
    } catch (error) {
      console.error("Error al obtener votos:", error);
      setVotingError(
        error instanceof Error
          ? error.message
          : "Error desconocido al obtener votos"
      );
    } finally {
      setIsLoadingVotes(false);
    }
  }, []);

  // Función para obtener el total de votos para un item
  const getItemVotes = useCallback(
    (itemId: number) => {
      // Buscar el objeto de voto que corresponde al itemId
      const voteItem = votes.find((vote) => vote.id_num === itemId);

      // Si encontramos el item en los datos de votos y tiene un total, devolverlo
      if (voteItem && voteItem.total !== undefined) {
        return voteItem.total;
      }

      // Si no hay información de votos para este item, devolver 0
      return 0;
    },
    [votes]
  );

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return {
    votes,
    isVoting,
    isLoadingVotes,
    votingError,
    handleVote,
    fetchVotes,
    getItemVotes,
  };
};
