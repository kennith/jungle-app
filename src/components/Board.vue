<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { GameMode, GameState, Language, Piece, Position } from '../types/game';
import { getCellInfo, BOARD_COLS, BOARD_ROWS } from '../constants/board';
import CellComponent from './Cell.vue';
import PieceComponent from './Piece.vue';

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

interface DragState {
  active: boolean;
  isDragging: boolean;
  from: Position | null;
  piece: Piece | null;
  isRotated: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  hoveredPos: Position | null;
  pieceSize: number;
}

const dragState = ref<DragState>({
  active: false,
  isDragging: false,
  from: null,
  piece: null,
  isRotated: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  hoveredPos: null,
  pieceSize: 56,
});

function handleCellClick(pos: Position) {
  // If we were dragging and released on a cell, click event is ignored
  if (dragState.value.isDragging) return;

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

function handlePointerDown(e: PointerEvent, pos: Position) {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  if (props.gameState.isAiThinking || props.gameState.isGameOver) return;

  const piece = props.gameState.board[pos.row][pos.col];
  const selectedPos = props.gameState.selectedPosition;

  // If clicking on an active move target while another piece is already selected
  if (selectedPos && props.gameState.validMoves.some(m => m.col === pos.col && m.row === pos.row)) {
    emit('move-piece', selectedPos, pos);
    return;
  }

  // Start dragging if clicking on the current player's piece
  if (piece && piece.player === props.gameState.currentTurn) {
    emit('select-piece', pos);

    const cellTarget = (e.currentTarget as HTMLElement) || (e.target as HTMLElement);
    const rect = cellTarget?.getBoundingClientRect();
    const size = rect ? Math.min(rect.width, rect.height) : 56;

    dragState.value = {
      active: true,
      isDragging: false,
      from: pos,
      piece: piece,
      isRotated: props.mode === 'pvp' && piece.player === 'blue',
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      hoveredPos: pos,
      pieceSize: size,
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  }
}

function onPointerMove(e: PointerEvent) {
  if (!dragState.value.active) return;

  dragState.value.currentX = e.clientX;
  dragState.value.currentY = e.clientY;

  const dist = Math.hypot(
    e.clientX - dragState.value.startX,
    e.clientY - dragState.value.startY
  );

  if (dist > 6) {
    dragState.value.isDragging = true;
  }

  if (dragState.value.isDragging) {
    if (e.cancelable) e.preventDefault();

    // Identify hovered cell under pointer
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-cell-col]') as HTMLElement | null;
    if (target) {
      const col = parseInt(target.dataset.cellCol ?? '-1', 10);
      const row = parseInt(target.dataset.cellRow ?? '-1', 10);
      if (col >= 0 && row >= 0) {
        dragState.value.hoveredPos = { col, row };
      } else {
        dragState.value.hoveredPos = null;
      }
    } else {
      dragState.value.hoveredPos = null;
    }
  }
}

function onPointerUp(_e: PointerEvent) {
  cleanupPointerListeners();

  if (!dragState.value.active) return;

  const { isDragging, from, hoveredPos } = dragState.value;

  if (isDragging && from && hoveredPos) {
    // Check if released over a valid move position
    const isValid = props.gameState.validMoves.some(
      m => m.col === hoveredPos.col && m.row === hoveredPos.row
    );
    if (isValid && (hoveredPos.col !== from.col || hoveredPos.row !== from.row)) {
      emit('move-piece', from, hoveredPos);
    }
  }

  setTimeout(() => {
    dragState.value = {
      active: false,
      isDragging: false,
      from: null,
      piece: null,
      isRotated: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      hoveredPos: null,
      pieceSize: 56,
    };
  }, 10);
}

function onPointerCancel() {
  cleanupPointerListeners();
  dragState.value = {
    active: false,
    isDragging: false,
    from: null,
    piece: null,
    isRotated: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    hoveredPos: null,
    pieceSize: 56,
  };
}

function cleanupPointerListeners() {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerCancel);
}

onUnmounted(() => {
  cleanupPointerListeners();
});
</script>

<template>
  <div class="relative w-full flex flex-col items-center justify-center p-0 sm:p-2 select-none">
    <!-- 7x9 Board Surface with Solid Filled Grid Borders, full-width on mobile -->
    <div
      class="grid grid-cols-7 gap-[1px] sm:gap-[2px] p-[1.5px] sm:p-[3px] bg-red-700 border-[3px] sm:border-[5px] border-red-700 rounded-none shadow-xl w-full sm:w-[420px] md:w-[480px] max-w-full sm:max-w-[480px] overflow-hidden touch-none"
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
            :is-dragging-origin="
              dragState.isDragging &&
              dragState.from?.col === c - 1 &&
              dragState.from?.row === r - 1
            "
            :is-drag-hovered="
              dragState.isDragging &&
              dragState.hoveredPos?.col === c - 1 &&
              dragState.hoveredPos?.row === r - 1
            "
            :current-turn="gameState.currentTurn"
            :mode="mode"
            :language="language"
            @click-cell="handleCellClick"
            @pointerdown-cell="handlePointerDown"
          />
        </template>
      </template>
    </div>

    <!-- Floating Drag Preview Piece Avatar -->
    <Teleport to="body">
      <div
        v-if="dragState.isDragging && dragState.piece"
        class="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out select-none"
        :style="{
          left: `${dragState.currentX}px`,
          top: `${dragState.currentY}px`,
          width: `${dragState.pieceSize}px`,
          height: `${dragState.pieceSize}px`,
          transform: 'translate(-50%, -50%) scale(1.15)',
        }"
      >
        <PieceComponent
          :piece="dragState.piece"
          :language="language"
          :is-rotated="dragState.isRotated"
          class="w-full h-full shadow-[0_15px_30px_rgba(0,0,0,0.4)] ring-4 ring-amber-400"
        />
      </div>
    </Teleport>
  </div>
</template>
