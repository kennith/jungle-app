<script setup lang="ts">
import { Language } from '../types/game';
import { t } from '../constants/translations';
import { Volume2, VolumeX, BookOpen, RotateCcw, Globe } from 'lucide-vue-next';

defineProps<{
  language: Language;
  isMuted: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-language'): void;
  (e: 'toggle-sound'): void;
  (e: 'open-rules'): void;
  (e: 'restart-game'): void;
}>();
</script>

<template>
  <header class="w-full max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between border-b border-slate-800/80">
    <!-- Brand Title -->
    <div class="flex items-center space-x-3">
      <!-- Stamp Seal Icon -->
      <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-emerald-600 via-green-700 to-green-950 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center">
        <span class="font-oriental font-black text-amber-300 text-lg sm:text-2xl leading-none">
          獸
        </span>
      </div>

      <div>
        <div class="flex items-center space-x-2">
          <h1 class="text-lg sm:text-2xl font-black font-cinzel tracking-wider text-amber-400 drop-shadow">
            {{ language === 'zh-TW' ? '鬥獸棋' : 'JUNGLE' }}
          </h1>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {{ language === 'zh-TW' ? 'Dou Shou Qi' : '鬥獸棋' }}
          </span>
        </div>
        <p class="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
          {{ t(language, 'tagline') }}
        </p>
      </div>
    </div>

    <!-- Actions & Controls -->
    <div class="flex items-center space-x-1.5 sm:space-x-2">
      <!-- Language Toggle -->
      <button
        class="flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 transition-colors text-xs font-bold shadow-sm"
        :title="language === 'zh-TW' ? 'Switch to English' : '切換為繁體中文'"
        @click="emit('toggle-language')"
      >
        <Globe class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
        <span>{{ t(language, 'switchLang') }}</span>
      </button>

      <!-- Sound Toggle -->
      <button
        class="p-1.5 sm:p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-sm"
        :title="isMuted ? t(language, 'soundOn') : t(language, 'soundOff')"
        @click="emit('toggle-sound')"
      >
        <VolumeX v-if="isMuted" class="w-4 h-4 text-rose-400" />
        <Volume2 v-else class="w-4 h-4 text-emerald-400" />
      </button>

      <!-- Rules Guide Trigger -->
      <button
        class="flex items-center space-x-1 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs font-semibold shadow-sm"
        :title="t(language, 'rules')"
        @click="emit('open-rules')"
      >
        <BookOpen class="w-4 h-4 text-amber-400" />
        <span class="hidden sm:inline">{{ t(language, 'rules') }}</span>
      </button>

      <!-- Restart Game Button -->
      <button
        class="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
        @click="emit('restart-game')"
      >
        <RotateCcw class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span class="hidden sm:inline">{{ t(language, 'newGame') }}</span>
      </button>
    </div>
  </header>
</template>
