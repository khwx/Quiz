"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Database, Filter, Search, AlertTriangle, Shield, ShieldCheck, Users, Plus, Edit2, X, Save } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/Toast";
import { UserRole } from "@/lib/constants";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("AdminPage");

interface Question {
    id: string;
    text: string;
    category: string;
    difficulty?: number;
    options: string[];
    correct_option: number;
    image_url?: string;
    age_rating?: number;
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
    const { toasts, show: showToast, dismiss } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminRole, setNewAdminRole] = useState<UserRole>(UserRole.MODERATOR);
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
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [showCategories, setShowCategories] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showImportCSV, setShowImportCSV] = useState(false);
    const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);
    const [formData, setFormData] = useState({
        text: "",
        category: "CULTURA_GERAL",
        difficulty: 2,
        age_rating: 12,
        options: ["", "", "", ""],
        correct_option: 0,
    });
    const [saving, setSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 50;

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

        const userRole = profile?.role || UserRole.MEMBER;
        
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.MODERATOR) {
            showToast("Não tens permissão para aceder ao painel de administração.", "error");
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
            .in("role", [UserRole.ADMIN, UserRole.MODERATOR]);
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
                showToast("Utilizador não encontrado. Precisa de fazer login primeiro.", "error");
                return;
            }

            await supabase
                .from("profiles")
                .update({ role: newAdminRole })
                .eq("id", data.id);

            showToast(`${newAdminEmail} e agora ${newAdminRole}`, "success");
            setNewAdminEmail("");
            setShowAddAdmin(false);
            loadAdminUsers();
        } catch (error) {
            showToast("Erro ao adicionar admin", "error");
        }
    };

    const removeAdmin = async (userId: string, email: string) => {
        if (!confirm(`Remover acesso de ${email}?`)) return;
        
        await supabase
            .from("profiles")
            .update({ role: UserRole.MEMBER })
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
            log.error("Error loading data", { error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Eliminar esta pergunta?")) return;
        
        await supabase.from("questions").delete().eq("id", id);
        loadData();
    };

    const exportToCSV = () => {
        const headers = ["ID", "Texto", "Categoria", "Dificuldade", "Idade", "Resposta Correta", "Opções"];
        const rows = questions.map(q => [
            q.id,
            `"${q.text.replace(/"/g, '""')}"`,
            q.category,
            q.difficulty || 2,
            q.age_rating || 18,
            q.options[q.correct_option] || "",
            `"${(q.options || []).join(" | ").replace(/"/g, '""')}"`,
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `quizverse_questions_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const resetForm = () => {
        setFormData({
            text: "",
            category: "CULTURA_GERAL",
            difficulty: 2,
            age_rating: 12,
            options: ["", "", "", ""],
            correct_option: 0,
        });
        setEditId(null);
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        const cat = newCategoryName.trim().toUpperCase().replace(/\s+/g, "_");
        await supabase.from("questions").update({ category: cat }).eq("category", newCategoryName.trim());
        setNewCategoryName("");
        loadData();
    };

    const parseCSV = (csvText: string): string[][] => {
        const lines: string[][] = [];
        let currentLine: string[] = [];
        let currentField = "";
        let inQuotes = false;

        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (inQuotes) {
                if (char === '"' && nextChar === '"') {
                    currentField += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    currentField += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ',') {
                    currentLine.push(currentField);
                    currentField = "";
                } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                    currentLine.push(currentField);
                    if (currentLine.some(f => f.trim() !== "")) {
                        lines.push(currentLine);
                    }
                    currentLine = [];
                    currentField = "";
                    if (char === '\r') i++;
                } else {
                    currentField += char;
                }
            }
        }

        if (currentField || currentLine.length > 0) {
            currentLine.push(currentField);
            if (currentLine.some(f => f.trim() !== "")) {
                lines.push(currentLine);
            }
        }

        return lines;
    };

    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportResults(null);
        const text = await file.text();
        const rows = parseCSV(text);

        if (rows.length < 2) {
            setImportResults({ success: 0, errors: ["Ficheiro CSV vazio ou inválido"] });
            return;
        }

        const headers = rows[0].map(h => h.toLowerCase().trim());
        const textIdx = headers.findIndex(h => h.includes("texto") || h.includes("text"));
        const catIdx = headers.findIndex(h => h.includes("categoria") || h.includes("category"));
        const diffIdx = headers.findIndex(h => h.includes("dificuldade") || h.includes("difficulty"));
        const ageIdx = headers.findIndex(h => h.includes("idade") || h.includes("age") || h.includes("rating"));
        const correctIdx = headers.findIndex(h => h.includes("correta") || h.includes("correct"));
        const optionsIdx = headers.findIndex(h => h.includes("opções") || h.includes("options") || h.includes("opcoes"));

        if (textIdx === -1 || optionsIdx === -1 || correctIdx === -1) {
            setImportResults({ success: 0, errors: ["CSV deve conter colunas: Texto, Opções, Resposta Correta"] });
            return;
        }

        let success = 0;
        const errors: string[] = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 3) continue;

            const text = row[textIdx]?.trim();
            const category = catIdx >= 0 ? (row[catIdx]?.trim() || "CULTURA_GERAL") : "CULTURA_GERAL";
            const difficulty = diffIdx >= 0 ? parseInt(row[diffIdx]?.trim() || "2") : 2;
            const ageRating = ageIdx >= 0 ? parseInt(row[ageIdx]?.trim() || "18") : 18;
            const correctText = row[correctIdx]?.trim();
            const optionsStr = row[optionsIdx]?.trim() || "";
            const options = optionsStr.split("|").map(o => o.trim()).filter(o => o.length > 0);

            if (!text || options.length < 2) {
                errors.push(`Linha ${i + 1}: texto ou opções em falta`);
                continue;
            }

            const correctOption = options.findIndex(o => o.toLowerCase() === correctText.toLowerCase());
            if (correctOption === -1) {
                errors.push(`Linha ${i + 1}: resposta correta "${correctText}" não encontrada nas opções`);
                continue;
            }

            try {
                const { error } = await supabase.from("questions").insert({
                    text,
                    category: category.toUpperCase().replace(/\s+/g, "_"),
                    difficulty: isNaN(difficulty) ? 2 : Math.max(1, Math.min(3, difficulty)),
                    age_rating: isNaN(ageRating) ? 18 : ageRating,
                    options,
                    correct_option: correctOption,
                });

                if (error) {
                    errors.push(`Linha ${i + 1}: ${error.message}`);
                } else {
                    success++;
                }
            } catch (err: any) {
                errors.push(`Linha ${i + 1}: ${err.message}`);
            }
        }

        setImportResults({ success, errors });
        if (success > 0) {
            showToast(`Importadas ${success} perguntas com sucesso!`, "success");
            loadData();
        }
        e.target.value = "";
    };

    const startEdit = (q: Question & { age_rating?: number }) => {
        setFormData({
            text: q.text,
            category: q.category,
            difficulty: q.difficulty || 2,
            age_rating: q.age_rating || 12,
            options: q.options,
            correct_option: q.correct_option,
        });
        setEditId(q.id);
        setShowCreateForm(true);
    };

    const handleSaveQuestion = async () => {
        if (!formData.text.trim() || formData.options.some(o => !o.trim())) {
            showToast("Preenche todos os campos.", "error");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                text: formData.text.trim(),
                category: formData.category,
                difficulty: formData.difficulty,
                age_rating: formData.age_rating,
                options: formData.options,
                correct_option: formData.correct_option,
            };
            if (editId) {
                await supabase.from("questions").update(payload).eq("id", editId);
            } else {
                await supabase.from("questions").insert(payload);
            }
            resetForm();
            setShowCreateForm(false);
            loadData();
        } catch (err) {
            showToast("Erro ao guardar.", "error");
        } finally {
            setSaving(false);
        }
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
        if (selectedDifficulty !== "all" && q.difficulty !== Number(selectedDifficulty)) return false;
        if (searchQuery && !normalizeText(q.text).includes(normalizeText(searchQuery))) return false;
        return true;
    });

    const reportedQuestions = questions.filter(q => q.metadata?.reports && q.metadata.reports.length > 0);

    const RoleBadge = ({ role }: { role: string }) => {
        const colors: Record<string, string> = {
            [UserRole.ADMIN]: "bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30",
            [UserRole.MODERATOR]: "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30",
            [UserRole.HOST]: "bg-[#d0bcff]/20 text-[#d0bcff] border-[#d0bcff]/30",
        };
        const labels: Record<string, string> = {
            [UserRole.ADMIN]: "Administrador",
            [UserRole.MODERATOR]: "Moderador",
            [UserRole.HOST]: "Anfitrião",
        };
        return (
            <span className={`px-2 py-1 text-xs rounded border ${colors[role] || "bg-gray-500/20 text-gray-400"}`}>
                {labels[role] || role}
            </span>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d0bcff] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen relative overflow-x-hidden pb-20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
            </div>

            <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <Link href="/" className="text-xl font-bold text-white/60 hover:text-white transition-colors">
                        ←
                    </Link>
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-[#d0bcff]" />
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
                    <button onClick={() => { setShowReported(false); setShowDuplicates(false); setShowAddAdmin(false); setShowCategories(false); setShowImportCSV(false); }} className="px-6 py-3 rounded-xl bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30 text-sm font-medium whitespace-nowrap">
                        <Database className="w-4 h-4 inline mr-2" />
                        Perguntas ({questions.length})
                    </button>
                    <button onClick={() => { setShowDuplicates(true); setShowReported(false); setShowAddAdmin(false); setShowCategories(false); setShowImportCSV(false); handleScanDuplicates(); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Duplicados
                    </button>
                    <button onClick={() => { setShowReported(true); setShowDuplicates(false); setShowAddAdmin(false); setShowCategories(false); setShowImportCSV(false); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        Reportadas ({reportedQuestions.length})
                    </button>
                    <button onClick={() => { setShowAddAdmin(true); setShowReported(false); setShowDuplicates(false); setShowCategories(false); setShowImportCSV(false); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <Users className="w-4 h-4 inline mr-2" />
                        Equipa
                    </button>
                    <button onClick={() => { setShowCategories(!showCategories); setShowReported(false); setShowDuplicates(false); setShowAddAdmin(false); setShowImportCSV(false); }} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-sm font-medium hover:text-white whitespace-nowrap">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Categorias
                    </button>
                    <button onClick={() => { setShowCreateForm(true); resetForm(); setShowReported(false); setShowDuplicates(false); setShowAddAdmin(false); setShowCategories(false); setShowImportCSV(false); }} className="px-6 py-3 rounded-xl bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]/30 text-sm font-medium whitespace-nowrap">
                        <Plus className="w-4 h-4 inline mr-2" />
                        Nova Pergunta
                    </button>
                    <button onClick={() => { setShowImportCSV(true); setImportResults(null); setShowReported(false); setShowDuplicates(false); setShowAddAdmin(false); setShowCategories(false); }} className="px-6 py-3 rounded-xl bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]/30 text-sm font-medium hover:bg-[#4CAF50]/25 whitespace-nowrap">
                        <Plus className="w-4 h-4 inline mr-2" />
                        Importar CSV
                    </button>
                    <button onClick={exportToCSV} className="px-6 py-3 rounded-xl bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 text-sm font-medium hover:bg-[#FFD700]/25 whitespace-nowrap">
                        <Database className="w-4 h-4 inline mr-2" />
                        Exportar CSV
                    </button>
                    <button onClick={exportToCSV} className="px-6 py-3 rounded-xl bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 text-sm font-medium hover:bg-[#FFD700]/25 whitespace-nowrap">
                        <Database className="w-4 h-4 inline mr-2" />
                        Exportar CSV
                    </button>
                    <button onClick={() => { setShowImportCSV(true); setImportResults(null); }} className="px-6 py-3 rounded-xl bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]/30 text-sm font-medium hover:bg-[#4CAF50]/25 whitespace-nowrap">
                        <Plus className="w-4 h-4 inline mr-2" />
                        Importar CSV
                    </button>
                </div>

                {showAddAdmin && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#d0bcff]" />
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
                                <select value={newAdminRole} onChange={e => setNewAdminRole(e.target.value as UserRole)} className="glass-input">
                                    <option value={UserRole.MODERATOR}>Moderador</option>
                                    <option value={UserRole.ADMIN}>Administrador</option>
                                    <option value={UserRole.HOST}>Anfitrião</option>
                                </select>
                                <button onClick={addAdmin} className="px-6 py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold">
                                    Adicionar
                                </button>
                            </div>
                            <p className="text-white/40 text-xs mt-2">O utilizador precisa de ter conta criada primeiro.</p>
                        </div>
                    </motion.section>
                )}

                {showCategories && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-[#d0bcff]" />
                            Gestão de Categorias
                        </h2>
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="Nova categoria..."
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                className="flex-1 glass-input"
                            />
                            <button onClick={handleAddCategory} className="px-6 py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold">
                                Adicionar
                            </button>
                        </div>
                        <div className="space-y-2">
                            {stats.map(s => (
                                <div key={s.category} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <span className="text-white font-medium">{s.category}</span>
                                    <span className="text-white/40 text-sm">{s.count} perguntas</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {showImportCSV && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5 text-[#4CAF50]" />
                            Importar Perguntas (CSV)
                        </h2>
                        <p className="text-sm text-white/60 mb-4">
                            Ficheiro CSV com colunas: Texto, Categoria, Dificuldade, Idade, Resposta Correta, Opções (separadas por |).
                            Usa o mesmo formato do export.
                        </p>
                        <div className="flex flex-col gap-4">
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleImportCSV}
                                className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#d0bcff] file:text-[#121223] hover:file:bg-[#d0bcff]/80"
                            />
                            {importResults && (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-green-400 font-bold mb-2">
                                        ✅ {importResults.success} perguntas importadas
                                    </div>
                                    {importResults.errors.length > 0 && (
                                        <div className="mt-2">
                                            <div className="text-red-400 font-bold mb-1">Erros:</div>
                                            <ul className="text-sm text-white/60 space-y-1 max-h-40 overflow-y-auto">
                                                {importResults.errors.slice(0, 20).map((err, idx) => (
                                                    <li key={idx}>• {err}</li>
                                                ))}
                                                {importResults.errors.length > 20 && (
                                                    <li>... e mais {importResults.errors.length - 20} erros</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && !showCategories && !showImportCSV && (
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
                            <div className="text-3xl font-bold text-[#d0bcff]">{duplicateGroups.length}</div>
                            <div className="text-xs text-white/40 uppercase">Duplicados</div>
                        </div>
                    </section>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && (
                    <section className="flex gap-2 overflow-x-auto pb-2">
                        <button onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${selectedCategory === "all" ? "bg-[#d0bcff]/20 text-[#d0bcff]" : "bg-white/5 text-white/60"}`}>
                            Todas
                        </button>
                        {stats.map(s => (
                            <button key={s.category} onClick={() => { setSelectedCategory(s.category); setCurrentPage(1); }} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${selectedCategory === s.category ? "bg-[#d0bcff]/20 text-[#d0bcff]" : "bg-white/5 text-white/60"}`}>
                                {s.category} ({s.count})
                            </button>
                        ))}
                    </section>
                )}

                <section className="flex gap-2 overflow-x-auto pb-2">
                    {["all", "1", "2", "3"].map((d) => (
                        <button
                            key={d}
                            onClick={() => { setSelectedDifficulty(d); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${selectedDifficulty === d ? "bg-[#FFB0CD]/20 text-[#FFB0CD]" : "bg-white/5 text-white/60"}`}
                        >
                            {d === "all" ? "Todas Dificuldades" : d === "1" ? "Fácil" : d === "2" ? "Médio" : "Difícil"}
                        </button>
                    ))}
                </section>

                {showCreateForm && (
                    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border border-emerald-500/30">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                {editId ? <Edit2 className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
                                {editId ? "Editar Pergunta" : "Nova Pergunta"}
                            </h2>
                            <button onClick={() => { setShowCreateForm(false); resetForm(); }} className="text-white/40 hover:text-white p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-white/60 mb-1 block">Pergunta</label>
                                <textarea
                                    value={formData.text}
                                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full glass-input min-h-[80px] resize-y"
                                    placeholder="Escreve a pergunta aqui..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-1 block">Categoria</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full glass-input"
                                    >
                                        {stats.map(s => (
                                            <option key={s.category} value={s.category}>{s.category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-1 block">Dificuldade</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: Number(e.target.value) })}
                                        className="w-full glass-input"
                                    >
                                        <option value={1}>Fácil</option>
                                        <option value={2}>Médio</option>
                                        <option value={3}>Difícil</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">Opções de Resposta</label>
                                <div className="space-y-2">
                                    {formData.options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="correct_option"
                                                checked={formData.correct_option === idx}
                                                onChange={() => setFormData({ ...formData, correct_option: idx })}
                                                className="accent-emerald-500"
                                            />
                                            <span className="text-white/40 text-sm w-6">{idx + 1}.</span>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={e => {
                                                    const opts = [...formData.options];
                                                    opts[idx] = e.target.value;
                                                    setFormData({ ...formData, options: opts });
                                                }}
                                                className={`flex-1 glass-input ${idx === formData.correct_option ? "border-emerald-500/50" : ""}`}
                                                placeholder={`Opção ${idx + 1}${idx === 0 ? " (correta)" : ""}`}
                                            />
                                            {idx === formData.correct_option && (
                                                <span className="text-emerald-400 text-xs font-medium">Correta</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button onClick={() => { setShowCreateForm(false); resetForm(); }} className="px-6 py-3 bg-white/5 text-white/60 rounded-xl">
                                    Cancelar
                                </button>
                                <button onClick={handleSaveQuestion} disabled={saving} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-500 transition-colors">
                                    <Save className="w-4 h-4" />
                                    {saving ? "A guardar..." : editId ? "Guardar" : "Criar Pergunta"}
                                </button>
                            </div>
                        </div>
                    </motion.section>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && !showCreateForm && (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input type="text" placeholder="Pesquisar perguntas..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full glass-input pl-12" />
                    </div>
                )}

                {!showDuplicates && !showReported && !showAddAdmin && (
                    <section className="space-y-3">
                        {loading ? (
                            <div className="text-center py-12"><div className="w-8 h-8 border-2 border-[#d0bcff] border-t-transparent rounded-full animate-spin mx-auto" /></div>
                        ) : filteredQuestions.length === 0 ? (
                            <div className="glass-panel p-8 text-center text-white/50">Nenhuma pergunta encontrada</div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center text-sm text-white/50">
                                    <span>Mostrando {((currentPage - 1) * PAGE_SIZE) + 1}-{Math.min(currentPage * PAGE_SIZE, filteredQuestions.length)} de {filteredQuestions.length}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-white/10 disabled:opacity-30">← Anterior</button>
                                        <span className="px-3 py-1">{currentPage}/{Math.ceil(filteredQuestions.length / PAGE_SIZE)}</span>
                                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * PAGE_SIZE >= filteredQuestions.length} className="px-3 py-1 rounded bg-white/10 disabled:opacity-30">Próxima →</button>
                                    </div>
                                </div>
                                {filteredQuestions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(q => (
                            <div key={q.id} className="glass-panel p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-1">{q.text}</p>
                                        <div className="flex gap-2 text-xs text-white/40">
                                            <span className="bg-white/10 px-2 py-1 rounded">{q.category}</span>
                                            <span className="bg-white/10 px-2 py-1 rounded">
                                                {q.difficulty === 1 ? "Fácil" : q.difficulty === 3 ? "Difícil" : "Médio"}
                                            </span>
                                            <span className="bg-white/10 px-2 py-1 rounded">Resposta: {q.options[q.correct_option]}</span>
                                            {q.metadata?.reports && q.metadata.reports.length > 0 && (
                                                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">{q.metadata.reports.length} reportes</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => startEdit(q)} className="text-blue-400 hover:text-blue-300 p-2"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteQuestion(q.id)} className="text-pink-400 hover:text-pink-300 p-2"><Trash2 className="w-4 h-4" /></button>
                                    </div>
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
                            </>
                        )}
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
                                    <div className="text-xs text-white/40 mb-1">Reportes:</div>
                                    {q.metadata?.reports?.map((r, idx) => (
                                        <div key={idx} className="text-sm text-red-400">{r.reason} - {new Date(r.date).toLocaleDateString()}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </main>
    );
}