<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Language, Move } from '../types/game';
import { t } from '../constants/translations';

const props = defineProps<{
  moves: Move[];
  language: Language;
}>();

const historyContainer = ref<HTMLElement | null>(null);

watch(
  () => props.moves.length,
  async () => {
    await nextTick();
    if (historyContainer.value) {
      historyContainer.value.scrollTop = historyContainer.value.scrollHeight;
    }
  }
);
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 border border-slate-200 shadow-sm rounded-xs p-3">
    <div class="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 font-cinzel">
        {{ t(language, 'moveHistory') }}
      </h3>
      <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
        {{ moves.length }} {{ t(language, 'step') }}
      </span>
    </div>

    <!-- Scrollable list -->
    <div
      ref="historyContainer"
      class="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[160px] sm:max-h-[220px]"
    >
      <div
        v-if="moves.length === 0"
        class="text-xs text-slate-400 italic text-center py-6"
      >
        {{ t(language, 'noMovesYet') }}
      </div>

      <div
        v-for="(move, index) in moves"
        :key="index"
        class="flex items-center justify-between text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm font-mono"
      >
        <span class="text-slate-400 w-6 font-bold">
          {{ index + 1 }}.
        </span>

        <span
          class="flex-1 font-medium font-sans truncate px-2"
          :class="move.piece.player === 'red' ? 'text-rose-700' : 'text-sky-700'"
        >
          {{ language === 'zh-TW' ? move.notationZh : move.notationEn }}
        </span>

        <!-- Jump / Capture tags -->
        <div class="flex items-center space-x-1 shrink-0">
          <span
            v-if="move.isJump"
            class="text-[9px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200 font-bold"
          >
            {{ language === 'zh-TW' ? '跳河' : 'JUMP' }}
          </span>
          <span
            v-if="move.capturedPiece"
            class="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold"
          >
            {{ language === 'zh-TW' ? '吃子' : 'CAPTURE' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
