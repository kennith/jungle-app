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
    class="relative flex items-center justify-center rounded-full select-none cursor-pointer transition-all duration-200 overflow-hidden"
    :class="[
      size === 'sm' ? 'w-8 h-8 border-[2.5px]' : 'w-full h-full max-w-[68px] max-h-[68px] aspect-square border-[5px]',
      // White background with Red or Blue border
      'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]',
      isRed
        ? 'border-red-600 shadow-[0_4px_10px_rgba(220,38,38,0.35)]'
        : 'border-sky-600 shadow-[0_4px_10px_rgba(2,132,199,0.35)]',
      isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.9)] z-20 -translate-y-1' : '',
      isLastMovePiece ? 'ring-2 ring-yellow-500' : '',
      isInTrap ? 'opacity-85 ring-2 ring-dashed ring-amber-500 animate-pulse' : '',
      isRotated ? 'rotate-180' : '',
      'hover:scale-105 active:scale-95'
    ]"
    :title="`${pieceName} (${isRed ? (language === 'zh-TW' ? '紅方' : 'Red') : (language === 'zh-TW' ? '藍方' : 'Blue')})`"
  >
    <!-- Central Emoji with label overlaid over its bottom-left corner -->
    <div class="relative inline-flex items-center justify-center pointer-events-none select-none">
      <!-- Main Animal Emoji Identifier in Center -->
      <span
        class="leading-none select-none transition-transform filter drop-shadow-sm flex items-center justify-center"
        :class="size === 'sm' ? 'text-base sm:text-lg' : 'text-2xl sm:text-3xl md:text-4xl pb-0.5'"
      >
        {{ meta.emoji }}
      </span>

      <!-- Piece Name Overlaid Directly Over the Emoji's Bottom Left Corner -->
      <span
        v-if="size !== 'sm'"
        class="absolute -bottom-1 -left-1 text-[8.5px] sm:text-[10px] font-black leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,1)] tracking-tighter select-none font-oriental"
        :class="isRed ? 'text-red-700' : 'text-sky-800'"
      >
        {{ pieceName }}
      </span>
    </div>

    <!-- Trapped warning indicator badge -->
    <div
      v-if="isInTrap"
      class="absolute -top-1 -right-1 bg-amber-500 text-amber-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-amber-300 shadow animate-bounce"
    >
      {{ language === 'zh-TW' ? '陷' : 'TRAP' }}
    </div>
  </div>
</template>
