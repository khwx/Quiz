"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Rocket, Code, Share2, ExternalLink, Shield, Heart } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const SOCIAL_LINKS = [
  { icon: "💬", label: "Discord Hub", href: "#" },
  { icon: "🐦", label: "X (Twitter)", href: "#" },
  { icon: "📷", label: "Instagram", href: "#" },
];

const LICENSES = [
  { name: "Next.js", license: "MIT License" },
  { name: "React", license: "MIT License" },
  { name: "Tailwind CSS", license: "MIT License" },
  { name: "Framer Motion", license: "MIT License" },
  { name: "Lucide Icons", license: "ISC License" },
  { name: "Space Grotesk", license: "OFL License" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-32">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-primary/8 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-secondary/8 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-on-surface">Sobre</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto p-6 flex flex-col items-center">
        {/* Logo & Version */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-tertiary to-primary mb-4 shadow-[0_0_40px_rgba(208,188,255,0.3)]"
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-4xl font-black text-on-surface mb-1">QuizVerse</h2>
          <p className="text-sm text-secondary tracking-widest uppercase font-bold">v2.4.1 &apos;Nebula Explorer&apos;</p>
          <p className="text-on-surface/50 mt-3 max-w-sm mx-auto">
            Explora as fronteiras do conhecimento numa jornada intergaláctica através do vazio.
          </p>
        </motion.section>

        <div className="w-full space-y-4">
          {/* Development Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Desenvolvimento</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-on-surface/40 uppercase tracking-wider mb-1">Arquitetura</p>
                <p className="font-bold text-on-surface">Next.js + Supabase</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-on-surface/40 uppercase tracking-wider mb-1">Design</p>
                <p className="font-bold text-on-surface">Google Stitch AI</p>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-5 hover:border-secondary/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-bold text-on-surface">Comunidade</h3>
            </div>
            <div className="space-y-1">
              {SOCIAL_LINKS.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-on-surface group-hover:text-primary transition-colors">{link.label}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-on-surface/30 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Open Source Licenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-tertiary" />
              <h3 className="text-lg font-bold text-on-surface">Licenças Open Source</h3>
            </div>
            <div className="space-y-2">
              {LICENSES.map((lib, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-on-surface">{lib.name}</span>
                  <span className="text-sm text-on-surface/40">{lib.license}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Legal Footer */}
          <footer className="text-center pt-4 pb-8">
            <p className="text-sm text-on-surface/30">© 2026 QuizVerse. Feito com <Heart className="w-3 h-3 inline text-secondary" /> em Portugal</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="text-sm text-primary hover:underline">Privacidade</a>
              <a href="#" className="text-sm text-primary hover:underline">Termos de Uso</a>
            </div>
          </footer>
        </div>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
