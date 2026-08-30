import { describe, it, expect } from 'vitest';
import { createInitialBoard } from '../boardState';
import { canCapture, checkGameStatus, getValidMovesForPiece, makeMove } from '../rules';
import { Piece } from '../../types/game';
import { getBestAiMove } from '../ai/minimax';

describe('Jungle (Dou Shou Qi) Rule Engine', () => {
  it('should initialize board with 16 pieces symmetrically', () => {
    const board = createInitialBoard();
    let redCount = 0;
    let blueCount = 0;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 7; c++) {
        const piece = board[r][c];
        if (piece) {
          if (piece.player === 'red') redCount++;
          if (piece.player === 'blue') blueCount++;
        }
      }
    }

    expect(redCount).toBe(8);
    expect(blueCount).toBe(8);

    // Check Blue starting pieces
    expect(board[0][0]?.type).toBe('lion');
    expect(board[0][6]?.type).toBe('tiger');
    expect(board[2][0]?.type).toBe('rat');
    expect(board[2][6]?.type).toBe('elephant');

    // Check Red starting pieces
    expect(board[8][0]?.type).toBe('tiger');
    expect(board[8][6]?.type).toBe('lion');
    expect(board[6][0]?.type).toBe('elephant');
    expect(board[6][6]?.type).toBe('rat');
  });

  it('should prevent pieces from entering their own Den', () => {
    const board: (Piece | null)[][] = Array.from({ length: 9 }, () => Array(7).fill(null));
    // Red piece adjacent to Red den (at col 3, row 8)
    board[7][3] = { id: 'red_cat', type: 'cat', rank: 2, player: 'red' };

    const validMoves = getValidMovesForPiece(board, { col: 3, row: 7 });
    // Moving down to (3, 8) is own den -> must NOT be in valid moves
    const entersOwnDen = validMoves.some(m => m.col === 3 && m.row === 8);
    expect(entersOwnDen).toBe(false);
  });

  it('should allow pieces to enter opponent Den and trigger win', () => {
    const board: (Piece | null)[][] = Array.from({ length: 9 }, () => Array(7).fill(null));
    // Red piece adjacent to Blue den (at col 3, row 0)
    board[1][3] = { id: 'red_cat', type: 'cat', rank: 2, player: 'red' };

    const validMoves = getValidMovesForPiece(board, { col: 3, row: 1 });
    // Moving up to (3, 0) is Blue den -> MUST be valid
    const entersEnemyDen = validMoves.some(m => m.col === 3 && m.row === 0);
    expect(entersEnemyDen).toBe(true);

    const move = {
      from: { col: 3, row: 1 },
      to: { col: 3, row: 0 },
      piece: board[1][3]!,
    };
    const nextBoard = makeMove(board, move);
    const status = checkGameStatus(nextBoard, move, 'blue');
    expect(status.isGameOver).toBe(true);
    expect(status.winner).toBe('red');
    expect(status.reason).toBe('den_capture');
  });

  it('should allow only Rat to enter water squares', () => {
    const board: (Piece | null)[][] = Array.from({ length: 9 }, () => Array(7).fill(null));
    // Rat at (col 1, row 2) adjacent to Left River (col 1, row 3)
    board[2][1] = { id: 'red_rat', type: 'rat', rank: 1, player: 'red' };
    // Dog at (col 2, row 2) adjacent to Left River (col 2, row 3)
    board[2][2] = { id: 'red_dog', type: 'dog', rank: 3, player: 'red' };

    const ratMoves = getValidMovesForPiece(board, { col: 1, row: 2 });
    const dogMoves = getValidMovesForPiece(board, { col: 2, row: 2 });

    expect(ratMoves.some(m => m.col === 1 && m.row === 3)).toBe(true); // Rat can enter water
    expect(dogMoves.some(m => m.col === 2 && m.row === 3)).toBe(false); // Dog cannot enter water
  });

  it('should allow Lion and Tiger to jump across rivers vertically and horizontally', () => {
    const board: (Piece | null)[][] = Array.from({ length: 9 }, () => Array(7).fill(null));
    // Lion at (col 1, row 2) ready to jump vertically down to (col 1, row 6)
    board[2][1] = { id: 'blue_lion', type: 'lion', rank: 7, player: 'blue' };
    // Tiger at (col 0, row 4) ready to jump horizontally to (col 3, row 4)
    board[4][0] = { id: 'red_tiger', type: 'tiger', rank: 6, player: 'red' };

    const lionMoves = getValidMovesForPiece(board, { col: 1, row: 2 });
    const tigerMoves = getValidMovesForPiece(board, { col: 0, row: 4 });

    expect(lionMoves.some(m => m.col === 1 && m.row === 6)).toBe(true);
    expect(tigerMoves.some(m => m.col === 3 && m.row === 4)).toBe(true);
  });

  it('should block Lion/Tiger river jumps if any Rat is in the intervening water path', () => {
    const board: (Piece | null)[][] = Array.from({ length: 9 }, () => Array(7).fill(null));
    board[2][1] = { id: 'blue_lion', type: 'lion', rank: 7, player: 'blue' };
    // Place a rat in the river at (col 1, row 4)
    board[4][1] = { id: 'red_rat', type: 'rat', rank: 1, player: 'red' };

    const lionMoves = getValidMovesForPiece(board, { col: 1, row: 2 });
    // Jump to (1, 6) should now be BLOCKED
    expect(lionMoves.some(m => m.col === 1 && m.row === 6)).toBe(false);
  });

  it('should respect Rat vs Elephant capture rules', () => {
    const rat: Piece = { id: 'red_rat', type: 'rat', rank: 1, player: 'red' };
    const elephant: Piece = { id: 'blue_elephant', type: 'elephant', rank: 8, player: 'blue' };

    // Land vs Land: Rat captures Elephant
    expect(canCapture(rat, { col: 0, row: 6 }, elephant, { col: 0, row: 5 })).toBe(true);
    // Land vs Land: Elephant CANNOT capture Rat
    expect(canCapture(elephant, { col: 0, row: 5 }, rat, { col: 0, row: 6 })).toBe(false);

    // Rat in river (col 1, row 3) cannot attack Elephant on land (col 1, row 2)
    expect(canCapture(rat, { col: 1, row: 3 }, elephant, { col: 1, row: 2 })).toBe(false);
    // Elephant on land cannot attack Rat in water
    expect(canCapture(elephant, { col: 1, row: 2 }, rat, { col: 1, row: 3 })).toBe(false);
  });

  it('should reduce piece rank to 0 in opponent trap so any piece can capture it', () => {
    const elephant: Piece = { id: 'blue_elephant', type: 'elephant', rank: 8, player: 'blue' };
    const cat: Piece = { id: 'red_cat', type: 'cat', rank: 2, player: 'red' };

    // Red trap is at (col 2, row 8), which is opponent trap for Blue elephant
    // Cat (rank 2) attacking Blue Elephant (rank 8) trapped in Red's trap
    const isTrapped = canCapture(cat, { col: 1, row: 8 }, elephant, { col: 2, row: 8 });
    expect(isTrapped).toBe(true);
  });

  it('AI should recognize immediate winning move into enemy den', async () => {
    const board: (Piece | null)[][] = Array.from({ length: 9 }, () => Array(7).fill(null));
    // Blue Lion at (col 3, row 7) one step from Red Den (col 3, row 8)
    board[7][3] = { id: 'blue_lion', type: 'lion', rank: 7, player: 'blue' };

    const bestMove = await getBestAiMove(board, 'blue', 'hard', null);
    expect(bestMove).not.toBeNull();
    expect(bestMove?.to.col).toBe(3);
    expect(bestMove?.to.row).toBe(8); // Enters Red den to win
  });
});
