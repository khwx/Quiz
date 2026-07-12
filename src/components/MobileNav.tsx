"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid3X3, Gamepad2, Trophy, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/categories", icon: Grid3X3, label: "Categorias" },
  { href: "/play", icon: Gamepad2, label: "Jogar" },
  { href: "/leaderboard", icon: Trophy, label: "Ranking" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden" aria-label="Navegação principal">
      <div className="mx-3 mb-3">
        <div className="flex justify-around items-center px-1 py-2 bg-[#1e1e30]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="relative flex flex-col items-center justify-center p-2 min-w-[52px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-[#d0bcff]/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative z-10 flex flex-col items-center gap-0.5 ${
                    isActive ? "text-[#d0bcff]" : "text-[#e3e0f9]/40"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? "drop-shadow-[0_0_8px_rgba(208,188,255,0.6)]" : ""
                    }`}
                  />
                  <span className="text-[8px] uppercase tracking-wider font-bold">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
