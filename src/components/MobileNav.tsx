"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tv, Gamepad2, Globe, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Tv, label: "Home" },
  { href: "/categories", icon: Globe, label: "Categorias" },
  { href: "/play", icon: Gamepad2, label: "Jogar" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center px-4 py-3 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-colors ${
                isActive ? "text-pink-500" : "text-white/50"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "text-pink-500" : ""}`} />
              <span className="text-[10px] uppercase tracking-widest font-bold mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
