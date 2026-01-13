"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Save, Trash2, Plus, RefreshCcw, Loader2, BookOpen, Atom, Tv, Globe } from "lucide-react";
import { generateQuestions } from "@/lib/ai-service";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [prompt, setPrompt] = useState("");
    const [ageRating, setAgeRating] = useState("adults");
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewQuestions, setPreviewQuestions] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState("");

    const predefinedThemes = [
        { label: "História de Portugal", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Ciência Divertida", icon: <Atom className="w-4 h-4" /> },
        { label: "Desenhos Animados", icon: <Tv className="w-4 h-4" /> },
        { label: "Geografia Mundial", icon: <Globe className="w-4 h-4" /> },
    ];

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setErrorMsg("");
        try {
            const questions = await generateQuestions(prompt, 5, ageRating);
            if (!Array.isArray(questions)) throw new Error("Formato inválido recebido da IA");
            setPreviewQuestions(questions);
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Erro ao gerar perguntas. Verifica a chave API.");
        } finally {
            setIsGenerating(false);
        }
    };

    const saveToDatabase = async () => {
        const { error } = await supabase.from("questions").insert(
            previewQuestions.map(q => ({
                text: q.text,
                options: q.options,
                correct_option: q.correct_option,
                category: q.category,
                age_rating: ageRating === "children" ? 9 : 18,
                country_code: "PT"
            }))
        );

        if (!error) {
            alert("Perguntas guardadas na base de dados com sucesso! Estão prontas a usar no jogo para sempre.");
            setPreviewQuestions([]);
            setPrompt("");
        } else {
            alert("Erro ao guardar na base de dados: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white italic">ADMIN <span className="text-violet-500">CABIN</span></h1>
                        <p className="text-gray-400">Gera e gere o reportório de perguntas. <span className="text-green-400 font-bold">Gera uma vez, joga as vezes que quiseres!</span></p>
                    </div>
                    <div className="flex gap-4">
                        <button className="glass-card flex items-center gap-2 hover:bg-white/10 transition-all">
                            <RefreshCcw className="w-4 h-4" /> Importar/Exportar
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <section className="lg:col-span-1 space-y-6">
                        <div className="glass-card space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="text-violet-400 w-5 h-5" /> Criador com IA
                            </h2>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Temas Rápidos</label>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {predefinedThemes.map((theme, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(theme.label)}
                                            className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors text-left"
                                        >
                                            {theme.icon} {theme.label}
                                        </button>
                                    ))}
                                </div>

                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Tema das Perguntas</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ex: História de Portugal, Desenhos Animados, Ciência..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[100px] focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Público Alvo</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAgeRating("children")}
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${ageRating === "children" ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400'}`}
                                    >
                                        Crianças
                                    </button>
                                    <button
                                        onClick={() => setAgeRating("adults")}
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${ageRating === "adults" ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400'}`}
                                    >
                                        Adultos
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className="btn-quiz btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gerar 5 Perguntas"}
                            </button>

                            {errorMsg && (
                                <div className="p-3 bg-red-500/20 text-red-300 text-sm rounded-lg border border-red-500/50">
                                    {errorMsg}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Preview */}
                    <section className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Pré-visualização</h2>
                            {previewQuestions.length > 0 && (
                                <button
                                    onClick={saveToDatabase}
                                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-bold"
                                >
                                    <Save className="w-5 h-5" /> Guardar na Base de Dados
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {previewQuestions.length > 0 ? (
                                previewQuestions.map((q, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={idx}
                                        className="glass-card group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-sm font-bold text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full">{q.category}</span>
                                            <button
                                                onClick={() => setPreviewQuestions(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">{idx + 1}. {q.text}</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options.map((opt: string, oIdx: number) => (
                                                <div
                                                    key={oIdx}
                                                    className={`p-3 rounded-lg text-sm border ${q.correct_option === oIdx ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-64 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-500">
                                    <Plus className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Gera perguntas escolhendo um tema à esquerda</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
