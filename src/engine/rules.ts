import { Move, Piece, Player, Position, WinReason } from '../types/game';
import { ANIMALS, TRAP_POSITIONS, isRiver, isDen, BOARD_COLS, BOARD_ROWS } from '../constants/board';

/**
 * Checks if a coordinate is inside the 7x9 board grid
 */
export function isInBounds(pos: Position): boolean {
  return pos.col >= 0 && pos.col < BOARD_COLS && pos.row >= 0 && pos.row < BOARD_ROWS;
}

/**
 * Checks if two positions are identical
 */
export function isSamePos(a: Position, b: Position): boolean {
  return a.col === b.col && a.row === b.row;
}

/**
 * Checks if a position is in an opponent's trap for a given piece's owner
 * e.g., if piece is Red, the opponent's trap is a Blue trap (near Blue den at top)
 */
export function isInOpponentTrap(pos: Position, pieceOwner: Player): boolean {
  const opponent: Player = pieceOwner === 'red' ? 'blue' : 'red';
  return TRAP_POSITIONS[opponent].some(p => p.col === pos.col && p.row === pos.row);
}

/**
 * Determines whether the attacker can capture the defender at destination
 */
export function canCapture(
  attacker: Piece,
  fromPos: Position,
  defender: Piece,
  toPos: Position
): boolean {
  // Cannot capture friendly pieces
  if (attacker.player === defender.player) {
    return false;
  }

  const attackerInWater = isRiver(fromPos);
  const defenderInWater = isRiver(toPos);

  // Rat in water cannot attack any piece on land
  if (attackerInWater && !defenderInWater) {
    return false;
  }

  // Piece on land cannot attack a Rat in water
  if (!attackerInWater && defenderInWater) {
    return false;
  }

  // Both in water (both must be rats)
  if (attackerInWater && defenderInWater) {
    return true;
  }

  // If the defender is in the attacker's trap (opponent trap for the defender),
  // defender rank is treated as 0 and can be captured by any attacker.
  if (isInOpponentTrap(toPos, defender.player)) {
    return true;
  }

  // Special Rule: Rat vs Elephant
  if (attacker.type === 'rat' && defender.type === 'elephant') {
    return true; // Rat eats Elephant on land
  }
  if (attacker.type === 'elephant' && defender.type === 'rat') {
    return false; // Elephant cannot eat Rat
  }

  // General rule: Equal or higher rank captures lower rank
  return attacker.rank >= defender.rank;
}

/**
 * Gets all valid destinations for a piece at given position
 */
export function getValidMovesForPiece(
  board: (Piece | null)[][],
  fromPos: Position
): Position[] {
  const piece = board[fromPos.row][fromPos.col];
  if (!piece) return [];

  const validMoves: Position[] = [];
  const directions = [
    { dc: 0, dr: -1 }, // Up
    { dc: 0, dr: 1 },  // Down
    { dc: -1, dr: 0 }, // Left
    { dc: 1, dr: 0 },  // Right
  ];

  for (const dir of directions) {
    const nextCol = fromPos.col + dir.dc;
    const nextRow = fromPos.row + dir.dr;
    const nextPos: Position = { col: nextCol, row: nextRow };

    if (!isInBounds(nextPos)) continue;

    // Check Den rule: Cannot enter own den
    const denInfo = isDen(nextPos);
    if (denInfo.isDen && denInfo.owner === piece.player) {
      continue;
    }

    // Check River rule
    if (isRiver(nextPos)) {
      if (piece.type === 'rat') {
        // Rat can enter river
        const destPiece = board[nextPos.row][nextPos.col];
        if (!destPiece) {
          validMoves.push(nextPos);
        } else if (destPiece.player !== piece.player && canCapture(piece, fromPos, destPiece, nextPos)) {
          validMoves.push(nextPos);
        }
      } else if (piece.type === 'lion' || piece.type === 'tiger') {
        // Lion and Tiger can jump across river
        const jumpDest = getRiverJumpDestination(board, fromPos, dir);
        if (jumpDest) {
          const destPiece = board[jumpDest.row][jumpDest.col];
          if (!destPiece) {
            validMoves.push(jumpDest);
          } else if (destPiece.player !== piece.player && canCapture(piece, fromPos, destPiece, jumpDest)) {
            validMoves.push(jumpDest);
          }
        }
      }
      // Other pieces cannot enter or jump river
      continue;
    }

    // Normal Land / Trap / Opponent Den move
    const targetPiece = board[nextPos.row][nextPos.col];
    if (!targetPiece) {
      validMoves.push(nextPos);
    } else if (canCapture(piece, fromPos, targetPiece, nextPos)) {
      validMoves.push(nextPos);
    }
  }

  return validMoves;
}

/**
 * Calculates river jump destination for Lion and Tiger.
 * Returns destination position if jump is valid and unblocked by any rat.
 */
export function getRiverJumpDestination(
  board: (Piece | null)[][],
  fromPos: Position,
  dir: { dc: number; dr: number }
): Position | null {
  // River bounds:
  // Left River: cols 1,2; rows 3,4,5
  // Right River: cols 4,5; rows 3,4,5

  // Vertical jump: rows 3..5 (3 water squares)
  if (dir.dc === 0 && (dir.dr === 1 || dir.dr === -1)) {
    // Must be on the edge of the river (row 2 jumping down or row 6 jumping up)
    if (fromPos.row === 2 && dir.dr === 1 && (fromPos.col === 1 || fromPos.col === 2 || fromPos.col === 4 || fromPos.col === 5)) {
      // Check if any rat is in rows 3, 4, 5 on this column
      for (let r = 3; r <= 5; r++) {
        if (board[r][fromPos.col] !== null) return null; // blocked by rat
      }
      return { col: fromPos.col, row: 6 };
    }
    if (fromPos.row === 6 && dir.dr === -1 && (fromPos.col === 1 || fromPos.col === 2 || fromPos.col === 4 || fromPos.col === 5)) {
      // Check if any rat is in rows 3, 4, 5 on this column
      for (let r = 3; r <= 5; r++) {
        if (board[r][fromPos.col] !== null) return null; // blocked by rat
      }
      return { col: fromPos.col, row: 2 };
    }
  }

  // Horizontal jump: cols 1,2 or cols 4,5 (2 water squares)
  if (dir.dr === 0 && (dir.dc === 1 || dir.dc === -1) && (fromPos.row >= 3 && fromPos.row <= 5)) {
    // Jump left-to-right across Left River (col 0 -> col 3)
    if (fromPos.col === 0 && dir.dc === 1) {
      if (board[fromPos.row][1] !== null || board[fromPos.row][2] !== null) return null;
      return { col: 3, row: fromPos.row };
    }
    // Jump right-to-left across Left River (col 3 -> col 0)
    if (fromPos.col === 3 && dir.dc === -1) {
      if (board[fromPos.row][1] !== null || board[fromPos.row][2] !== null) return null;
      return { col: 0, row: fromPos.row };
    }
    // Jump left-to-right across Right River (col 3 -> col 6)
    if (fromPos.col === 3 && dir.dc === 1) {
      if (board[fromPos.row][4] !== null || board[fromPos.row][5] !== null) return null;
      return { col: 6, row: fromPos.row };
    }
    // Jump right-to-left across Right River (col 6 -> col 3)
    if (fromPos.col === 6 && dir.dc === -1) {
      if (board[fromPos.row][4] !== null || board[fromPos.row][5] !== null) return null;
      return { col: 3, row: fromPos.row };
    }
  }

  return null;
}

/**
 * Gets all legal moves for all pieces belonging to a player
 */
export function getAllLegalMoves(
  board: (Piece | null)[][],
  player: Player
): Move[] {
  const moves: Move[] = [];

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.player === player) {
        const fromPos: Position = { col: c, row: r };
        const validDests = getValidMovesForPiece(board, fromPos);

        for (const toPos of validDests) {
          const capturedPiece = board[toPos.row][toPos.col];
          const isJump = (piece.type === 'lion' || piece.type === 'tiger') && 
            (Math.abs(toPos.col - fromPos.col) > 1 || Math.abs(toPos.row - fromPos.row) > 1);
          const isIntoOpponentTrap = isInOpponentTrap(toPos, player);
          const denInfo = isDen(toPos);
          const isDenEntry = denInfo.isDen && denInfo.owner !== player;

          moves.push({
            from: fromPos,
            to: toPos,
            piece: { ...piece },
            capturedPiece: capturedPiece ? { ...capturedPiece } : null,
            isJump,
            isIntoOpponentTrap,
            isDenEntry,
          });
        }
      }
    }
  }

  return moves;
}

/**
 * Executes a move on the board immutably and returns new board
 */
export function makeMove(
  board: (Piece | null)[][],
  move: Move
): (Piece | null)[][] {
  const newBoard = board.map(row => [...row]);
  newBoard[move.to.row][move.to.col] = move.piece;
  newBoard[move.from.row][move.from.col] = null;
  return newBoard;
}

/**
 * Generates bilingual chess-like notation for move history
 * e.g. "Elephant c7-c6", "象 c7-c6", "Lion jump a4-d4 xCat"
 */
export function formatMoveNotation(move: Move): { en: string; zh: string } {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const fromStr = `${cols[move.from.col]}${9 - move.from.row}`;
  const toStr = `${cols[move.to.col]}${9 - move.to.row}`;
  const meta = ANIMALS[move.piece.type];

  let actionEn = '-';
  let actionZh = '至';

  if (move.isJump) {
    actionEn = ' ~> ';
    actionZh = '跳至';
  } else if (move.capturedPiece) {
    actionEn = ' x ';
    actionZh = '吃';
  }

  let capturedStrEn = '';
  let capturedStrZh = '';
  if (move.capturedPiece) {
    const capMeta = ANIMALS[move.capturedPiece.type];
    capturedStrEn = ` (${capMeta.nameEn})`;
    capturedStrZh = `（${capMeta.nameZh}）`;
  }

  const en = `${meta.nameEn} ${fromStr}${actionEn}${toStr}${capturedStrEn}`;
  const zh = `${meta.nameZh} ${fromStr}${actionZh}${toStr}${capturedStrZh}`;

  return { en, zh };
}

/**
 * Checks if the game has ended
 */
export function checkGameStatus(
  board: (Piece | null)[][],
  lastMove: Move | null,
  nextPlayer: Player
): { isGameOver: boolean; winner: Player | null; reason?: WinReason } {
  // 1. Check if last move entered opponent's den
  if (lastMove) {
    const denInfo = isDen(lastMove.to);
    if (denInfo.isDen && denInfo.owner !== lastMove.piece.player) {
      return {
        isGameOver: true,
        winner: lastMove.piece.player,
        reason: 'den_capture',
      };
    }
  }

  // 2. Check if next player has any remaining pieces
  let redPiecesCount = 0;
  let bluePiecesCount = 0;

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.player === 'red') redPiecesCount++;
        else bluePiecesCount++;
      }
    }
  }

  if (redPiecesCount === 0) {
    return { isGameOver: true, winner: 'blue', reason: 'elimination' };
  }
  if (bluePiecesCount === 0) {
    return { isGameOver: true, winner: 'red', reason: 'elimination' };
  }

  // 3. Check if next player has any legal moves available
  const nextPlayerMoves = getAllLegalMoves(board, nextPlayer);
  if (nextPlayerMoves.length === 0) {
    const opponent: Player = nextPlayer === 'red' ? 'blue' : 'red';
    return { isGameOver: true, winner: opponent, reason: 'no_moves' };
  }

  return { isGameOver: false, winner: null };
}
