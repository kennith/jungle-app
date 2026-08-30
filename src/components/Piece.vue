<script setup lang="ts">
import { computed } from 'vue';
import { Piece, Language } from '../types/game';
import { ANIMALS } from '../constants/board';

const props = defineProps<{
  piece: Piece;
  isSelected?: boolean;
  isLastMovePiece?: boolean;
  isInTrap?: boolean;
  isRotated?: boolean;
  language: Language;
  size?: 'sm' | 'md' | 'lg';
}>();

const meta = computed(() => ANIMALS[props.piece.type]);

const pieceName = computed(() => {
  return props.language === 'zh-TW' ? meta.value.nameZh : meta.value.nameEn;
});

const isRed = computed(() => props.piece.player === 'red');
</script>

<template>
  <div
    class="relative flex items-center justify-center rounded-full select-none cursor-pointer transition-all duration-200"
    :class="[
      size === 'sm' ? 'w-8 h-8 border-[2.5px]' : 'w-full h-full max-w-[68px] max-h-[68px] aspect-square border-[4px] sm:border-[5px]',
      // Solid white background with Red or Blue border
      'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]',
      isRed
        ? 'border-red-600 shadow-[0_4px_10px_rgba(220,38,38,0.3)]'
        : 'border-sky-600 shadow-[0_4px_10px_rgba(2,132,199,0.3)]',
      isSelected ? 'ring-2 sm:ring-3 ring-amber-400 ring-inset shadow-[0_0_12px_rgba(251,191,36,0.8)] z-10' : '',
      isLastMovePiece ? 'ring-2 ring-yellow-500 ring-inset' : '',
      isInTrap ? 'opacity-85 ring-2 ring-dashed ring-amber-500 animate-pulse ring-inset' : '',
      isRotated ? 'rotate-180' : '',
      'hover:scale-[1.02] active:scale-95'
    ]"
    :title="`${pieceName} (${isRed ? (language === 'zh-TW' ? '紅方' : 'Red') : (language === 'zh-TW' ? '藍方' : 'Blue')})`"
  >
    <!-- Main Animal Emoji with Overlaid Label (locked relative to emoji on all screen widths) -->
    <div class="relative flex items-center justify-center pointer-events-none select-none">
      <span
        class="leading-none select-none transition-transform filter drop-shadow-sm flex items-center justify-center"
        :class="size === 'sm' ? 'text-base' : 'text-2xl sm:text-3xl md:text-4xl pb-0.5'"
      >
        {{ meta.emoji }}
      </span>

      <!-- Piece Name Overlaid on the Emoji with White Shadow Halo -->
      <span
        v-if="size !== 'sm'"
        class="absolute bottom-0 left-0 sm:bottom-0.5 sm:left-0.5 text-xs sm:text-sm md:text-base font-black leading-none [text-shadow:_0_0_4px_#ffffff,_0_0_2px_#ffffff,_1px_1px_1px_#ffffff,_-1px_-1px_1px_#ffffff] tracking-tighter select-none font-oriental z-20"
        :class="isRed ? 'text-red-700' : 'text-sky-800'"
      >
        {{ pieceName }}
      </span>
    </div>

    <!-- Trapped warning indicator badge -->
    <div
      v-if="isInTrap"
      class="absolute -top-1 -right-1 bg-amber-500 text-amber-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-amber-300 shadow animate-bounce z-30"
    >
      {{ language === 'zh-TW' ? '陷' : 'TRAP' }}
    </div>
  </div>
</template>
