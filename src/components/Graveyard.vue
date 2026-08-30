<script setup lang="ts">
import { computed } from 'vue';
import { Language, Piece, Player } from '../types/game';
import { ANIMALS } from '../constants/board';
import PieceComponent from './Piece.vue';

const props = defineProps<{
  player: Player;
  capturedPieces: Piece[];
  language: Language;
  title: string;
}>();

// Sort captured pieces from highest rank to lowest
const sortedCaptured = computed(() => {
  return [...props.capturedPieces].sort((a, b) => b.rank - a.rank);
});
</script>

<template>
  <div
    class="flex flex-col p-2.5 sm:p-3 rounded-xl border backdrop-blur-md transition-all"
    :class="[
      player === 'red'
        ? 'bg-red-950/30 border-red-800/40 text-red-100'
        : 'bg-blue-950/30 border-blue-800/40 text-blue-100'
    ]"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold uppercase tracking-wider opacity-80 font-cinzel">
        {{ title }}
      </span>
      <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
        {{ capturedPieces.length }} / 8
      </span>
    </div>

    <!-- Piece list / empty state -->
    <div class="flex flex-wrap gap-1.5 min-h-[36px] items-center">
      <div
        v-if="sortedCaptured.length === 0"
        class="text-xs text-slate-500 italic py-1"
      >
        {{ language === 'zh-TW' ? '暫無被吃棋子' : 'None captured' }}
      </div>
      <div
        v-for="piece in sortedCaptured"
        :key="piece.id"
        class="transform hover:scale-110 transition-transform"
        :title="language === 'zh-TW' ? ANIMALS[piece.type].nameZh : ANIMALS[piece.type].nameEn"
      >
        <PieceComponent
          :piece="piece"
          size="sm"
          :language="language"
        />
      </div>
    </div>
  </div>
</template>
