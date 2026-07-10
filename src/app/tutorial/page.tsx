"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Monitor, Smartphone, Trophy, Sparkles, Users, Zap, Brain, Timer, Shield, Target, Rocket, Star } from "lucide-react";

export default function TutorialPage() {
    const steps = [
        {
            icon: <Monitor className="w-8 h-8 text-[#d0bcff]" />,
            title: "1. Prepare o Ecrã Principal",
            description: "Abra o site na sua Smart TV ou computador. Este será o 'tabuleiro' onde todos vêem as perguntas e o ranking em tempo real.",
            color: "from-[#d0bcff]/20 to-[#a078ff]/10",
        },
        {
            icon: <Smartphone className="w-8 h-8 text-[#FFB0CD]" />,
            title: "2. Telemóveis a Postos",
            description: "Cada jogador entra no link de jogo pelo telemóvel. Use o QR Code ou insira o PIN de 6 dígitos que aparece na TV.",
            color: "from-[#FFB0CD]/20 to-[#aa0266]/10",
        },
        {
            icon: <Users className="w-8 h-8 text-[#deb7ff]" />,
            title: "3. Entre no Lobby",
            description: "Escolha o seu nome e avatar. Assim que todos os jogadores aparecerem no ecrã da TV, o anfitrião pode dar o sinal de partida!",
            color: "from-[#deb7ff]/20 to-[#b86dfd]/10",
        },
        {
            icon: <Target className="w-8 h-8 text-[#4CAF50]" />,
            title: "4. Responda no Telemóvel",
            description: "As perguntas aparecem na TV, mas os botões de resposta estão no seu telemóvel. Use a DICA se precisar de ajuda! Seja rápido!",
            color: "from-[#4CAF50]/20 to-[#2E7D32]/10",
        },
        {
            icon: <Trophy className="w-8 h-8 text-[#FFD700]" />,
            title: "5. Conquiste o Pódio",
            description: "No final, os 3 melhores sobem ao pódio com direito a festa, confetis e glória eterna (até à próxima partida).",
            color: "from-[#FFD700]/20 to-[#FF8C00]/10",
        }
    ];

    const tips = [
        {
            icon: <Zap className="text-[#FFD700]" />,
            title: "Velocidade é Tudo",
            text: "Quanto mais rápido responderes, mais pontos ganhas. Mas cuidado: se errar, ganha 0!"
        },
        {
            icon: <Monitor className="text-[#d0bcff]" />,
            title: "Olho na TV",
            text: "As perguntas e imagens só aparecem no ecrã grande. Mantenha o foco lá e use o telemóvel apenas para clicar."
        },
        {
            icon: <Sparkles className="text-[#FFB0CD]" />,
            title: "Diversão Primeiro",
            text: "O objetivo é reunir a família. Escolha temas que todos conheçam para uma competição equilibrada."
        }
    ];

    const features = [
        {
            icon: <Brain className="w-6 h-6 text-[#d0bcff]" />,
            title: "Perguntas por IA",
            description: "Perguntas geradas automaticamente com inteligência artificial. Nunca fica sem conteúdo!"
        },
        {
            icon: <Timer className="w-6 h-6 text-[#FFB0CD]" />,
            title: "Tempo Limitado",
            description: "Responda rápido para ganhar mais pontos. Quanto mais depressa, mais pontos!"
        },
        {
            icon: <Users className="w-6 h-6 text-[#4CAF50]" />,
            title: "Multi-Jogador",
            description: "Jogue com família e amigos. Todos os jogadores participam nos seus telemóveis."
        },
        {
            icon: <Shield className="w-6 h-6 text-[#FFD700]" />,
            title: "Seguro e Privado",
            description: "Sem necessidade de conta. Basta entrar com o PIN e jogar."
        }
    ];

    return (
        <main className="min-h-screen relative overflow-hidden pb-20">
            <div className="fixed inset-0 z-0 bg-[#121223]">
                <div className="absolute inset-0 nebula-bg" />
                <div className="absolute inset-0 star-field" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-2 text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors group">
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Voltar ao Início
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-1 bg-[#d0bcff]/10 rounded-full border border-[#d0bcff]/20">
                        <Sparkles size={16} className="text-[#d0bcff]" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[#d0bcff]">Guia Completo</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-none">
                        COMO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD]">JOGAR</span> O QUIZ
                    </h1>
                    <p className="text-[#e3e0f9]/60 text-lg md:text-xl max-w-2xl mx-auto">
                        Siga estes 5 passos simples para transformar a sua sala num autêntico estúdio de televisão!
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            className="bg-[#1e1e30]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all"
                        >
                            <div className="mb-3 flex justify-center">{feature.icon}</div>
                            <h3 className="text-lg font-bold mb-2 text-[#e3e0f9]">{feature.title}</h3>
                            <p className="text-[#e3e0f9]/50 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className={`bg-gradient-to-br ${step.color} backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group`}
                        >
                            <div className="w-16 h-16 bg-[#121223]/60 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-colors">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-[#e3e0f9]">{step.title}</h3>
                            <p className="text-[#e3e0f9]/60 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#1e1e30]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 mb-20"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Trophy className="text-[#FFD700] w-8 h-8" />
                        <h2 className="text-3xl font-bold text-[#e3e0f9]">DICAS DE CAMPEÃO</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {tips.map((tip, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-center gap-2 font-bold text-xl text-[#e3e0f9]">
                                    {tip.icon}
                                    {tip.title}
                                </div>
                                <p className="text-[#e3e0f9]/60 leading-relaxed">
                                    {tip.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center pb-20"
                >
                    <Link href="/host" className="inline-flex items-center gap-3 bg-[#d0bcff] text-[#3c0091] font-bold px-12 py-5 rounded-2xl text-2xl hover:shadow-[0_0_30px_rgba(208,188,255,0.3)] transition-all transform hover:scale-105 active:scale-95">
                        <Rocket className="w-6 h-6" />
                        COMEÇAR AGORA
                    </Link>
                    <p className="mt-4 text-[#e3e0f9]/40 font-medium">Não é necessário baixar nada. 100% Grátis!</p>
                </motion.div>
            </div>
        </main>
    );
}
