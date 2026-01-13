"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Database, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
    id: string;
    text: string;
    category: string;
    options: string[];
    correct_option: number;
}

interface CategoryStats {
    category: string;
    count: number;
}

export default function AdminPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [stats, setStats] = useState<CategoryStats[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        // Fetch all questions
        const { data: questionsData } = await supabase
            .from("questions")
            .select("*")
            .order("created_at", { ascending: false });

        if (questionsData) {
            setQuestions(questionsData);

            // Calculate stats
            const categoryMap = new Map<string, number>();
            questionsData.forEach(q => {
                const cat = q.category || "Sem Categoria";
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });

            const statsArray = Array.from(categoryMap.entries()).map(([category, count]) => ({
                category,
                count
            })).sort((a, b) => b.count - a.count);

            setStats(statsArray);
        }

        setLoading(false);
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm("Tens a certeza que queres apagar esta pergunta?")) return;

        await supabase.from("questions").delete().eq("id", id);
        loadData();
    };

    const filteredQuestions = selectedCategory === "all"
        ? questions
        : questions.filter(q => q.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="text-white text-2xl">A carregar...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f172a] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-black text-white mb-8 flex items-center gap-4">
                    <Database className="text-pink-500" />
                    Painel Admin
                </h1>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card">
                        <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total</div>
                        <div className="text-4xl font-black text-white">{questions.length}</div>
                        <div className="text-gray-500 text-xs mt-1">perguntas</div>
                    </div>

                    {stats.slice(0, 3).map(stat => (
                        <div key={stat.category} className="glass-card">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-2 truncate">
                                {stat.category}
                            </div>
                            <div className="text-4xl font-black text-pink-500">{stat.count}</div>
                            <div className="text-gray-500 text-xs mt-1">perguntas</div>
                        </div>
                    ))}
                </div>

                {/* Category Filter */}
                <div className="glass-card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="text-pink-500" />
                        <h2 className="text-xl font-bold text-white">Filtrar por Categoria</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === "all"
                                    ? "bg-pink-500 text-white"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                                }`}
                        >
                            Todas ({questions.length})
                        </button>
                        {stats.map(stat => (
                            <button
                                key={stat.category}
                                onClick={() => setSelectedCategory(stat.category)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === stat.category
                                        ? "bg-pink-500 text-white"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                                    }`}
                            >
                                {stat.category} ({stat.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {filteredQuestions.map((q, index) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-xs font-bold">
                                            {q.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{q.text}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`px-3 py-2 rounded-lg text-sm ${i === q.correct_option
                                                        ? "bg-green-500/20 text-green-400 font-bold"
                                                        : "bg-white/5 text-gray-400"
                                                    }`}
                                            >
                                                {i === q.correct_option && "✓ "}{opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteQuestion(q.id)}
                                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredQuestions.length === 0 && (
                    <div className="glass-card text-center py-12">
                        <p className="text-gray-500 text-xl">Nenhuma pergunta encontrada</p>
                    </div>
                )}
            </div>
        </main>
    );
}
