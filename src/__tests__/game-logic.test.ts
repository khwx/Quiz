import { describe, it, expect } from 'vitest';

// Test the points calculation logic used in api/answer/route.ts
function calculatePoints(timeTaken: number, timerDuration: number): number {
  if (timeTaken <= 0) return 0;
  const maxPoints = 1000;
  const timeRatio = Math.max(0, 1 - timeTaken / timerDuration);
  return Math.round(maxPoints * (0.5 + 0.5 * timeRatio));
}

describe('Points Calculation', () => {
  it('should give max points for instant answer', () => {
    const points = calculatePoints(0.1, 20);
    expect(points).toBeGreaterThan(900);
  });

  it('should give ~750 points at halfway (50% base + 25% time bonus)', () => {
    const points = calculatePoints(10, 20);
    expect(points).toBe(750);
  });

  it('should give ~500 points at time up (50% base, ~0% time bonus)', () => {
    const points = calculatePoints(19.9, 20);
    expect(points).toBeGreaterThanOrEqual(500);
    expect(points).toBeLessThanOrEqual(510);
  });

  it('should return 0 for invalid time', () => {
    expect(calculatePoints(-1, 20)).toBe(0);
    expect(calculatePoints(0, 20)).toBe(0);
  });
});

// Test the PIN generation logic
function generateGamePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateTeamPin(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
}

describe('PIN Generation', () => {
  it('should generate 6-digit game PIN', () => {
    const pin = generateGamePin();
    expect(pin).toHaveLength(6);
    expect(Number(pin)).toBeGreaterThan(99999);
    expect(Number(pin)).toBeLessThan(1000000);
  });

  it('should generate team PIN of correct length', () => {
    expect(generateTeamPin(6)).toHaveLength(6);
    expect(generateTeamPin(4)).toHaveLength(4);
  });

  it('should not contain ambiguous characters in team PIN', () => {
    const ambiguous = ['I', 'O', '0', '1'];
    for (let i = 0; i < 100; i++) {
      const pin = generateTeamPin();
      for (const char of ambiguous) {
        expect(pin).not.toContain(char);
      }
    }
  });
});

// Test status labels
const statusLabels: Record<string, string> = {
  LOBBY: 'Aguardando',
  QUALIFYING: 'Qualificação',
  FINAL: 'Final',
  FINISHED: 'Finalizado',
};

describe('Tournament Status Labels', () => {
  it('should have labels for all statuses', () => {
    expect(statusLabels.LOBBY).toBe('Aguardando');
    expect(statusLabels.QUALIFYING).toBe('Qualificação');
    expect(statusLabels.FINAL).toBe('Final');
    expect(statusLabels.FINISHED).toBe('Finalizado');
  });
});

// Test text normalization (from admin)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

describe('Text Normalization', () => {
  it('should lowercase and remove accents', () => {
    expect(normalizeText('Café')).toBe('cafe');
    expect(normalizeText('SÃO PAULO')).toBe('sao paulo');
  });

  it('should remove special characters', () => {
    expect(normalizeText('Hello! How are you?')).toBe('hello how are you');
  });

  it('should handle empty strings', () => {
    expect(normalizeText('')).toBe('');
  });
});
