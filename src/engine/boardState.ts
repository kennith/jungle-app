import { GameState, Move, Piece, Player, Position } from '../types/game';
import { BOARD_COLS, BOARD_ROWS, INITIAL_PIECES_SETUP } from '../constants/board';
import { checkGameStatus, formatMoveNotation, getValidMovesForPiece, makeMove } from './rules';

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => null)
  );

  for (const { piece, position } of INITIAL_PIECES_SETUP) {
    board[position.row][position.col] = { ...piece };
  }

  return board;
}

export function createInitialGameState(): GameState {
  const board = createInitialBoard();
  return {
    board,
    currentTurn: 'red', // Red moves first
    winner: null,
    isGameOver: false,
    moveHistory: [],
    capturedPieces: {
      red: [],
      blue: [],
    },
    selectedPosition: null,
    validMoves: [],
    lastMove: null,
    isAiThinking: false,
  };
}

export function executePlayerMove(
  state: GameState,
  from: Position,
  to: Position
): { nextState: GameState; executedMove: Move | null } {
  const piece = state.board[from.row][from.col];
  if (!piece || piece.player !== state.currentTurn || state.isGameOver) {
    return { nextState: state, executedMove: null };
  }

  const validDests = getValidMovesForPiece(state.board, from);
  const isValid = validDests.some(d => d.col === to.col && d.row === to.row);
  if (!isValid) {
    return { nextState: state, executedMove: null };
  }

  const destPiece = state.board[to.row][to.col];
  const isJump = (piece.type === 'lion' || piece.type === 'tiger') &&
    (Math.abs(to.col - from.col) > 1 || Math.abs(to.row - from.row) > 1);

  const move: Move = {
    from,
    to,
    piece: { ...piece },
    capturedPiece: destPiece ? { ...destPiece } : null,
    isJump,
    timestamp: Date.now(),
  };

  const notations = formatMoveNotation(move);
  move.notationEn = notations.en;
  move.notationZh = notations.zh;

  const newBoard = makeMove(state.board, move);
  const nextPlayer: Player = state.currentTurn === 'red' ? 'blue' : 'red';

  const newCaptured = {
    red: [...state.capturedPieces.red],
    blue: [...state.capturedPieces.blue],
  };

  if (move.capturedPiece) {
    if (move.capturedPiece.player === 'red') {
      newCaptured.blue.push(move.capturedPiece); // Blue captured Red's piece
    } else {
      newCaptured.red.push(move.capturedPiece);  // Red captured Blue's piece
    }
  }

  const status = checkGameStatus(newBoard, move, nextPlayer);

  const nextState: GameState = {
    board: newBoard,
    currentTurn: nextPlayer,
    winner: status.winner,
    isGameOver: status.isGameOver,
    winReason: status.reason,
    moveHistory: [...state.moveHistory, move],
    capturedPieces: newCaptured,
    selectedPosition: null,
    validMoves: [],
    lastMove: move,
    isAiThinking: false,
  };

  return { nextState, executedMove: move };
}
