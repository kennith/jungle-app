<script setup lang="ts">
import { watch } from 'vue';
import { GameMode, Language, Player, WinReason } from '../types/game';
import { t } from '../constants/translations';
import confetti from 'canvas-confetti';
import { Trophy, Frown, Sparkles, RotateCcw, Eye } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  winner: Player | 'draw' | null;
  winReason?: WinReason;
  playerSide: Player;
  mode: GameMode;
  moveCount: number;
  language: Language;
}>();

const emit = defineEmits<{
  (e: 'play-again'): void;
  (e: 'close'): void;
}>();

const isHumanWinner = () => {
  if (props.mode === 'pvp') return true;
  return props.winner === props.playerSide;
};

watch(
  () => props.isOpen,
  (open) => {
    if (open && isHumanWinner() && props.winner !== 'draw') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    }
  }
);

function getWinReasonMessage(): string {
  if (!props.winReason) return '';
  switch (props.winReason) {
    case 'den_capture':
      return t(props.language, 'denCapturedMsg');
    case 'elimination':
      return t(props.language, 'allCapturedMsg');
    case 'no_moves':
      return t(props.language, 'noMovesMsg');
    case 'surrender':
      return t(props.language, 'surrenderMsg');
    default:
      return '';
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
  >
    <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center overflow-hidden text-slate-800">
      <!-- Icon Badge -->
      <div class="relative mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-4"
        :class="[
          winner === 'draw'
            ? 'bg-slate-100 border border-slate-300 text-slate-600'
            : isHumanWinner()
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_20px_rgba(251,191,36,0.5)]'
              : 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]'
        ]"
      >
        <Sparkles v-if="winner !== 'draw' && isHumanWinner()" class="w-8 h-8 animate-bounce" />
        <Trophy v-else-if="winner !== 'draw'" class="w-8 h-8" />
        <Frown v-else class="w-8 h-8" />
      </div>

      <!-- Result Heading -->
      <h2
        class="text-2xl sm:text-3xl font-black font-cinzel tracking-wide mb-1"
        :class="[
          winner === 'draw'
            ? 'text-slate-700'
            : winner === 'red'
              ? 'text-rose-700'
              : 'text-sky-700'
        ]"
      >
        <template v-if="winner === 'draw'">
          {{ t(language, 'drawTitle') }}
        </template>
        <template v-else-if="winner === 'red'">
          {{ t(language, 'redWins') }}
        </template>
        <template v-else>
          {{ t(language, 'blueWins') }}
        </template>
      </h2>

      <!-- Subtitle description -->
      <p class="text-sm font-medium text-slate-600 mb-4">
        {{ winner === 'red' ? (language === 'zh-TW' ? '紅方' : 'Red') : (language === 'zh-TW' ? '藍方' : 'Blue') }} {{ getWinReasonMessage() }}
      </p>

      <!-- Stats Box -->
      <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-6 flex justify-around items-center">
        <div>
          <span class="block text-[11px] font-semibold text-slate-500 uppercase">
            {{ t(language, 'totalMoves') }}
          </span>
          <span class="text-lg font-black text-slate-900 font-mono">
            {{ moveCount }}
          </span>
        </div>
        <div class="h-8 w-px bg-slate-200"></div>
        <div>
          <span class="block text-[11px] font-semibold text-slate-500 uppercase">
            {{ t(language, 'mode') }}
          </span>
          <span class="text-xs font-bold text-slate-700">
            {{ mode === 'pve' ? t(language, 'modePvE') : mode === 'pvp' ? t(language, 'modePvP') : t(language, 'modeEvE') }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button
          class="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-300 shadow-sm"
          @click="emit('close')"
        >
          <Eye class="w-4 h-4" />
          <span>{{ t(language, 'reviewBoard') }}</span>
        </button>

        <button
          class="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          @click="emit('play-again')"
        >
          <RotateCcw class="w-4 h-4" />
          <span>{{ t(language, 'playAgain') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
