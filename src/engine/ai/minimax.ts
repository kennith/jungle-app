import { Difficulty, Move, Piece, Player } from '../../types/game';
import { getAllLegalMoves, makeMove, checkGameStatus } from '../rules';
import { evaluateBoard } from './evaluator';

const WIN_SCORE = 100000;
const LOSE_SCORE = -100000;

/**
 * Order moves to maximize Alpha-Beta pruning efficiency:
 * 1. Den infiltration moves (instant win)
 * 2. High value captures (capturing high rank piece with lower rank)
 * 3. River jumps
 * 4. Other moves
 */
function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    // 1. Direct den win first
    if (a.isDenEntry) return -1;
    if (b.isDenEntry) return 1;

    // 2. Captures prioritized by victim value - attacker value
    const valA = a.capturedPiece ? a.capturedPiece.rank * 10 - a.piece.rank : 0;
    const valB = b.capturedPiece ? b.capturedPiece.rank * 10 - b.piece.rank : 0;
    if (valA !== valB) return valB - valA;

    // 3. Jumps
    if (a.isJump && !b.isJump) return -1;
    if (!a.isJump && b.isJump) return 1;

    return 0;
  });
}

/**
 * Minimax with Alpha-Beta Pruning
 */
function minimax(
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  lastMove: Move | null
): { score: number; bestMove: Move | null } {
  const currentPlayer: Player = isMaximizing ? aiPlayer : (aiPlayer === 'red' ? 'blue' : 'red');

  // Check terminal state
  const status = checkGameStatus(board, lastMove, currentPlayer);
  if (status.isGameOver) {
    if (status.winner === aiPlayer) {
      return { score: WIN_SCORE + depth, bestMove: null };
    } else if (status.winner) {
      return { score: LOSE_SCORE - depth, bestMove: null };
    } else {
      return { score: 0, bestMove: null };
    }
  }

  // Leaf node
  if (depth === 0) {
    return { score: evaluateBoard(board, aiPlayer), bestMove: null };
  }

  const legalMoves = getAllLegalMoves(board, currentPlayer);
  if (legalMoves.length === 0) {
    return { score: isMaximizing ? LOSE_SCORE - depth : WIN_SCORE + depth, bestMove: null };
  }

  const orderedMoves = orderMoves(legalMoves);
  let bestMove: Move | null = orderedMoves[0] || null;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const nextBoard = makeMove(board, move);
      const evalResult = minimax(nextBoard, depth - 1, alpha, beta, false, aiPlayer, move);

      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break; // Beta cut-off
    }
    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const nextBoard = makeMove(board, move);
      const evalResult = minimax(nextBoard, depth - 1, alpha, beta, true, aiPlayer, move);

      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return { score: minEval, bestMove };
  }
}

/**
 * Finds the best move for AI given a difficulty level
 */
export async function getBestAiMove(
  board: (Piece | null)[][],
  aiPlayer: Player,
  difficulty: Difficulty,
  lastMove: Move | null
): Promise<Move | null> {
  const legalMoves = getAllLegalMoves(board, aiPlayer);
  if (legalMoves.length === 0) return null;

  // Check if any move immediately wins by capturing den
  const instantWinMove = legalMoves.find(m => m.isDenEntry);
  if (instantWinMove) return instantWinMove;

  // Add small artificial delay so computer move feels natural
  await new Promise(resolve => setTimeout(resolve, 350));

  if (difficulty === 'easy') {
    // Easy: depth 1 with 30% randomness among top moves
    const rankedMoves: { move: Move; score: number }[] = [];
    for (const move of legalMoves) {
      const nextBoard = makeMove(board, move);
      const score = evaluateBoard(nextBoard, aiPlayer);
      rankedMoves.push({ move, score });
    }
    rankedMoves.sort((a, b) => b.score - a.score);

    // Pick randomly from top 3 moves
    const topChoices = rankedMoves.slice(0, Math.min(3, rankedMoves.length));
    const chosen = topChoices[Math.floor(Math.random() * topChoices.length)];
    return chosen.move;
  }

  if (difficulty === 'medium') {
    // Medium: depth 3 search
    const result = minimax(board, 3, -Infinity, Infinity, true, aiPlayer, lastMove);
    return result.bestMove || legalMoves[0];
  }

  // Hard / Master: depth 4 search (or depth 5 if few pieces left)
  let totalPieces = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c]) totalPieces++;
    }
  }
  const searchDepth = totalPieces <= 8 ? 5 : 4;

  const result = minimax(board, searchDepth, -Infinity, Infinity, true, aiPlayer, lastMove);
  return result.bestMove || legalMoves[0];
}
