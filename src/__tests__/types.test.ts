import { describe, it, expect } from 'vitest';
import type {
  Game,
  Player,
  Question,
  Answer,
  Team,
  TeamMember,
  Tournament,
  TournamentTeam,
  Profile,
  GameSettings,
  TournamentSettings,
  PlayerStats,
  AnswerSummary,
  TeamWithMembers,
  TournamentWithTeams,
} from '@/types';

describe('Type definitions', () => {
  it('should create a valid Game object', () => {
    const game: Game = {
      id: 'test-id',
      pin: '123456',
      status: 'LOBBY',
      current_question_index: 0,
      settings: { timer: 20, question_count: 10 },
      created_at: new Date().toISOString(),
    };
    expect(game.status).toBe('LOBBY');
    expect(game.pin).toBe('123456');
  });

  it('should create a valid Player object', () => {
    const player: Player = {
      id: 'player-id',
      game_id: 'game-id',
      name: 'TestPlayer',
      score: 100,
      avatar: '🎮',
      color: '#FF6B6B',
      is_host: false,
      joined_at: new Date().toISOString(),
    };
    expect(player.score).toBe(100);
    expect(player.is_host).toBe(false);
  });

  it('should create a valid TeamWithMembers object', () => {
    const team: TeamWithMembers = {
      id: 'team-id',
      name: 'Os QuizMasters',
      pin: 'ABC123',
      max_members: 4,
      is_active: true,
      total_score: 0,
      created_at: new Date().toISOString(),
      team_members: [
        {
          id: 'member-id',
          team_id: 'team-id',
          user_id: 'user-id',
          role: 'host',
          joined_at: new Date().toISOString(),
          profiles: { id: 'user-id', username: 'TestUser', avatar: '🎮' },
        },
      ],
    };
    expect(team.team_members).toHaveLength(1);
    expect(team.team_members[0].role).toBe('host');
    expect(team.team_members[0].profiles?.username).toBe('TestUser');
  });

  it('should create a valid TournamentWithTeams object', () => {
    const tournament: TournamentWithTeams = {
      id: 'tournament-id',
      name: 'Campeonato',
      pin: 'XYZ789',
      status: 'QUALIFYING',
      max_teams: 8,
      current_round: 1,
      settings: { timer: 20, questions: 10 },
      created_at: new Date().toISOString(),
      tournament_teams: [
        {
          id: 'tt-id',
          tournament_id: 'tournament-id',
          team_id: 'team-id',
          score: 250,
          rank: 1,
          joined_at: new Date().toISOString(),
          teams: { id: 'team-id', name: 'Os Masters', pin: 'ABC123' },
        },
      ],
    };
    expect(tournament.status).toBe('QUALIFYING');
    expect(tournament.tournament_teams[0].score).toBe(250);
    expect(tournament.tournament_teams[0].teams?.name).toBe('Os Masters');
  });
});
