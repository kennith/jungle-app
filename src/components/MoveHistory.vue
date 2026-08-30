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
  <div class="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md">
    <div class="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 font-cinzel">
        {{ t(language, 'moveHistory') }}
      </h3>
      <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
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
        class="text-xs text-slate-500 italic text-center py-6"
      >
        {{ t(language, 'noMovesYet') }}
      </div>

      <div
        v-for="(move, index) in moves"
        :key="index"
        class="flex items-center justify-between text-xs px-2.5 py-1 rounded bg-slate-950/40 hover:bg-slate-800/50 transition-colors border border-white/5 font-mono"
      >
        <span class="text-slate-500 w-6 font-bold">
          {{ index + 1 }}.
        </span>

        <span
          class="flex-1 font-medium font-sans truncate px-2"
          :class="move.piece.player === 'red' ? 'text-rose-400' : 'text-sky-400'"
        >
          {{ language === 'zh-TW' ? move.notationZh : move.notationEn }}
        </span>

        <!-- Jump / Capture tags -->
        <div class="flex items-center space-x-1 shrink-0">
          <span
            v-if="move.isJump"
            class="text-[9px] px-1.5 py-0.2 rounded bg-sky-900/70 text-sky-300 border border-sky-700/50"
          >
            {{ language === 'zh-TW' ? '跳河' : 'JUMP' }}
          </span>
          <span
            v-if="move.capturedPiece"
            class="text-[9px] px-1.5 py-0.2 rounded bg-rose-900/70 text-rose-300 border border-rose-700/50"
          >
            {{ language === 'zh-TW' ? '吃子' : 'CAPTURE' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
