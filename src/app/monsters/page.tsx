"use client";
import { useState, useEffect } from "react";
import * as ApiMonsters from "@/app/api/monsters/apiMonters";
import Card from "@/components/elements/Card";
import NewButton from "@/components/forms/NewButton";

export default function Monsters() {
  const [monsters, setMonsters] = useState<ApiMonsters.Monster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const data = await ApiMonsters.getMonsters();
        setMonsters(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching monsters:", error);
        setLoading(false);
      }
    };

    fetchMonsters();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-yellow-500 drop-shadow-md">
        Monstruos
      </h1>
      <div className="flex justify-end p-4">
        <NewButton href="/monsters/new" text="Nuevo Monstruo" />
      </div>
      <Card props={monsters} />
    </div>
  );
}
