"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Settings, Trophy, Star, Coins, Flame, Crown, Activity, Edit2, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("stats");

  // Mock user data - replace with real Supabase data
  const user = {
    name: "Alex Nova",
    username: "commander_alex",
    level: 42,
    xp: 8450,
    xpToNext: 10000,
    coins: 12400,
    totalGames: 156,
    wins: 89,
    avgScore: 2450,
    streak: 7,
    rank: "Nebula Explorer",
    avatar: null,
  };

  const achievements = [
    { id: 1, name: "First Victory", icon: "🏆", earned: true, date: "2024-01-15" },
    { id: 2, name: "3 Win Streak", icon: "🔥", earned: true, date: "2024-02-20" },
    { id: 3, name: "5 Win Streak", icon: "💎", earned: true, date: "2024-03-10" },
    { id: 4, name: "Perfect Game", icon: "🌟", earned: true, date: "2024-04-05" },
    { id: 5, name: "Speed Demon", icon: "⚡", earned: true, date: "2024-05-12" },
    { id: 6, name: "Quiz Master", icon: "🎓", earned: false, date: null },
    { id: 7, name: "Flag Expert", icon: "🚩", earned: false, date: null },
    { id: 8, name: "Capital Master", icon: "🏛️", earned: false, date: null },
  ];

  const recentGames = [
    { id: 1, topic: "Capitais", score: 2800, position: 1, date: "2024-06-10" },
    { id: 2, topic: "História", score: 2200, position: 2, date: "2024-06-09" },
    { id: 3, topic: "Ciência", score: 3100, position: 1, date: "2024-06-08" },
    { id: 4, topic: "Geografia", score: 1800, position: 3, date: "2024-06-07" },
    { id: 5, topic: "Desporto", score: 2500, position: 1, date: "2024-06-06" },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 blur-[150px]" />
      </div>

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white/60 hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Profile</h1>
          <button className="text-white/60 hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Profile Header Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-5xl font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                Lvl {user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>{user.name}</h2>
              <p className="text-white/50 mb-3 flex items-center justify-center md:justify-start gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                {user.rank}
              </p>

              {/* XP Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Level Progress</span>
                  <span>{user.xp.toLocaleString()} / {user.xpToNext.toLocaleString()} XP</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-xs text-white/40 uppercase">Coins</div>
                    <div className="font-bold text-white">{user.coins.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-violet-400" />
                  <div>
                    <div className="text-xs text-white/40 uppercase">Wins</div>
                    <div className="font-bold text-white">{user.wins}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-xs text-white/40 uppercase">Streak</div>
                    <div className="font-bold text-white">{user.streak} days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button className="md:self-start p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <Edit2 className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </motion.section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["stats", "games", "achievements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-violet-500/15 text-violet-400 border border-violet-400/30"
                  : "text-white/60 hover:text-white bg-white/5 border border-white/10"
              }`}
            >
              {tab === "stats" && <Activity className="w-4 h-4 inline mr-2" />}
              {tab === "games" && <Trophy className="w-4 h-4 inline mr-2" />}
              {tab === "achievements" && <Star className="w-4 h-4 inline mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "stats" && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">{user.totalGames}</div>
              <div className="text-xs text-white/40 uppercase">Games Played</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-violet-400 mb-1">{user.wins}</div>
              <div className="text-xs text-white/40 uppercase">Victories</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1">{user.avgScore}</div>
              <div className="text-xs text-white/40 uppercase">Avg Score</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{user.coins}</div>
              <div className="text-xs text-white/40 uppercase">Total Coins</div>
            </div>
          </motion.section>
        )}

        {activeTab === "games" && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {recentGames.map((game, i) => (
              <div key={game.id} className="glass-panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/60">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{game.topic}</div>
                    <div className="text-xs text-white/40">{game.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{game.score.toLocaleString()}</div>
                  <div className={`text-xs ${game.position === 1 ? "text-yellow-400" : "text-white/40"}`}>
                    #{game.position} place
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-center text-white/40 hover:text-white transition-colors text-sm">
              View All Games →
            </button>
          </motion.section>
        )}

        {activeTab === "achievements" && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`glass-panel p-4 text-center transition-all ${
                  achievement.earned 
                    ? "hover:border-violet-400/50" 
                    : "opacity-40"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-medium text-white text-sm">{achievement.name}</div>
                {achievement.earned && (
                  <div className="text-xs text-emerald-400 mt-1">Unlocked</div>
                )}
              </div>
            ))}
          </motion.section>
        )}

        {/* Global Ranking CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 glass-panel p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Global Ranking</h3>
            <p className="text-white/50 text-sm">See how you compare to other commanders</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:brightness-110 transition-all">
            <Trophy className="w-5 h-5" />
            View Rankings
          </button>
        </motion.section>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden border-t border-white/10">
        <div className="flex justify-around items-center px-4 py-3 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10">
          <Link href="/" className="flex flex-col items-center justify-center text-white/50">
            <Trophy className="w-6 h-6" />
            <span className="text-[10px] mt-1">Home</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center justify-center text-white/50">
            <Star className="w-6 h-6" />
            <span className="text-[10px] mt-1">Rankings</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center text-pink-500">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
            <span className="text-[10px] mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}