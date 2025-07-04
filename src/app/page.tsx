import Image from "next/image";
import CategoryCard from "@/components/layout/CategoryCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <main className="flex flex-col items-center justify-center gap-10 w-full max-w-5xl">
        <div className="w-full flex justify-center">
          <Image
            src="/img/Zelda_Logo.png"
            alt="The Legend of Zelda Logo"
            width={400}
            height={160}
            priority
            className="max-w-full h-auto animate-pulse-subtle"
          />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-center text-yellow-500 drop-shadow-md">
          Welcome to The Legend of Zelda Universe
        </h1>

        <p className="text-lg md:text-xl text-center text-green-900 max-w-3xl">
          Explore the vast world of Hyrule with detailed information about
          monsters, materials, and more from the Breath of the Wild universe
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <CategoryCard
            href="/monsters"
            title="Monsters"
            description="Learn about the enemies you'll face across Hyrule and their valuable drops."
            bgImage="/img/monster_bg.avif"
          />

          <CategoryCard
            href="/materials"
            title="Materials"
            description="Discover materials for cooking, crafting and enhancing your adventure."
            bgImage="/img/materials_bg.avif"
          />
        </div>

        <div className="mt-8 p-6 bg-green-800/10 rounded-xl border border-green-800/20 w-full">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">
            Did You Know?
          </h2>
          <p className="text-green-900">
            The Legend of Zelda: Breath of the Wild features over 80 different
            monster types and more than 100 materials that can be combined in
            various ways to create powerful elixirs and meals to aid Link on his
            journey.
          </p>
        </div>
      </main>
    </div>
  );
}
