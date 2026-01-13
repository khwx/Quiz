export const PLAYER_COLORS = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#FFE66D", // Yellow
    "#A8E6CF", // Mint
    "#FF8B94", // Pink
    "#95E1D3", // Aqua
    "#F38181", // Coral
    "#AA96DA", // Purple
    "#FCBAD3", // Light Pink
    "#A8D8EA", // Sky Blue
    "#FFD93D", // Gold
    "#6BCF7F", // Green
    "#FF9A76", // Orange
    "#B4A7D6", // Lavender
    "#F7DC6F"  // Lemon
];

export function getRandomColor(): string {
    return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}

export function getColorByIndex(index: number): string {
    return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
