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
  <header class="w-full max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md">
    <!-- Brand Title -->
    <div class="flex items-center space-x-3">
      <!-- Stamp Seal Icon -->
      <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-red-900 border-2 border-red-400 shadow-sm flex items-center justify-center">
        <span class="font-oriental font-black text-white text-lg sm:text-2xl leading-none">
          獸
        </span>
      </div>

      <div>
        <h1 class="text-xl sm:text-2xl font-black font-cinzel tracking-wider text-red-700 drop-shadow-sm">
          {{ language === 'zh-TW' ? '鬥獸棋' : 'JUNGLE' }}
        </h1>
        <p class="text-[10px] sm:text-xs text-slate-500 hidden sm:block">
          {{ t(language, 'tagline') }}
        </p>
      </div>
    </div>

    <!-- Actions & Controls -->
    <div class="flex items-center space-x-1.5 sm:space-x-2">
      <!-- Language Toggle -->
      <button
        class="flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors text-xs font-bold shadow-sm"
        :title="language === 'zh-TW' ? 'Switch to English' : '切換為繁體中文'"
        @click="emit('toggle-language')"
      >
        <Globe class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
        <span>{{ t(language, 'switchLang') }}</span>
      </button>

      <!-- Sound Toggle -->
      <button
        class="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-sm"
        :title="isMuted ? t(language, 'soundOn') : t(language, 'soundOff')"
        @click="emit('toggle-sound')"
      >
        <VolumeX v-if="isMuted" class="w-4 h-4 text-rose-500" />
        <Volume2 v-else class="w-4 h-4 text-emerald-600" />
      </button>

      <!-- Rules Guide Trigger -->
      <button
        class="flex items-center space-x-1 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors text-xs font-semibold shadow-sm"
        :title="t(language, 'rules')"
        @click="emit('open-rules')"
      >
        <BookOpen class="w-4 h-4 text-red-600" />
        <span class="hidden sm:inline">{{ t(language, 'rules') }}</span>
      </button>

      <!-- Restart Game Button -->
      <button
        class="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        @click="emit('restart-game')"
      >
        <RotateCcw class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span class="hidden sm:inline">{{ t(language, 'newGame') }}</span>
      </button>
    </div>
  </header>
</template>
