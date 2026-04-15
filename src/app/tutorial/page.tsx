"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Monitor, Smartphone, Trophy, Sparkles, Users, Zap, Brain, Timer, Shield } from "lucide-react";

export default function TutorialPage() {
    const steps = [
        {
            icon: <Monitor className="w-8 h-8 text-violet-400" />,
            title: "1. Prepare o Ecrã Grande",
            description: "Abra o link da TV num computador ou Smart TV. Um código PIN único será gerado automaticamente.",
            image: "/tutorial/step1.png"
        },
        {
            icon: <Smartphone className="w-8 h-8 text-pink-400" />,
            title: "2. Junte os Jogadores",
            description: "Todos devem entrar no link de jogo nos telemóveis e inserir o PIN exibido na TV.",
            image: "/tutorial/step3.png"
        },
        {
            icon: <Play className="w-8 h-8 text-blue-400" />,
            title: "3. Comece a Diversão",
            description: "O Anfitrião escolhe o tema e inicia o jogo. Responda rápido para ganhar mais pontos!",
            image: "/tutorial/step2.png"
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
            description: "Jogue com família e amigos. Todos os jogadores participan nos seus telemóveis."
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
                        Voltar
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
                        <Sparkles size={16} className="text-violet-400" />
                        <span className="text-sm font-bold uppercase tracking-widest text-violet-400">Guia</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-6 italic tracking-tighter">
                        VEJA COMO <span className="text-pink-500">FUNCIONA</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        O quiz perfeito para noites em família. Configure rapidamente e comece a jogar!
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

                {/* Steps Grid with Images */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all group"
                        >
                            <div className="aspect-video relative overflow-hidden bg-black/40">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                            <div className="p-8">
                                <div className="mb-4">{step.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How Points Work */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-16"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        Como Funciona a Pontuação?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-green-400 mb-2">Resposta Correta</h3>
                            <p className="text-gray-300 text-sm">Se responderes corretamente, ganas pontos baseados na tua velocidade. Quanto mais rápido, mais pontos!</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-400 mb-2">Resposta Errada</h3>
                            <p className="text-gray-300 text-sm">Se responderes mal ou não chegares a tempo, não ganhas nenhum ponto nesta pergunta.</p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                        <p className="text-yellow-300 text-sm font-medium">
                            <strong>💡 Dica:</strong> Podes responder enquanto esperas que os outros jogadores terminem - o timer só avança quando todos responderem ou quando o tempo acabar!
                        </p>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <Link href="/host" className="btn-quiz btn-primary inline-flex items-center gap-2 py-4 px-12 text-xl">
                        <Play className="w-6 h-6" />
                        Estou Pronto para Jogar!
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
