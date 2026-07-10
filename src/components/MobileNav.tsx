"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid3X3, Gamepad2, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/categories", icon: Grid3X3, label: "Categorias" },
  { href: "/play", icon: Gamepad2, label: "Jogar" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden">
      <div className="mx-4 mb-4">
        <div className="flex justify-around items-center px-2 py-2 bg-surface-container/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center p-3 min-w-[60px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative z-10 flex flex-col items-center gap-1 ${
                    isActive ? "text-primary" : "text-on-surface-variant/60"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(208,188,255,0.6)]" : ""}`} />
                  <span className="text-[9px] uppercase tracking-wider font-bold">
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
