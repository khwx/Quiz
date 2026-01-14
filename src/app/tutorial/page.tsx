"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Monitor, Smartphone, Trophy, Sparkles } from "lucide-react";

export default function TutorialPage() {
    const steps = [
        {
            icon: <Monitor className="w-8 h-8 text-violet-400" />,
            title: "1. Prepare o Ecrã Grande",
            description: "Abra o link da TV num computador ou Smart TV. Um código PIN único será gerado.",
            image: "/tutorial/step1.png"
        },
        {
            icon: <Smartphone className="w-8 h-8 text-pink-400" />,
            title: "2. Junte os Jogadores",
            description: "Todos devem entrar no link de jogo nos telemóveis e inserir o PIN exibido.",
            image: "/tutorial/step3.png"
        },
        {
            icon: <Play className="w-8 h-8 text-blue-400" />,
            title: "3. Comece a Diversão",
            description: "O Anfitrião escolhe o tema e inicia o jogo. Responda rápido para ganhar mais pontos!",
            image: "/tutorial/step2.png"
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
                        <span className="text-sm font-bold uppercase tracking-widest text-violet-400">Guia Visual</span>
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
                        Capturas reais da nossa plataforma simplificada para diversão em família.
                    </p>
                </motion.div>

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

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <Link href="/host" className="btn-quiz btn-primary inline-flex items-center gap-2 py-4 px-12 text-xl">
                        Estou Pronto para Jogar!
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
