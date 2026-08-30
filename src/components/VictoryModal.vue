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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
  >
    <div class="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-6 text-center overflow-hidden">
      <!-- Background Ambient Glow -->
      <div
        class="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
        :class="winner === 'draw' ? 'bg-slate-500' : isHumanWinner() ? 'bg-amber-400' : 'bg-rose-500'"
      ></div>

      <!-- Icon Badge -->
      <div class="relative mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4"
        :class="[
          winner === 'draw'
            ? 'bg-slate-800 border border-slate-600 text-slate-300'
            : isHumanWinner()
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.6)]'
              : 'bg-gradient-to-br from-rose-700 to-red-950 border-2 border-rose-400 text-rose-100 shadow-[0_0_25px_rgba(225,29,72,0.5)]'
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
            ? 'text-slate-300'
            : winner === 'red'
              ? 'text-rose-400'
              : 'text-sky-400'
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
      <p class="text-sm font-medium text-slate-300 mb-4">
        {{ winner === 'red' ? (language === 'zh-TW' ? '紅方' : 'Red') : (language === 'zh-TW' ? '藍方' : 'Blue') }} {{ getWinReasonMessage() }}
      </p>

      <!-- Stats Box -->
      <div class="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 mb-6 flex justify-around items-center">
        <div>
          <span class="block text-[11px] font-semibold text-slate-400 uppercase">
            {{ t(language, 'totalMoves') }}
          </span>
          <span class="text-lg font-black text-amber-300 font-mono">
            {{ moveCount }}
          </span>
        </div>
        <div class="h-8 w-px bg-slate-800"></div>
        <div>
          <span class="block text-[11px] font-semibold text-slate-400 uppercase">
            {{ t(language, 'mode') }}
          </span>
          <span class="text-xs font-bold text-slate-200">
            {{ mode === 'pve' ? t(language, 'modePvE') : mode === 'pvp' ? t(language, 'modePvP') : t(language, 'modeEvE') }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button
          class="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700 shadow"
          @click="emit('close')"
        >
          <Eye class="w-4 h-4" />
          <span>{{ t(language, 'reviewBoard') }}</span>
        </button>

        <button
          class="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
          @click="emit('play-again')"
        >
          <RotateCcw class="w-4 h-4" />
          <span>{{ t(language, 'playAgain') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
