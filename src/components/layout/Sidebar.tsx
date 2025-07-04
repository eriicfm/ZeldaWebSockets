"use client";

import { Home, Package } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const sidebarItems = [
  { icon: Home, href: "/", label: "Home" },
  {
    icon: ({ className }: { className?: string }) => (
      <Image
        src="/img/monsters.png"
        alt="Monsters"
        width={24}
        height={24}
        className={className}
      />
    ),
    href: "/monsters",
    label: "Monsters",
  },
  { icon: Package, href: "/materials", label: "Materials" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-16 flex flex-col items-center bg-[#00532e] shadow-lg py-4 space-y-6 z-30">
      <nav className="flex flex-col space-y-6">
        {sidebarItems.map(({ icon: Icon, href, label }) => (
          <Link key={href} href={href} className="group relative">
            <div className="p-2 rounded-full hover:bg-white/20 transition duration-200">
              <Icon
                className={cn(
                  "w-6 h-6 text-white transition duration-200 group-hover:text-gray-300",
                  pathname === href && "text-yellow-400"
                )}
              />
            </div>
          </Link>
        ))}
        <div className="absolute bottom-4 left-2">
          <img src="/img/logo_sidebar.png" alt="Logo" className="w-12 h-12" />
        </div>
      </nav>
    </aside>
  );
}
