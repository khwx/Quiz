"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Camera, Rocket, FileText, Volume2, Bell, LogOut } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const THEME_COLORS = [
  { name: "Nébula", color: "#d0bcff" },
  { name: "Pulsar", color: "#FFB0CD" },
  { name: "Supergigante", color: "#78d2ff" },
  { name: "Solar", color: "#ffb74d" },
  { name: "Vazio", color: "#494454" },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative transition-colors ${
        enabled ? "bg-[#d0bcff]" : "bg-white/10"
      }`}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [username, setUsername] = useState("Commander Nova");
  const [bio, setBio] = useState("Explorando os confins da nebulosa de Orion em busca de conhecimento.");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [missionReminders, setMissionReminders] = useState(true);
  const [rankingAlerts, setRankingAlerts] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d0bcff]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFB0CD]/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/profile" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Editar Perfil</h1>
          <button className="text-sm text-[#d0bcff] font-bold uppercase tracking-widest">
            Guardar
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* Avatar Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-[3px] border-[#d0bcff] shadow-[0_0_30px_rgba(208,188,255,0.4)] relative">
              <div className="w-full h-full bg-[#1e1e30] flex items-center justify-center">
                <Rocket className="w-12 h-12 text-[#d0bcff]" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-[#d0bcff] text-[#121223] p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <button className="px-6 py-2 rounded-full border border-[#d0bcff]/40 text-[#d0bcff] text-sm font-bold hover:bg-[#d0bcff]/10 transition-all">
            Alterar Avatar
          </button>
        </motion.section>

        {/* Info Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <label className="text-xs text-[#e3e0f9]/60 uppercase tracking-wider font-bold ml-1">Nome do Piloto</label>
            <div className="glass-panel rounded-xl flex items-center px-4 py-3 focus-within:border-[#d0bcff]/50 focus-within:shadow-[0_0_20px_rgba(208,188,255,0.2)] transition-all">
              <Rocket className="w-5 h-5 text-[#d0bcff] mr-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[#e3e0f9] w-full text-lg placeholder:text-[#e3e0f9]/30"
                placeholder="Pilot Name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#e3e0f9]/60 uppercase tracking-wider font-bold ml-1">Diário de Missão (Bio)</label>
            <div className="glass-panel rounded-xl flex items-start px-4 py-3 h-32 focus-within:border-[#d0bcff]/50 focus-within:shadow-[0_0_20px_rgba(208,188,255,0.2)] transition-all">
              <FileText className="w-5 h-5 text-[#d0bcff] mr-3 mt-1" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[#e3e0f9] w-full resize-none placeholder:text-[#e3e0f9]/30"
                placeholder="Descreve as tuas conquistas..."
              />
            </div>
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-[#d0bcff]" style={{ fontFamily: "Space Grotesk" }}>Esquema de Cores Cósmico</h3>
          <div className="flex flex-wrap gap-4">
            {THEME_COLORS.map((theme, idx) => (
              <button
                key={theme.name}
                onClick={() => setSelectedTheme(idx)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-10 h-10 rounded-xl transition-all ${
                    selectedTheme === idx ? "border-2 border-white scale-110 shadow-lg" : "border-2 border-transparent"
                  }`}
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-[10px] uppercase tracking-wider opacity-70">{theme.name}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Audio & Haptics */}
          <div className="glass-panel rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-2 text-[#d0bcff]">
              <Volume2 className="w-5 h-5" />
              <h3 className="font-bold" style={{ fontFamily: "Space Grotesk" }}>Sons e Tato</h3>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-[#e3e0f9]">Efeitos Sonoros</p>
                <p className="text-xs text-[#e3e0f9]/50">Sons das missões e conquistas</p>
              </div>
              <Toggle enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-[#e3e0f9]">Haptics (Vibração)</p>
                <p className="text-xs text-[#e3e0f9]/50">Feedback tátil ao acertar questões</p>
              </div>
              <Toggle enabled={haptics} onToggle={() => setHaptics(!haptics)} />
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-panel rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-2 text-[#d0bcff]">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold" style={{ fontFamily: "Space Grotesk" }}>Notificações</h3>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-[#e3e0f9]">Lembretes de Missão</p>
                <p className="text-xs text-[#e3e0f9]/50">Novas missões diárias disponíveis</p>
              </div>
              <Toggle enabled={missionReminders} onToggle={() => setMissionReminders(!missionReminders)} />
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-[#e3e0f9]">Ranking e Desafios</p>
                <p className="text-xs text-[#e3e0f9]/50">Alertas quando alguém te ultrapassa</p>
              </div>
              <Toggle enabled={rankingAlerts} onToggle={() => setRankingAlerts(!rankingAlerts)} />
            </div>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleSignOut}
            className="w-full py-4 rounded-xl border border-[#FF6B6B]/30 text-[#FF6B6B] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B6B]/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminar Sessão
          </button>
        </motion.section>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
