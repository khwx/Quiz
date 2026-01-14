"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Monitor, Smartphone, Trophy, Sparkles } from "lucide-react";

export default function TutorialPage() {
    const steps = [
        {
            icon: <Monitor className="w-8 h-8 text-violet-400" />,
            title: "1. Prepare o Ecrã Grande",
            description: "Abra o link da TV num computador ou Smart TV. Um código PIN único será gerado."
        },
        {
            icon: <Smartphone className="w-8 h-8 text-pink-400" />,
            title: "2. Junte os Jogadores",
            description: "Todos devem entrar em quiz.io/play nos telemóveis e inserir o PIN do jogo."
        },
        {
            icon: <Play className="w-8 h-8 text-blue-400" />,
            title: "3. Comece a Diversão",
            description: "O Anfitrião escolhe o tema e inicia o jogo. Responda rápido para ganhar mais pontos!"
        }
    ];

    return (
        <main className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
                        <Sparkles size={16} className="text-violet-400" />
                        <span className="text-sm font-bold uppercase tracking-widest text-violet-400">Tutorial</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-6 italic tracking-tighter">
                        COMO <span className="text-pink-500">JOGAR?</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        O QuizMaster transforma o teu telemóvel num comando de jogo. Aprende a configurar tudo em menos de 1 minuto.
                    </p>
                </motion.div>

                {/* Video Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-video bg-black/40 rounded-3xl border border-white/10 overflow-hidden shadow-2xl mb-16 group"
                >
                    {/* Placeholder for Video - In a real app, replace src with actual video URL */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-600/20 to-pink-600/20">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform cursor-pointer border border-white/20">
                            <Play fill="white" size={32} className="ml-1" />
                        </div>
                        <p className="mt-4 text-gray-400 font-medium">Ver Vídeo Demonstrativo</p>
                    </div>

                    {/* Simulate Video UI */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-pink-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="mb-4">{step.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {step.description}
                            </p>
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
