"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Monitor, Smartphone, Trophy, Sparkles, Users, Zap, Brain, Timer, Shield, Target } from "lucide-react";

export default function TutorialPage() {
    const steps = [
        {
            icon: <Monitor className="w-8 h-8 text-violet-400" />,
            title: "1. Prepare o Ecrã Principal",
            description: "Abra o site na sua Smart TV ou computador. Este será o 'tabuleiro' onde todos vêem as perguntas e o ranking em tempo real.",
            image: "/tutorial/step1.png"
        },
        {
            icon: <Smartphone className="w-8 h-8 text-pink-400" />,
            title: "2. Telemóveis a Postos",
            description: "Cada jogador entra no link de jogo pelo telemóvel. Use o QR Code ou insira o PIN de 6 dígitos que aparece na TV.",
            image: "/tutorial/step3.png"
        },
        {
            icon: <Users className="w-8 h-8 text-blue-400" />,
            title: "3. Entre no Lobby",
            description: "Escolha o seu nome e avatar. Assim que todos os jogadores aparecerem no ecrã da TV, o anfitrião pode dar o sinal de partida!",
            image: "/tutorial/step2.png"
        },
        {
            icon: <Target className="w-8 h-8 text-emerald-400" />,
            title: "4. Responda no Telemóvel",
            description: "As perguntas aparecem na TV, mas os botões de resposta estão no seu telemóvel. Seja rápido!",
            image: "/tutorial/step1.png"
        },
        {
            icon: <Trophy className="w-8 h-8 text-amber-400" />,
            title: "5. Conquiste o Pódio",
            description: "No final, os 3 melhores sobem ao pódio com direito a festa, confetis e glória eterna (até à próxima partida).",
            image: "/tutorial/step3.png"
        }
    ];

    const tips = [
        {
            icon: <Zap className="text-yellow-400" />,
            title: "Velocidade é Tudo",
            text: "Quanto mais rápido responderes, mais pontos ganhas. Mas cuidado: se errar, ganha 0!"
        },
        {
            icon: <Monitor className="text-blue-400" />,
            title: "Olho na TV",
            text: "As perguntas e imagens só aparecem no ecrã grande. Mantenha o foco lá e use o telemóvel apenas para clicar."
        },
        {
            icon: <Sparkles className="text-pink-400" />,
            title: "Diversão Primeiro",
            text: "O objetivo é reunir a família. Escolha temas que todos conheçam para uma competição equilibrada."
        }
    ];

    const features = [
        {
            icon: <Brain className="w-6 h-6 text-violet-400" />,
            title: "Perguntas por IA",
            description: "Perguntas geradas automaticamente com inteligência artificial. Nunca fica sem conteúdo!"
        },
        {
            icon: <Timer className="w-6 h-6 text-pink-400" />,
            title: "Tempo Limitado",
            description: "Responda rápido para ganhar mais pontos. Quanto mais depressa, mais pontos!"
        },
        {
            icon: <Users className="w-6 h-6 text-green-400" />,
            title: "Multi-Jogador",
            description: "Jogue com família e amigos. Todos os jogadores participam nos seus telemóveis."
        },
        {
            icon: <Shield className="w-6 h-6 text-yellow-400" />,
            title: "Seguro e Privado",
            description: "Sem necessidade de conta. Basta entrar com o PIN e jogar."
        }
    ];

    return (
        <main className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Voltar ao Início
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
                        <Sparkles size={16} className="text-violet-400" />
                        <span className="text-sm font-bold uppercase tracking-widest text-violet-400">Guia Completo</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-7xl font-black mb-6 italic tracking-tighter leading-none">
                        COMO <span className="text-pink-500 underline decoration-violet-500">JOGAR</span> O QUIZ
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Siga estes 5 passos simples para transformar a sua sala num autêntico estúdio de televisão!
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all"
                        >
                            <div className="mb-3 flex justify-center">{feature.icon}</div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Steps Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
                        >
                            <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-xl group-hover:border-violet-500/50 transition-colors">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Tips Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-white/10 rounded-[3rem] p-8 md:p-12 mb-20"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Trophy className="text-amber-400 w-8 h-8" />
                        <h2 className="text-3xl font-black italic">DICAS DE CAMPEÃO</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {tips.map((tip, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-center gap-2 font-bold text-xl">
                                    {tip.icon}
                                    {tip.title}
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                    {tip.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center pb-20"
                >
                    <Link href="/host" className="inline-flex items-center gap-3 bg-white text-black font-black px-12 py-5 rounded-full text-2xl hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <Play fill="currentColor" />
                        COMEÇAR AGORA
                    </Link>
                    <p className="mt-4 text-gray-500 font-medium">Não é necessário baixar nada. 100% Grátis!</p>
                </motion.div>
            </div>
        </main>
    );
}
