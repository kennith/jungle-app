import { AnimalType, CellInfo, Piece, Player, Position } from '../types/game';

export const BOARD_COLS = 7;
export const BOARD_ROWS = 9;

export interface AnimalMeta {
  type: AnimalType;
  rank: number;
  nameEn: string;
  nameZh: string;
  charZh: string;
  emoji: string;
  avatarSvg?: string;
  descriptionEn: string;
  descriptionZh: string;
}

export const ANIMALS: Record<AnimalType, AnimalMeta> = {
  elephant: {
    type: 'elephant',
    rank: 8,
    nameEn: 'Elephant',
    nameZh: '象',
    charZh: '象',
    emoji: '🐘',
    descriptionEn: 'The strongest animal (Rank 8). Can capture any animal except the Rat. Cannot capture a Rat in any situation.',
    descriptionZh: '最強的動物（8級）。可吃1-8級所有動物，唯獨不能吃鼠。',
  },
  lion: {
    type: 'lion',
    rank: 7,
    nameEn: 'Lion',
    nameZh: '獅',
    charZh: '獅',
    emoji: '🦁',
    descriptionEn: 'Rank 7. Can jump over the river horizontally or vertically if not blocked by a Rat.',
    descriptionZh: '第7級。可橫向或縱向跳過小河（若河道中有鼠則被阻擋）。',
  },
  tiger: {
    type: 'tiger',
    rank: 6,
    nameEn: 'Tiger',
    nameZh: '虎',
    charZh: '虎',
    emoji: '🐯',
    descriptionEn: 'Rank 6. Can jump over the river horizontally or vertically if not blocked by a Rat.',
    descriptionZh: '第6級。可橫向或縱向跳過小河（若河道中有鼠則被阻擋）。',
  },
  leopard: {
    type: 'leopard',
    rank: 5,
    nameEn: 'Leopard',
    nameZh: '豹',
    charZh: '豹',
    emoji: '🐆',
    descriptionEn: 'Rank 5. Moves 1 step orthogonally. Can capture rank 1-5.',
    descriptionZh: '第5級。常規直線行走1步，可吃1-5級動物。',
  },
  wolf: {
    type: 'wolf',
    rank: 4,
    nameEn: 'Wolf',
    nameZh: '狼',
    charZh: '狼',
    emoji: '🐺',
    descriptionEn: 'Rank 4. Moves 1 step orthogonally. Can capture rank 1-4.',
    descriptionZh: '第4級。常規直線行走1步，可吃1-4級動物。',
  },
  dog: {
    type: 'dog',
    rank: 3,
    nameEn: 'Dog',
    nameZh: '狗',
    charZh: '狗',
    emoji: '🐶',
    descriptionEn: 'Rank 3. Moves 1 step orthogonally. Can capture rank 1-3.',
    descriptionZh: '第3級。常規直線行走1步，可吃1-3級動物。',
  },
  cat: {
    type: 'cat',
    rank: 2,
    nameEn: 'Cat',
    nameZh: '貓',
    charZh: '貓',
    emoji: '🐱',
    descriptionEn: 'Rank 2. Moves 1 step orthogonally. Can capture rank 1-2.',
    descriptionZh: '第2級。常規直線行走1步，可吃1-2級動物。',
  },
  rat: {
    type: 'rat',
    rank: 1,
    nameEn: 'Rat',
    nameZh: '鼠',
    charZh: '鼠',
    emoji: '🐭',
    descriptionEn: 'Rank 1. Only animal that can swim in the river. Can capture Elephant on land, but cannot attack while in water.',
    descriptionZh: '第1級。唯一可進入河水中的動物。在陸地上可吃象，但在水中不能攻擊陸地上的動物。',
  },
};

export const DEN_POSITIONS: Record<Player, Position> = {
  blue: { col: 3, row: 0 },
  red: { col: 3, row: 8 },
};

export const TRAP_POSITIONS: Record<Player, Position[]> = {
  blue: [
    { col: 2, row: 0 },
    { col: 4, row: 0 },
    { col: 3, row: 1 },
  ],
  red: [
    { col: 2, row: 8 },
    { col: 4, row: 8 },
    { col: 3, row: 7 },
  ],
};

export const RIVER_SQUARES: Position[] = [
  // Left River (cols 1,2, rows 3,4,5)
  { col: 1, row: 3 }, { col: 1, row: 4 }, { col: 1, row: 5 },
  { col: 2, row: 3 }, { col: 2, row: 4 }, { col: 2, row: 5 },
  // Right River (cols 4,5, rows 3,4,5)
  { col: 4, row: 3 }, { col: 4, row: 4 }, { col: 4, row: 5 },
  { col: 5, row: 3 }, { col: 5, row: 4 }, { col: 5, row: 5 },
];

export function isRiver(pos: Position): boolean {
  return (
    (pos.col === 1 || pos.col === 2 || pos.col === 4 || pos.col === 5) &&
    (pos.row >= 3 && pos.row <= 5)
  );
}

export function isDen(pos: Position): { isDen: boolean; owner?: Player } {
  if (pos.col === DEN_POSITIONS.blue.col && pos.row === DEN_POSITIONS.blue.row) {
    return { isDen: true, owner: 'blue' };
  }
  if (pos.col === DEN_POSITIONS.red.col && pos.row === DEN_POSITIONS.red.row) {
    return { isDen: true, owner: 'red' };
  }
  return { isDen: false };
}

export function isTrap(pos: Position): { isTrap: boolean; owner?: Player } {
  if (TRAP_POSITIONS.blue.some(p => p.col === pos.col && p.row === pos.row)) {
    return { isTrap: true, owner: 'blue' };
  }
  if (TRAP_POSITIONS.red.some(p => p.col === pos.col && p.row === pos.row)) {
    return { isTrap: true, owner: 'red' };
  }
  return { isTrap: false };
}

export function getCellInfo(col: number, row: number): CellInfo {
  const pos = { col, row };
  const denInfo = isDen(pos);
  if (denInfo.isDen) {
    return { col, row, terrain: 'den', owner: denInfo.owner };
  }
  const trapInfo = isTrap(pos);
  if (trapInfo.isTrap) {
    return { col, row, terrain: 'trap', owner: trapInfo.owner };
  }
  if (isRiver(pos)) {
    return { col, row, terrain: 'river' };
  }
  return { col, row, terrain: 'land' };
}

export const INITIAL_PIECES_SETUP: { piece: Piece; position: Position }[] = [
  // --- BLUE (TOP / COMPUTER) ---
  { piece: { id: 'blue_lion', type: 'lion', rank: 7, player: 'blue' }, position: { col: 0, row: 0 } },
  { piece: { id: 'blue_tiger', type: 'tiger', rank: 6, player: 'blue' }, position: { col: 6, row: 0 } },
  { piece: { id: 'blue_dog', type: 'dog', rank: 3, player: 'blue' }, position: { col: 1, row: 1 } },
  { piece: { id: 'blue_cat', type: 'cat', rank: 2, player: 'blue' }, position: { col: 5, row: 1 } },
  { piece: { id: 'blue_rat', type: 'rat', rank: 1, player: 'blue' }, position: { col: 0, row: 2 } },
  { piece: { id: 'blue_leopard', type: 'leopard', rank: 5, player: 'blue' }, position: { col: 2, row: 2 } },
  { piece: { id: 'blue_wolf', type: 'wolf', rank: 4, player: 'blue' }, position: { col: 4, row: 2 } },
  { piece: { id: 'blue_elephant', type: 'elephant', rank: 8, player: 'blue' }, position: { col: 6, row: 2 } },

  // --- RED (BOTTOM / HUMAN) ---
  { piece: { id: 'red_elephant', type: 'elephant', rank: 8, player: 'red' }, position: { col: 0, row: 6 } },
  { piece: { id: 'red_wolf', type: 'wolf', rank: 4, player: 'red' }, position: { col: 2, row: 6 } },
  { piece: { id: 'red_leopard', type: 'leopard', rank: 5, player: 'red' }, position: { col: 4, row: 6 } },
  { piece: { id: 'red_rat', type: 'rat', rank: 1, player: 'red' }, position: { col: 6, row: 6 } },
  { piece: { id: 'red_cat', type: 'cat', rank: 2, player: 'red' }, position: { col: 1, row: 7 } },
  { piece: { id: 'red_dog', type: 'dog', rank: 3, player: 'red' }, position: { col: 5, row: 7 } },
  { piece: { id: 'red_tiger', type: 'tiger', rank: 6, player: 'red' }, position: { col: 0, row: 8 } },
  { piece: { id: 'red_lion', type: 'lion', rank: 7, player: 'red' }, position: { col: 6, row: 8 } },
];

export function getStartingSquareWatermark(col: number, row: number): { charZh: string; nameEn: string; emoji: string } | null {
  const match = INITIAL_PIECES_SETUP.find(s => s.position.col === col && s.position.row === row);
  if (match) {
    const meta = ANIMALS[match.piece.type];
    return { charZh: meta.charZh, nameEn: meta.nameEn, emoji: meta.emoji };
  }
  return null;
}
