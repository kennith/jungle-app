<script setup lang="ts">
import { computed } from 'vue';
import { CellInfo, GameMode, Language, Piece, Position } from '../types/game';
import { getStartingSquareWatermark } from '../constants/board';
import PieceComponent from './Piece.vue';

const props = defineProps<{
  cellInfo: CellInfo;
  piece: Piece | null;
  isSelected?: boolean;
  isValidMoveTarget?: boolean;
  isLastMoveFrom?: boolean;
  isLastMoveTo?: boolean;
  isHintTarget?: boolean;
  isRotated?: boolean;
  isDraggingOrigin?: boolean;
  isDragHovered?: boolean;
  mode?: GameMode;
  language: Language;
}>();

const emit = defineEmits<{
  (e: 'click-cell', pos: Position): void;
  (e: 'pointerdown-cell', event: PointerEvent, pos: Position): void;
}>();

const isRiverCell = computed(() => props.cellInfo.terrain === 'river');
const isDenCell = computed(() => props.cellInfo.terrain === 'den');
const isTrapCell = computed(() => props.cellInfo.terrain === 'trap');
const startingWatermark = computed(() => getStartingSquareWatermark(props.cellInfo.col, props.cellInfo.row));

// Check if cell is an opponent's trap for the occupying piece
const isOccupantTrapped = computed(() => {
  if (!props.piece || !isTrapCell.value) return false;
  return props.cellInfo.owner !== props.piece.player;
});

// Rotate Blue terrain elements (Den, Trap, and Watermarks) 180 deg in 2P mode
const isBlueTerrainRotated = computed(() => props.mode === 'pvp' && props.cellInfo.owner === 'blue');
const isBlueWatermarkRotated = computed(() => props.mode === 'pvp' && props.cellInfo.row <= 2);
// Rotate Right River wave and label 180 deg in 2P mode for Blue's perspective
const isRightRiverRotated = computed(() => props.mode === 'pvp' && isRiverCell.value && props.cellInfo.col >= 4);

const isCaptureTarget = computed(() => {
  return props.isValidMoveTarget && props.piece !== null;
});

function handleClick() {
  emit('click-cell', { col: props.cellInfo.col, row: props.cellInfo.row });
}

function handlePointerDown(e: PointerEvent) {
  emit('pointerdown-cell', e, { col: props.cellInfo.col, row: props.cellInfo.row });
}
</script>

<template>
  <div
    :data-cell-col="cellInfo.col"
    :data-cell-row="cellInfo.row"
    class="relative aspect-square w-full flex items-center justify-center bg-white transition-colors duration-150 cursor-pointer overflow-hidden group select-none touch-none"
    :class="[
      // Selection & Move Highlights (all ring-inset to stay strictly inside square grid)
      isSelected ? 'bg-amber-100/80 ring-2 sm:ring-3 ring-amber-500 ring-inset z-10' : '',
      isLastMoveFrom ? 'bg-amber-100/90 ring-2 ring-amber-400 ring-inset' : '',
      isLastMoveTo ? 'bg-amber-200/95 ring-3 ring-amber-500 ring-inset' : '',
      isHintTarget ? 'ring-3 ring-emerald-500 ring-inset animate-pulse bg-emerald-50' : '',
      isDragHovered && isValidMoveTarget ? 'bg-amber-200/90 ring-3 sm:ring-4 ring-amber-400 ring-inset z-20' : (!isSelected ? 'hover:bg-amber-50/60' : ''),
    ]"
    @click="handleClick"
    @pointerdown="handlePointerDown"
  >
    <!-- River Wave Texture & Red Label (matching Dou_shou_qi_board.png) -->
    <div
      v-if="isRiverCell"
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      :class="isRightRiverRotated ? 'rotate-180' : ''"
    >
      <!-- Red Wavy Water Lines -->
      <svg class="absolute inset-0 w-full h-full text-red-600/50" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,25 Q25,12 50,25 T100,25" fill="none" stroke="currentColor" stroke-width="2.5" />
        <path d="M0,50 Q25,37 50,50 T100,50" fill="none" stroke="currentColor" stroke-width="2.5" />
        <path d="M0,75 Q25,62 50,75 T100,75" fill="none" stroke="currentColor" stroke-width="2.5" />
      </svg>
      <span class="font-oriental font-black text-xs sm:text-sm text-red-700/90 z-0 drop-shadow-sm">
        {{ language === 'zh-TW' ? '小河' : 'RIVER' }}
      </span>
    </div>

    <!-- Den (Red Line Box matching Dou_shou_qi_board.png) -->
    <div
      v-if="isDenCell"
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none bg-red-50/40"
      :class="isBlueTerrainRotated ? 'rotate-180' : ''"
    >
      <div class="absolute inset-1 border border-dashed border-red-600/70 rounded-none"></div>
      <span
        class="font-oriental font-black text-xs sm:text-sm tracking-widest text-red-700 drop-shadow-sm"
      >
        {{ language === 'zh-TW' ? '獸穴' : 'DEN' }}
      </span>
      <span class="text-[7.5px] sm:text-[8.5px] font-black text-red-600 uppercase tracking-tighter mt-0.5">
        {{ cellInfo.owner === 'blue' ? (language === 'zh-TW' ? '藍方' : 'BLUE') : (language === 'zh-TW' ? '紅方' : 'RED') }}
      </span>
    </div>

    <!-- Trap (Red Diagonal / Cross Markings matching Dou_shou_qi_board.png) -->
    <div
      v-if="isTrapCell"
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none bg-red-50/30"
      :class="isBlueTerrainRotated ? 'rotate-180' : ''"
    >
      <!-- Diagonal corner trap lines -->
      <svg class="absolute inset-0 w-full h-full text-red-600/35" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" />
      </svg>
      <span
        class="font-oriental font-black text-xs sm:text-sm text-red-700 tracking-wider z-0 drop-shadow-sm"
      >
        {{ language === 'zh-TW' ? '陷阱' : 'TRAP' }}
      </span>
    </div>

    <!-- Starting square watermark in Red Ink on Land (matching Dou_shou_qi_board.png) -->
    <div
      v-if="!piece && !isRiverCell && !isDenCell && !isTrapCell && startingWatermark"
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-35"
      :class="isBlueWatermarkRotated ? 'rotate-180' : ''"
    >
      <span class="font-oriental font-black text-base sm:text-lg text-red-700">
        {{ startingWatermark.charZh }}
      </span>
    </div>

    <!-- Occupying Piece -->
    <div
      v-if="piece"
      class="w-full h-full p-0.5 sm:p-1 flex items-center justify-center z-10 transition-opacity duration-150"
      :class="isDraggingOrigin ? 'opacity-25' : 'opacity-100'"
    >
      <PieceComponent
        :piece="piece"
        :is-selected="isSelected"
        :is-in-trap="isOccupantTrapped"
        :is-last-move-piece="isLastMoveTo"
        :is-rotated="isRotated"
        :language="language"
      />
    </div>

    <!-- Valid Move Indicator (Empty Cell destination) -->
    <div
      v-if="isValidMoveTarget && !piece"
      class="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500/90 shadow-[0_0_10px_rgba(245,158,11,0.9)] z-20 pointer-events-none animate-scale"
    >
      <div class="w-full h-full rounded-full bg-white/70 animate-ping"></div>
    </div>

    <!-- Valid Move Indicator (Capture Target) -->
    <div
      v-if="isCaptureTarget"
      class="absolute inset-0.5 rounded-full border-2 sm:border-3 border-red-600 z-30 pointer-events-none animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.8)] flex items-center justify-center"
    >
      <div class="w-full h-full rounded-full border border-amber-400"></div>
    </div>
  </div>
</template>
