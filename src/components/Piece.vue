<script setup lang="ts">
import { computed } from 'vue';
import { Piece, Language } from '../types/game';
import { ANIMALS } from '../constants/board';

const props = defineProps<{
  piece: Piece;
  isSelected?: boolean;
  isLastMovePiece?: boolean;
  isInTrap?: boolean;
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
      size === 'sm' ? 'w-8 h-8' : 'w-full h-full max-w-[68px] max-h-[68px] aspect-square',
      // Wood background with Red or Blue border
      'bg-gradient-to-b from-[#fbf4e6] via-[#eedec7] to-[#dfcda9] shadow-[0_3px_8px_rgba(0,0,0,0.35)]',
      isRed
        ? 'border-[2.5px] sm:border-[3px] border-red-600 shadow-[0_4px_10px_rgba(220,38,38,0.35)]'
        : 'border-[2.5px] sm:border-[3px] border-sky-600 shadow-[0_4px_10px_rgba(2,132,199,0.35)]',
      isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.9)] z-20 -translate-y-1' : '',
      isLastMovePiece ? 'ring-2 ring-yellow-500' : '',
      isInTrap ? 'opacity-85 ring-2 ring-dashed ring-amber-500 animate-pulse' : '',
      'hover:scale-105 active:scale-95'
    ]"
    :title="`${pieceName} (${isRed ? (language === 'zh-TW' ? '紅方' : 'Red') : (language === 'zh-TW' ? '藍方' : 'Blue')})`"
  >
    <!-- Main Animal Emoji Identifier in Center -->
    <span
      class="leading-none select-none transition-transform filter drop-shadow-sm flex items-center justify-center pointer-events-none"
      :class="size === 'sm' ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl md:text-3xl pb-1'"
    >
      {{ meta.emoji }}
    </span>

    <!-- Piece Name in the Bottom Left (Red or Blue text) -->
    <span
      v-if="size !== 'sm'"
      class="absolute bottom-0.5 left-1.5 sm:bottom-1 sm:left-2 text-[8px] sm:text-[9.5px] font-black leading-none drop-shadow-sm tracking-tighter select-none pointer-events-none"
      :class="isRed ? 'text-red-700 font-oriental' : 'text-sky-800 font-oriental'"
    >
      {{ pieceName }}
    </span>

    <!-- Trapped warning indicator badge -->
    <div
      v-if="isInTrap"
      class="absolute -top-1 -right-1 bg-amber-500 text-amber-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-amber-300 shadow animate-bounce"
    >
      {{ language === 'zh-TW' ? '陷' : 'TRAP' }}
    </div>
  </div>
</template>
