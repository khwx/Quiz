"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, ArrowRight, Loader2 } from "lucide-react";

interface BracketTeam {
  id: string;
  name: string;
  score?: number;
  eliminated?: boolean;
}

interface BracketMatch {
  id: string;
  round: number;
  position: number;
  team1?: BracketTeam;
  team2?: BracketTeam;
  winner?: string;
  isBye?: boolean;
}

interface TournamentBracketProps {
  teams: BracketTeam[];
  currentRound: number;
  totalRounds: number;
  matches: BracketMatch[];
}

function getRoundName(round: number, totalRounds: number): string {
  const remaining = totalRounds - round;
  if (remaining === 0) return "Final";
  if (remaining === 1) return "Meias-Finais";
  if (remaining === 2) return "Quartos de Final";
  return `Ronda ${round}`;
}

function getMatchStatus(match: BracketMatch): "pending" | "active" | "finished" {
  if (!match.team1 || !match.team2) return "pending";
  if (match.winner) return "finished";
  return "active";
}

function BracketMatchCard({ match, round, totalRounds }: { match: BracketMatch; round: number; totalRounds: number }) {
  const status = getMatchStatus(match);
  const isFinal = round === totalRounds;
  const isSemiFinal = round === totalRounds - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-xl border overflow-hidden min-w-[160px] ${
        isFinal
          ? "border-[#FFD700]/40 bg-[#FFD700]/5"
          : isSemiFinal
            ? "border-[#FFB0CD]/30 bg-[#FFB0CD]/5"
            : "border-white/10 bg-white/5"
      }`}
    >
      {isFinal && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFB0CD]" />
      )}

      <div className="p-2 space-y-1">
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-1.5 rounded-lg ${
          match.winner === match.team1?.id
            ? "bg-[#FFD700]/10 text-[#FFD700]"
            : match.team1?.eliminated
              ? "bg-white/5 text-[#e3e0f9]/30 line-through"
              : "bg-white/5 text-[#e3e0f9]"
        }`}>
          <div className="flex items-center gap-1.5 min-w-0">
            {match.winner === match.team1?.id && <Crown className="w-3 h-3 text-[#FFD700] shrink-0" />}
            <span className="text-xs font-bold truncate">{match.team1?.name || "TBD"}</span>
          </div>
          {match.team1?.score !== undefined && (
            <span className="text-xs font-mono font-bold ml-2">{match.team1.score}</span>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-1 px-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[8px] text-[#e3e0f9]/30 font-bold">VS</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between p-1.5 rounded-lg ${
          match.winner === match.team2?.id
            ? "bg-[#FFD700]/10 text-[#FFD700]"
            : match.team2?.eliminated
              ? "bg-white/5 text-[#e3e0f9]/30 line-through"
              : "bg-white/5 text-[#e3e0f9]"
        }`}>
          <div className="flex items-center gap-1.5 min-w-0">
            {match.winner === match.team2?.id && <Crown className="w-3 h-3 text-[#FFD700] shrink-0" />}
            <span className="text-xs font-bold truncate">{match.team2?.name || "TBD"}</span>
          </div>
          {match.team2?.score !== undefined && (
            <span className="text-xs font-mono font-bold ml-2">{match.team2.score}</span>
          )}
        </div>
      </div>

      {/* Status badge */}
      {status === "active" && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full animate-pulse" />
      )}
    </motion.div>
  );
}

export default function TournamentBracket({ teams, currentRound, totalRounds, matches }: TournamentBracketProps) {
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);
  const matchesByRound = rounds.map((round) =>
    matches.filter((m) => m.round === round).sort((a, b) => a.position - b.position)
  );

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-start gap-4 min-w-max">
        {rounds.map((round, roundIdx) => (
          <div key={round} className="flex flex-col items-center gap-2">
            {/* Round label */}
            <div className="text-center mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                round === totalRounds ? "text-[#FFD700]" : "text-[#e3e0f9]/50"
              }`}>
                {getRoundName(round, totalRounds)}
              </span>
            </div>

            {/* Matches */}
            <div className={`flex flex-col gap-4 ${roundIdx > 0 ? "mt-8" : ""}`}
              style={{ marginTop: roundIdx > 0 ? `${Math.pow(2, roundIdx - 1) * 40}px` : undefined }}
            >
              {matchesByRound[roundIdx].length > 0 ? (
                matchesByRound[roundIdx].map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    round={round}
                    totalRounds={totalRounds}
                  />
                ))
              ) : (
                <div className="min-w-[160px] h-[80px] border border-dashed border-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-[#e3e0f9]/30">A definir</span>
                </div>
              )}
            </div>

            {/* Connector arrows */}
            {roundIdx < totalRounds - 1 && (
              <div className="hidden lg:flex items-center ml-2">
                <ArrowRight className="w-4 h-4 text-white/20" />
              </div>
            )}
          </div>
        ))}

        {/* Trophy at the end */}
        <div className="flex flex-col items-center gap-2 ml-4">
          <div className="text-center mb-2">
            <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">Campeão</span>
          </div>
          <div className="w-[160px] h-[80px] border-2 border-[#FFD700]/30 bg-[#FFD700]/5 rounded-xl flex items-center justify-center"
            style={{ marginTop: `${Math.pow(2, totalRounds - 1) * 40}px` }}
          >
            <Trophy className="w-8 h-8 text-[#FFD700]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
