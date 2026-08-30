export type AnimalType = 
  | 'rat' 
  | 'cat' 
  | 'dog' 
  | 'wolf' 
  | 'leopard' 
  | 'tiger' 
  | 'lion' 
  | 'elephant';

export type Player = 'red' | 'blue';

export interface Piece {
  id: string;
  type: AnimalType;
  rank: number; // 1 (Rat) to 8 (Elephant)
  player: Player;
}

export interface Position {
  col: number; // 0 to 6
  row: number; // 0 to 8
}

export type TerrainType = 'land' | 'river' | 'trap' | 'den';

export interface CellInfo {
  col: number;
  row: number;
  terrain: TerrainType;
  owner?: Player; // For traps and dens
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece | null;
  isJump?: boolean;
  isIntoOpponentTrap?: boolean;
  isDenEntry?: boolean;
  notationEn?: string;
  notationZh?: string;
  timestamp?: number;
}

export type WinReason = 'den_capture' | 'elimination' | 'no_moves' | 'surrender';

export interface GameState {
  board: (Piece | null)[][]; // 9 rows (0..8) x 7 cols (0..6)
  currentTurn: Player;
  winner: Player | 'draw' | null;
  isGameOver: boolean;
  winReason?: WinReason;
  moveHistory: Move[];
  capturedPieces: {
    red: Piece[];
    blue: Piece[];
  };
  selectedPosition: Position | null;
  validMoves: Position[];
  lastMove: Move | null;
  isAiThinking: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'pve' | 'pvp' | 'eve';
export type Language = 'en' | 'zh-TW';
