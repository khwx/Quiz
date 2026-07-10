"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Settings, Gamepad2, Palette, Volume2, RotateCcw } from "lucide-react";

type Difficulty = "Recruta" | "Piloto" | "Comandante";
type Theme = "nebula" | "blackhole" | "supernova";

export default function SettingsPage() {
  const [timer, setTimer] = useState(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("Recruta");
  const [theme, setTheme] = useState<Theme>("nebula");
  const [particles, setParticles] = useState(true);
  const [volume, setVolume] = useState(75);
  const [haptics, setHaptics] = useState(true);

  const themes: { id: Theme; name: string; gradient: string }[] = [
    { id: "nebula", name: "Nebulosa Rosa", gradient: "from-pink-500/30 to-purple-600/30" },
    { id: "blackhole", name: "Buraco Negro", gradient: "from-orange-500/30 to-red-600/30" },
    { id: "supernova", name: "Supernova", gradient: "from-blue-400/30 to-yellow-400/30" },
  ];

  return (
    <div className="min-h-screen nebula-bg">
      <div className="star-field" />

      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
          <Link href="/profile" className="hover:opacity-80 transition-opacity active:scale-95">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <h1 className="font-display text-xl font-bold text-primary">Configurações</h1>
          <Settings className="w-5 h-5 text-primary opacity-50" />
        </div>
      </header>

      <main className="pt-20 pb-8 px-4 max-w-md mx-auto space-y-6">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Configurações da Missão
          </h2>
          <p className="text-on-surface-variant/70 text-sm mt-1">
            Ajusta os parâmetros para a tua próxima viagem espacial.
          </p>
        </div>

        {/* Game Parameters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-secondary" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">
              Parâmetros de Jogo
            </h3>
          </div>

          <div className="glass-panel rounded-xl p-4 space-y-4">
            {/* Timer */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-on-surface font-medium">Cronómetro de Missão</label>
                <span className="text-primary font-bold">{timer}s</span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                step={15}
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                className="w-full h-2 bg-surface-container-low rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(208,188,255,0.8)]"
              />
              <div className="flex justify-between text-[10px] text-outline px-1">
                <span>15s</span>
                <span>30s</span>
                <span>45s</span>
                <span>60s</span>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm text-on-surface font-medium">Nível de Dificuldade</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                {(["Recruta", "Piloto", "Comandante"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 text-xs font-bold rounded-md transition-all ${
                      difficulty === d
                        ? "bg-secondary-container/20 text-secondary border border-secondary/30"
                        : "text-on-surface-variant hover:bg-white/5"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Visual Customization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
              Personalização Visual
            </h3>
          </div>

          <div className="glass-panel rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-on-surface font-medium">Tema da Arena</label>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex-shrink-0 w-28 cursor-pointer group transition-transform active:scale-95`}
                  >
                    <div
                      className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        theme === t.id
                          ? "border-primary shadow-[0_0_15px_rgba(208,188,255,0.3)]"
                          : "border-outline-variant/30"
                      }`}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${t.gradient}`} />
                    </div>
                    <span className="text-[11px] text-on-surface font-medium block text-center mt-2">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <label className="text-sm text-on-surface font-medium">Efeitos de Partículas</label>
                <p className="text-[11px] text-on-surface-variant">Animações de fundo espaciais</p>
              </div>
              <button
                onClick={() => setParticles(!particles)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  particles ? "bg-primary-container" : "bg-surface-variant"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    particles ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Sound and Haptics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-tertiary" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-tertiary">
              Sons e Haptics
            </h3>
          </div>

          <div className="glass-panel rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-on-surface font-medium">Sons da Nave</label>
                <span className="text-tertiary text-xs">{volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-low rounded-full appearance-none cursor-pointer opacity-80
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-tertiary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(222,183,255,0.8)]"
              />
            </div>

            <div className="flex justify-between items-center py-2">
              <label className="text-sm text-on-surface font-medium">Feedback Tátil</label>
              <button
                onClick={() => setHaptics(!haptics)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  haptics ? "bg-primary-container" : "bg-surface-variant"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    haptics ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Reset Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full py-4 glass-panel rounded-xl text-error font-bold tracking-wider hover:bg-error-container/10 transition-colors active:scale-[0.98] mt-8 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          REPOR PARÂMETROS DE FÁBRICA
        </motion.button>
      </main>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
