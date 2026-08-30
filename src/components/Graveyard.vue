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
    class="flex flex-col p-2.5 sm:p-3 rounded-xl border shadow-sm transition-all"
    :class="[
      player === 'red'
        ? 'bg-red-50/80 border-red-200 text-red-950'
        : 'bg-sky-50/80 border-sky-200 text-sky-950'
    ]"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold uppercase tracking-wider font-cinzel"
        :class="player === 'red' ? 'text-red-900' : 'text-sky-900'"
      >
        {{ title }}
      </span>
      <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700">
        {{ capturedPieces.length }} / 8
      </span>
    </div>

    <!-- Piece list / empty state -->
    <div class="flex flex-wrap gap-1.5 min-h-[36px] items-center">
      <div
        v-if="sortedCaptured.length === 0"
        class="text-xs text-slate-400 italic py-1"
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
