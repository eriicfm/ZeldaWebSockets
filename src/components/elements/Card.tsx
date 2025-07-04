"use client";

import React, { useEffect } from "react";
import { Monster, deleteMonster } from "@/app/api/monsters/apiMonters";
import { Material, deleteMaterial } from "@/app/api/materials/apiMaterials";
import { PencilIcon, Trash2Icon, Heart } from "lucide-react";
import Link from "next/link";
import { useVotes } from "@/lib/hooks/useApiSocket";

// Definimos una interfaz para las props del componente
interface CardComponentProps {
  props: Monster[] | Material[];
}

const Card: React.FC<CardComponentProps> = ({ props }) => {
  // Usar el hook de votación con funciones simplificadas
  const {
    handleVote,
    isVoting,
    votingError,
    getItemVotes,
    fetchVotes,
    votes, // Vamos a usarlo para depuración
  } = useVotes();

  // Cargar los votos cuando el componente se monta
  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {props.map((item) => {
        // Obtener el total de votos para este item directamente
        const totalVotes = getItemVotes(item.id_num);

        return (
          <div
            key={item.id_num}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col relative"
          >
            {/* Imagen del item */}
            <div className="w-full h-96">
              <img src={item.image} alt={item.name} className="w-full h-full" />
            </div>

            {/* Contenido - con padding para dejar espacio para los botones */}
            <div className="p-4 pb-20">
              <h2 className="text-lg text-black font-semibold">{item.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                {item.description}
              </p>

              <div className="space-y-1 text-xs">
                {item.common_locations && (
                  <p className="text-gray-500">
                    📍 <strong>Ubicación:</strong>{" "}
                    {item.common_locations.join(", ")}
                  </p>
                )}

                {"drops" in item && item.drops && (
                  <p className="text-red-500">
                    🧪 <strong>Drop:</strong> {item.drops.join(", ")}
                  </p>
                )}

                {"cooking_effect" in item && item.cooking_effect && (
                  <p className="text-green-500">
                    🍽 <strong>Efecto:</strong> {item.cooking_effect}
                  </p>
                )}

                {"hearts_recovered" in item && item.hearts_recovered && (
                  <p className="text-pink-500">
                    ❤️ <strong>Recupera:</strong> {item.hearts_recovered}{" "}
                    corazones
                  </p>
                )}

                <div className="flex justify-between">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                      "drops" in item
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {item.category.toUpperCase()}
                  </span>

                  {/* Mostrar total de votos */}
                  <span className="text-xs text-gray-700 flex items-center">
                    <Heart
                      size={12}
                      className="mr-1 fill-red-500 stroke-red-500"
                    />
                    {totalVotes}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de acciones - posicionada absolutamente en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-between gap-2">
              <Link
                href={
                  item.category === "monstruos"
                    ? `/monsters/edit/${item.id_num}`
                    : `/materials/edit/${item.id_num}`
                }
                className="flex-1 flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                <PencilIcon size={16} className="mr-1" />
                Editar
              </Link>
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que deseas eliminar este elemento?"
                    )
                  ) {
                    try {
                      if (item.category === "monstruos") {
                        await deleteMonster(item.id_num);
                        window.location.href = "/monsters";
                      } else {
                        await deleteMaterial(item.id_num);
                        window.location.href = "/materials";
                      }
                    } catch (error) {
                      console.error("Error al eliminar:", error);
                      alert("No se pudo eliminar el elemento");
                    }
                  }
                }}
                className="flex-1 flex justify-center items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                <Trash2Icon size={16} className="mr-1" />
                Eliminar
              </button>
              <button
                onClick={async () => {
                  if (window.confirm("¿Quieres votar por este elemento?")) {
                    try {
                      const success = await handleVote(item.id_num, 1);
                      if (success) {
                        alert("¡Voto registrado con éxito!");
                      }
                    } catch (error) {
                      console.error("Error al votar:", error);
                      alert("No se pudo votar el elemento");
                    }
                  }
                }}
                disabled={isVoting}
                className={`flex-1 flex justify-center items-center ${
                  isVoting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white py-2 px-4 rounded-md text-sm transition-colors duration-200`}
              >
                <Heart size={16} className="mr-1" />
                {isVoting ? "Votando..." : "Votar"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
