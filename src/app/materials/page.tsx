"use client";
import { useState, useEffect } from "react";
import * as ApiMaterials from "@/app/api/materials/apiMaterials";
import Card from "@/components/elements/Card";
import NewButton from "@/components/forms/NewButton";

export default function Materials() {
  const [materials, setMaterials] = useState<ApiMaterials.Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await ApiMaterials.getMaterials();
        setMaterials(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching materials:", error);
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">Cargando materiales...</p>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center text-yellow-500 drop-shadow-md">
            Materiales
          </h1>
          <div className="flex justify-end p-4">
            <NewButton href="/materials/new" text="Nuevo Material" />
          </div>
          <Card props={materials} />
        </div>
      )}
    </>
  );
}
