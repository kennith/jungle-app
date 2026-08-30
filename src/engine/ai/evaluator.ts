import { Piece, Player, Position } from '../../types/game';
import { DEN_POSITIONS, isRiver, BOARD_COLS, BOARD_ROWS } from '../../constants/board';
import { isInOpponentTrap } from '../rules';

export const PIECE_VALUES: Record<number, number> = {
  8: 1100, // Elephant
  7: 900,  // Lion
  6: 800,  // Tiger
  5: 500,  // Leopard
  4: 400,  // Wolf
  3: 300,  // Dog
  2: 200,  // Cat
  1: 650,  // Rat (crucial for hunting Elephant and river control)
};

/**
 * Heuristic evaluation of the board from perspective of `maximizingPlayer`
 * Positive score favors `maximizingPlayer`, negative favors opponent.
 */
export function evaluateBoard(board: (Piece | null)[][], maximizingPlayer: Player): number {
  const minimizingPlayer: Player = maximizingPlayer === 'red' ? 'blue' : 'red';
  const maxDen = DEN_POSITIONS[minimizingPlayer]; // Target den to capture
  const minDen = DEN_POSITIONS[maximizingPlayer]; // Own den to defend

  let maxScore = 0;
  let minScore = 0;

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const pos: Position = { col: c, row: r };
      const isMax = piece.player === maximizingPlayer;
      const baseValue = PIECE_VALUES[piece.rank] || 100;

      // 1. Material Value
      let pieceScore = baseValue;

      // 2. Den Proximity Bonus
      const targetDen = isMax ? maxDen : minDen;
      const distToDen = Math.abs(pos.col - targetDen.col) + Math.abs(pos.row - targetDen.row);
      
      // The closer to opponent den, the more threatening (progressive bonus)
      const proximityWeight = piece.rank >= 5 ? 35 : 20;
      pieceScore += (12 - distToDen) * proximityWeight;

      // Dangerously close to opponent den
      if (distToDen === 1) {
        pieceScore += 450; // On trap next to den
      } else if (distToDen === 2) {
        pieceScore += 180;
      }

      // 3. Trap Penalty / Danger
      if (isInOpponentTrap(pos, piece.player)) {
        pieceScore -= 250; // Vulnerable: rank drops to 0
      }

      // 4. Special positional heuristics
      if (piece.type === 'rat') {
        if (isRiver(pos)) {
          pieceScore += 80; // Rat has water control & safety from land attacks
        }
      }

      if (piece.type === 'lion' || piece.type === 'tiger') {
        // High rank jumpers near river edge get extra mobility score
        if ((r === 2 || r === 6) && (c === 1 || c === 2 || c === 4 || c === 5)) {
          pieceScore += 40;
        }
      }

      // Add to respective player score
      if (isMax) {
        maxScore += pieceScore;
      } else {
        minScore += pieceScore;
      }
    }
  }

  return maxScore - minScore;
}
