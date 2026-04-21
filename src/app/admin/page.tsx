"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Database, Filter, Search, AlertTriangle, Copy } from "lucide-react";
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

interface DuplicateGroup {
    anchor: Question;
    duplicates: { question: Question; similarity: number }[];
}

// Normalize text for comparison: lowercase, remove accents, remove punctuation
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9\s]/g, '') // remove punctuation
        .trim();
}

// Portuguese stopwords to ignore
const STOPWORDS = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'sob', 'sobre',
    'e', 'ou', 'que', 'qual', 'quem', 'como', 'onde', 'quando', 'se', 'mais',
    'muito', 'pouco', 'este', 'esta', 'esse', 'essa', 'aquele', 'aquela',
    'ser', 'ter', 'haver', 'ir', 'vir', 'dar', 'fazer', 'poder', 'dever',
    'foi', 'era', 'sao', 'esta', 'tem', 'ha', 'pode', 'deve',
    'nao', 'sim', 'ja', 'ainda', 'tambem', 'so', 'apenas', 'entao',
    'ao', 'aos', 'pelo', 'pela', 'pelos', 'pelas', 'num', 'numa',
]);

function getSignificantWords(text: string): Set<string> {
    const normalized = normalizeText(text);
    const words = normalized.split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
    return new Set(words);
}

// Jaccard similarity between two sets of words (0 to 1)
function wordSimilarity(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 && b.size === 0) return 1;
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return intersection.size / union.size;
}

function findDuplicates(questions: Question[], threshold = 0.6): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const used = new Set<string>();

    // Pre-compute word sets
    const wordSets = new Map<string, Set<string>>();
    questions.forEach(q => wordSets.set(q.id, getSignificantWords(q.text)));

    for (let i = 0; i < questions.length; i++) {
        if (used.has(questions[i].id)) continue;

        const anchor = questions[i];
        const anchorWords = wordSets.get(anchor.id)!;
        const duplicates: { question: Question; similarity: number }[] = [];

        for (let j = i + 1; j < questions.length; j++) {
            if (used.has(questions[j].id)) continue;

            const candidate = questions[j];
            // Only compare within same category
            if (normalizeText(anchor.category) !== normalizeText(candidate.category)) continue;

            const candidateWords = wordSets.get(candidate.id)!;
            const sim = wordSimilarity(anchorWords, candidateWords);

            if (sim >= threshold) {
                duplicates.push({ question: candidate, similarity: sim });
                used.add(candidate.id);
            }
        }

        if (duplicates.length > 0) {
            used.add(anchor.id);
            groups.push({ anchor, duplicates: duplicates.sort((a, b) => b.similarity - a.similarity) });
        }
    }

    return groups;
}

export default function AdminPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [stats, setStats] = useState<CategoryStats[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [showDuplicates, setShowDuplicates] = useState(false);

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
                let cat = q.category || "Sem Categoria";
                // Normalize for display: "ciência" -> "Ciência"
                cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

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
        : questions.filter(q => {
            const cat = q.category || "Sem Categoria";
            const normalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
            return normalizedCat === selectedCategory;
        });

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

                {/* Duplicate Detector */}
                <div className="glass-card mb-6 border-2 border-amber-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Copy className="text-amber-500" />
                            <h2 className="text-xl font-bold text-amber-400">Detector de Duplicados</h2>
                        </div>
                        <button
                            onClick={() => {
                                setIsScanning(true);
                                // Use setTimeout to allow UI to update before heavy computation
                                setTimeout(() => {
                                    const groups = findDuplicates(questions, 0.55);
                                    setDuplicateGroups(groups);
                                    setIsScanning(false);
                                    setShowDuplicates(true);
                                }, 50);
                            }}
                            disabled={isScanning || questions.length === 0}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Search size={20} className={isScanning ? 'animate-spin' : ''} />
                            {isScanning ? 'A analisar...' : `Analisar ${questions.length} Perguntas`}
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Encontra perguntas similares ou inversas (ex: &ldquo;Capital de Portugal?&rdquo; vs &ldquo;País de Lisboa?&rdquo;). Usa comparação de palavras-chave com 55% de semelhança mínima.
                    </p>

                    {showDuplicates && (
                        <div className="space-y-4 mt-4">
                            {duplicateGroups.length === 0 ? (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                                    <p className="text-green-400 font-bold text-lg">✅ Nenhum duplicado encontrado!</p>
                                    <p className="text-gray-500 text-sm">A tua base de dados está limpa.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
                                        <AlertTriangle className="text-amber-500 shrink-0" />
                                        <p className="text-amber-300">
                                            Encontrados <span className="font-black text-lg">{duplicateGroups.length}</span> grupos de perguntas similares
                                            ({duplicateGroups.reduce((acc, g) => acc + g.duplicates.length, 0)} duplicados potenciais)
                                        </p>
                                    </div>
                                    {duplicateGroups.map((group, gi) => (
                                        <div key={group.anchor.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                                                    Grupo {gi + 1}
                                                </span>
                                                <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-xs font-bold">
                                                    {group.anchor.category}
                                                </span>
                                            </div>
                                            {/* Anchor question */}
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-2 flex items-center justify-between">
                                                <div>
                                                    <span className="text-green-400 text-xs font-bold uppercase mr-2">Original</span>
                                                    <span className="text-white font-bold">{group.anchor.text}</span>
                                                </div>
                                            </div>
                                            {/* Duplicates */}
                                            {group.duplicates.map(dup => (
                                                <div key={dup.question.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-1 flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <span className={`text-xs font-bold uppercase mr-2 px-2 py-0.5 rounded ${dup.similarity >= 0.8 ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'}`}>
                                                            {Math.round(dup.similarity * 100)}% similar
                                                        </span>
                                                        <span className="text-gray-300">{dup.question.text}</span>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm(`Apagar: "${dup.question.text}"?`)) return;
                                                            await supabase.from('questions').delete().eq('id', dup.question.id);
                                                            loadData();
                                                            setDuplicateGroups(prev => prev.map(g => ({
                                                                ...g,
                                                                duplicates: g.duplicates.filter(d => d.question.id !== dup.question.id)
                                                            })).filter(g => g.duplicates.length > 0));
                                                        }}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors shrink-0 ml-3"
                                                        title="Apagar este duplicado"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Danger Zone */}
                <div className="glass-card mb-6 border-2 border-red-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <Trash2 className="text-red-500" />
                        <h2 className="text-xl font-bold text-red-400">Zona de Perigo</h2>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Apagar todas as perguntas permanentemente. Esta ação não pode ser desfeita!
                    </p>
                    <button
                        onClick={() => {
                            const code = prompt("⚠️ ATENÇÃO! Isto vai apagar TODAS as perguntas.\n\nEscreve 'APAGAR' para confirmar:");
                            if (code === "APAGAR") {
                                const confirmAgain = confirm(`Tens MESMO a certeza? Vais apagar ${questions.length} perguntas!`);
                                if (confirmAgain) {
                                    supabase.from("questions").delete().neq("id", "00000000-0000-0000-0000-000000000000").then(() => {
                                        alert("✅ Todas as perguntas foram apagadas!");
                                        loadData();
                                    });
                                }
                            } else if (code !== null) {
                                alert("❌ Código errado. Nada foi apagado.");
                            }
                        }}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={20} />
                        Apagar Todas as Perguntas ({questions.length})
                    </button>
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
