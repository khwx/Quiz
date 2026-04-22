"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Database, Filter, Search, AlertTriangle, Copy, Lock, Eye, EyeOff, Shield, ShieldCheck, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
    id: string;
    text: string;
    category: string;
    options: string[];
    correct_option: number;
    image_url?: string;
    metadata?: {
        reports?: { reason: string; date: string }[];
    };
}

interface CategoryStats {
    category: string;
    count: number;
}

interface DuplicateGroup {
    anchor: Question;
    duplicates: { question: Question; similarity: number }[];
}

interface AdminUser {
    id: string;
    email: string;
    role: string;
    username: string;
}

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

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

function wordSimilarity(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 && b.size === 0) return 1;
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return intersection.size / union.size;
}

function findDuplicates(questions: Question[], threshold = 0.6): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const used = new Set<string>();
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
            groups.push({ anchor, duplicates });
        }
    }
    return groups;
}

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminRole, setNewAdminRole] = useState("moderator");
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    
    const [questions, setQuestions] = useState<Question[]>([]);
    const [stats, setStats] = useState<CategoryStats[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [showDuplicates, setShowDuplicates] = useState(false);
    const [showReported, setShowReported] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        const userRole = profile?.role || 'user';
        
        if (userRole !== 'admin' && userRole !== 'moderator') {
            alert("Não tens permissão para aceder ao painel de administração.");
            router.push("/");
            return;
        }

        setCurrentUser({
            id: user.id,
            email: user.email || "",
            role: userRole,
            username: profile?.username || user.email?.split('@')[0] || "Admin",
        });
        setIsAuthenticated(true);
        loadData();
        loadAdminUsers();
    };

    const loadAdminUsers = async () => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .in("role", ["admin", "moderator"]);
        setAdminUsers(data || []);
    };

    const addAdmin = async () => {
        if (!newAdminEmail || !newAdminRole) return;
        
        try {
            const { data } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", newAdminEmail)
                .single();

            if (!data) {
                alert("Utilizador não encontrado. Precisa de fazer login primeiro.");
                return;
            }

            await supabase
                .from("profiles")
                .update({ role: newAdminRole })
                .eq("id", data.id);

            alert(`${newAdminEmail} é agora ${newAdminRole}`);
            setNewAdminEmail("");
            setShowAddAdmin(false);
            loadAdminUsers();
        } catch (error) {
            alert("Erro ao adicionar admin");
        }
    };

    const removeAdmin = async (userId: string, email: string) => {
        if (!confirm(`Remover acesso de ${email}?`)) return;
        
        await supabase
            .from("profiles")
            .update({ role: "user" })
            .eq("id", userId);
        
        loadAdminUsers();
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: questionsData } = await supabase
                .from("questions")
                .select("*")
                .order("created_at", { ascending: false });
            
            setQuestions(questionsData || []);
            
            const categoryMap = new Map<string, number>();
            questionsData?.forEach(q => {
                const cat = q.category || "Sem categoria";
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });
            
            const statsData: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
                category,
                count
            })).sort((a, b) => b.count - a.count);
            
            setStats(statsData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Eliminar esta pergunta?")) return;
        
        await supabase.from("questions").delete().eq("id", id);
        loadData();
    };

    const handleDeleteDuplicate = async (id: string, keepBetter: boolean) => {
        if (keepBetter) {
            const { data: questionsData } = await supabase.from("questions").select("id, text").eq("id", id);
            if (questionsData?.[0]) {
                const similar = questions.filter(q => 
                    normalizeText(q.text) === normalizeText(questionsData[0].text) &&
                    q.id !== id
                );
                if (similar.length > 0) {
                    const toDelete = similar.sort((a, b) => b.text.length - a.text.length)[0];
                    await supabase.from("questions").delete().eq("id", toDelete.id);
                }
            }
        }
        await supabase.from("questions").delete().eq("id", id);
        loadData();
    };

    const handleScanDuplicates = () => {
        setIsScanning(true);
        setDuplicateGroups(findDuplicates(questions));
        setIsScanning(false);
        setShowDuplicates(true);
    };

    const filteredQuestions = questions.filter(q => {
        if (selectedCategory !== "all" && q.category !== selectedCategory) return false;
        if (searchQuery && !normalizeText(q.text).includes(normalizeText(searchQuery))) return false;
        return true;
    });

    const reportedQuestions = questions.filter(q => q.metadata?.reports && q.metadata.reports.length > 0);

    const RoleBadge = ({ role }: { role: string }) => {
        const colors: Record<string, string> = {
            admin: "bg-red-500/20 text-red-400 border-red-500/30",
            moderator: "bg-orange-500/20 text-orange-400 border-orange-500/30",
            host: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        };
        return (
            <span className={`px-2 py-1 text-xs rounded border ${colors[role] || "bg-gray-500/20 text-gray-400"}`}>
                {role}
            </span>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen relative overflow-x-hidden pb-20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet-600/10 blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 blur-[150px]" />
            </div>

            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <Link href="/" className="text-xl font-bold text-white/60 hover:text-white transition-colors">
                        ←
                    </Link>
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-violet-400" />
                        <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Admin</h1>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <span>{currentUser?.email}</span>
                        <RoleBadge role={currentUser?.role || 'user'} />
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button onClick={() => { setShowReported(false); setShowDuplicates(false); setShowAddAdmin(false); }} className="px-6 py-3 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-400/30 text-sm font-medium whitespace-nowrap">
                        <Database className="w-4 h-4 inline mr-2" />
                        Perguntas ({questions.length})
                    </button>
                    <button onClick={() => { setShowDuplicates(true); setShowReported(false); setShowAddAdmin(false); handleScanDuplicates(); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Duplicados
                    </button>
                    <button onClick={() => { setShowReported(true); setShowDuplicates(false); setShowAddAdmin(false); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        Reportadas ({reportedQuestions.length})
                    </button>
                    <button onClick={() => { setShowAddAdmin(true); setShowReported(false); setShowDuplicates(false); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <Users className="w-4 h-4 inline mr-2" />
                        Equipa
                    </button>
                </div>

                {showAddAdmin && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-violet-400" />
                            Gestão de Equipa
                        </h2>
                        
                        <div className="mb-6">
                            <h3 className="text-sm text-white/60 mb-3">Membros da Equipa</h3>
                            <div className="space-y-2">
                                {adminUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                        <div>
                                            <div className="text-white font-medium">{user.username}</div>
                                            <div className="text-white/40 text-sm">{user.email}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RoleBadge role={user.role} />
                                            {user.id !== currentUser?.id && (
                                                <button onClick={() => removeAdmin(user.id, user.email)} className="text-pink-400 hover:text-pink-300 text-sm">
                                                    Remover
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <h3 className="text-sm text-white/60 mb-3">Adicionar Membro</h3>
                            <div className="flex gap-3">
                                <input type="email" placeholder="Email do utilizador" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="flex-1 glass-input" />
                                <select value={newAdminRole} onChange={e => setNewAdminRole(e.target.value)} className="glass-input">
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                    <option value="host">Host</option>
                                </select>
                                <button onClick={addAdmin} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-medium">
                                    Adicionar
                                </button>
                            </div>
                            <p className="text-white/40 text-xs mt-2">O utilizador precisa de ter conta criada primeiro.</p>
                        </div>
                    </motion.section>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && (
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-panel p-4 text-center">
                            <div className="text-3xl font-bold text-white">{questions.length}</div>
                            <div className="text-xs text-white/40 uppercase">Total Perguntas</div>
                        </div>
                        <div className="glass-panel p-4 text-center">
                            <div className="text-3xl font-bold text-pink-400">{stats.length}</div>
                            <div className="text-xs text-white/40 uppercase">Categorias</div>
                        </div>
                        <div className="glass-panel p-4 text-center">
                            <div className="text-3xl font-bold text-orange-400">{reportedQuestions.length}</div>
                            <div className="text-xs text-white/40 uppercase">Reportadas</div>
                        </div>
                        <div className="glass-panel p-4 text-center">
                            <div className="text-3xl font-bold text-violet-400">{duplicateGroups.length}</div>
                            <div className="text-xs text-white/40 uppercase">Duplicados</div>
                        </div>
                    </section>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && (
                    <section className="flex gap-2 overflow-x-auto pb-2">
                        <button onClick={() => setSelectedCategory("all")} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${selectedCategory === "all" ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-white/60"}`}>
                            Todas
                        </button>
                        {stats.map(s => (
                            <button key={s.category} onClick={() => setSelectedCategory(s.category)} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${selectedCategory === s.category ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-white/60"}`}>
                                {s.category} ({s.count})
                            </button>
                        ))}
                    </section>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input type="text" placeholder="Pesquisar perguntas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full glass-input pl-12" />
                    </div>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && (
                    <section className="space-y-3">
                        {loading ? (
                            <div className="text-center py-12"><div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                        ) : filteredQuestions.length === 0 ? (
                            <div className="glass-panel p-8 text-center text-white/50">Nenhuma pergunta encontrada</div>
                        ) : filteredQuestions.map(q => (
                            <div key={q.id} className="glass-panel p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-1">{q.text}</p>
                                        <div className="flex gap-2 text-xs text-white/40">
                                            <span className="bg-white/10 px-2 py-1 rounded">{q.category}</span>
                                            <span className="bg-white/10 px-2 py-1 rounded">Resposta: {q.options[q.correct_option]}</span>
                                            {q.metadata?.reports && q.metadata.reports.length > 0 && (
                                                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">{q.metadata.reports.length} reports</span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-pink-400 hover:text-pink-300 p-2"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                {q.options && (
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {q.options.map((opt, idx) => (
                                            <div key={idx} className={`p-2 rounded ${idx === q.correct_option ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/60"}`}>
                                                {idx + 1}. {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {showDuplicates && (
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Duplicados Detetados</h2>
                            <button onClick={handleScanDuplicates} disabled={isScanning} className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm">
                                {isScanning ? "A escanear..." : "Escanear Novamente"}
                            </button>
                        </div>
                        {duplicateGroups.length === 0 ? (
                            <div className="glass-panel p-8 text-center text-white/50">Nenhum duplicado encontrado!</div>
                        ) : duplicateGroups.map((group, idx) => (
                            <div key={idx} className="glass-panel p-4 border border-orange-500/30">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-orange-400 text-sm">Semelhança: {Math.round(group.duplicates[0].similarity * 100)}%</span>
                                        <p className="text-white font-medium">{group.anchor.text}</p>
                                    </div>
                                    <button onClick={() => handleDeleteDuplicate(group.anchor.id, false)} className="text-pink-400 hover:text-pink-300 text-sm">Manter</button>
                                </div>
                                {group.duplicates.map((dup, dIdx) => (
                                    <div key={dIdx} className="flex justify-between items-start bg-white/5 p-3 rounded mb-2">
                                        <div>
                                            <p className="text-white/60">{dup.question.text}</p>
                                        </div>
                                        <button onClick={() => handleDeleteDuplicate(dup.question.id, true)} className="text-green-400 hover:text-green-300 text-sm">Remover</button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                )}

                {showReported && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-white">Perguntas Reportadas</h2>
                        {reportedQuestions.length === 0 ? (
                            <div className="glass-panel p-8 text-center text-white/50">Nenhuma pergunta reportada</div>
                        ) : reportedQuestions.map(q => (
                            <div key={q.id} className="glass-panel p-4 border border-red-500/30">
                                <div className="flex justify-between mb-2">
                                    <p className="text-white font-medium">{q.text}</p>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-pink-400 hover:text-pink-300"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <div className="bg-white/5 p-3 rounded">
                                    <div className="text-xs text-white/40 mb-1">Reports:</div>
                                    {q.metadata?.reports?.map((r, idx) => (
                                        <div key={idx} className="text-sm text-red-400">{r.reason} - {new Date(r.date).toLocaleDateString()}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}