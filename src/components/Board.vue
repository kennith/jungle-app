<script setup lang="ts">
import { GameMode, GameState, Language, Position } from '../types/game';
import { getCellInfo, BOARD_COLS, BOARD_ROWS } from '../constants/board';
import CellComponent from './Cell.vue';

const props = defineProps<{
  gameState: GameState;
  language: Language;
  mode?: GameMode;
  hintMove?: { from: Position; to: Position } | null;
}>();

const emit = defineEmits<{
  (e: 'select-piece', pos: Position): void;
  (e: 'move-piece', from: Position, to: Position): void;
}>();

function handleCellClick(pos: Position) {
  const piece = props.gameState.board[pos.row][pos.col];
  const selectedPos = props.gameState.selectedPosition;

  // If already selected a piece and clicked a valid move destination
  if (selectedPos) {
    const isTarget = props.gameState.validMoves.some(
      m => m.col === pos.col && m.row === pos.row
    );
    if (isTarget) {
      emit('move-piece', selectedPos, pos);
      return;
    }

    // If clicked on another piece of the same player whose turn it is, switch selection
    if (piece && piece.player === props.gameState.currentTurn) {
      emit('select-piece', pos);
      return;
    }

    // Clicked somewhere invalid -> deselect
    emit('select-piece', pos);
  } else {
    // If no piece selected yet, select if it's the current player's piece
    if (piece && piece.player === props.gameState.currentTurn) {
      emit('select-piece', pos);
    }
  }
}
</script>

<template>
  <div class="relative w-full flex flex-col items-center justify-center p-0 sm:p-2">
    <!-- 7x9 Board Surface with Solid Filled Grid Borders, full-width on mobile -->
    <div
      class="grid grid-cols-7 gap-[1px] sm:gap-[2px] p-[1.5px] sm:p-[3px] bg-red-700 border-[3px] sm:border-[5px] border-red-700 rounded-none shadow-xl w-full sm:w-[420px] md:w-[480px] max-w-full sm:max-w-[480px] overflow-hidden"
    >
      <template v-for="r in BOARD_ROWS" :key="r">
        <template v-for="c in BOARD_COLS" :key="c">
          <CellComponent
            :cell-info="getCellInfo(c - 1, r - 1)"
            :piece="gameState.board[r - 1][c - 1]"
            :is-selected="
              gameState.selectedPosition?.col === c - 1 &&
              gameState.selectedPosition?.row === r - 1
            "
            :is-valid-move-target="
              gameState.validMoves.some(
                m => m.col === c - 1 && m.row === r - 1
              )
            "
            :is-last-move-from="
              gameState.lastMove?.from.col === c - 1 &&
              gameState.lastMove?.from.row === r - 1
            "
            :is-last-move-to="
              gameState.lastMove?.to.col === c - 1 &&
              gameState.lastMove?.to.row === r - 1
            "
            :is-hint-target="
              (hintMove?.from.col === c - 1 && hintMove?.from.row === r - 1) ||
              (hintMove?.to.col === c - 1 && hintMove?.to.row === r - 1)
            "
            :is-rotated="mode === 'pvp' && gameState.board[r - 1][c - 1]?.player === 'blue'"
            :language="language"
            @click-cell="handleCellClick"
          />
        </template>
      </template>
    </div>
  </div>
</template>
