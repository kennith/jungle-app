<script setup lang="ts">
import { Difficulty, GameMode, Language, Player } from '../types/game';
import { t } from '../constants/translations';
import { Undo2, Redo2, Lightbulb, Bot, Users, Play } from 'lucide-vue-next';

defineProps<{
  mode: GameMode;
  difficulty: Difficulty;
  playerSide: Player;
  currentTurn: Player;
  isAiThinking: boolean;
  canUndo: boolean;
  canRedo: boolean;
  language: Language;
  isGameOver: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:mode', mode: GameMode): void;
  (e: 'update:difficulty', diff: Difficulty): void;
  (e: 'update:playerSide', side: Player): void;
  (e: 'undo'): void;
  (e: 'redo'): void;
  (e: 'hint'): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-3 bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-3.5">
    <!-- Current Status Bar -->
    <div
      class="flex items-center justify-between px-3 py-2 rounded-lg border transition-all"
      :class="[
        currentTurn === 'red'
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-sky-50 border-sky-200 text-sky-800',
        isAiThinking ? 'animate-pulse' : ''
      ]"
    >
      <div class="flex items-center space-x-2">
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :class="currentTurn === 'red' ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.5)]'"
        ></span>
        <span class="font-bold text-sm">
          {{ currentTurn === 'red' ? t(language, 'turnRed') : t(language, 'turnBlue') }}
        </span>
      </div>

      <div class="flex items-center text-xs font-semibold">
        <span v-if="isAiThinking" class="text-amber-600 flex items-center gap-1">
          <Bot class="w-3.5 h-3.5 animate-spin" />
          {{ t(language, 'aiThinking') }}
        </span>
        <span v-else-if="!isGameOver && mode === 'pve' && currentTurn === playerSide" class="text-emerald-700">
          {{ t(language, 'yourTurn') }}
        </span>
      </div>
    </div>

    <!-- Mode Selector & Difficulty Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <!-- Game Mode -->
      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          {{ t(language, 'mode') }}
        </label>
        <div class="grid grid-cols-3 gap-1 bg-slate-200/80 p-1 rounded-lg border border-slate-300">
          <button
            class="px-2 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            :class="mode === 'pve' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="emit('update:mode', 'pve')"
          >
            <Bot class="w-3 h-3" />
            <span>AI</span>
          </button>

          <button
            class="px-2 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            :class="mode === 'pvp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="emit('update:mode', 'pvp')"
          >
            <Users class="w-3 h-3" />
            <span>2P</span>
          </button>

          <button
            class="px-2 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            :class="mode === 'eve' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="emit('update:mode', 'eve')"
          >
            <Play class="w-3 h-3" />
            <span>Demo</span>
          </button>
        </div>
      </div>

      <!-- AI Difficulty (visible if PvE) -->
      <div v-if="mode === 'pve'">
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          {{ t(language, 'difficulty') }}
        </label>
        <div class="grid grid-cols-3 gap-1 bg-slate-200/80 p-1 rounded-lg border border-slate-300">
          <button
            class="px-1.5 py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all text-center"
            :class="difficulty === 'easy' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="emit('update:difficulty', 'easy')"
          >
            {{ language === 'zh-TW' ? '初級' : 'Easy' }}
          </button>
          <button
            class="px-1.5 py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all text-center"
            :class="difficulty === 'medium' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="emit('update:difficulty', 'medium')"
          >
            {{ language === 'zh-TW' ? '中級' : 'Med' }}
          </button>
          <button
            class="px-1.5 py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all text-center"
            :class="difficulty === 'hard' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="emit('update:difficulty', 'hard')"
          >
            {{ language === 'zh-TW' ? '高級' : 'Hard' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Actions: Undo, Redo, Hint as Grid Rows -->
    <div class="grid grid-rows-3 gap-2 pt-1 border-t border-slate-200">
      <button
        class="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all shadow-sm border border-slate-300"
        :disabled="!canUndo || isAiThinking"
        @click="emit('undo')"
      >
        <Undo2 class="w-4 h-4 text-red-600" />
        <span>{{ t(language, 'undo') }}</span>
      </button>

      <button
        class="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all shadow-sm border border-slate-300"
        :disabled="!canRedo || isAiThinking"
        @click="emit('redo')"
      >
        <Redo2 class="w-4 h-4 text-red-600" />
        <span>{{ t(language, 'redo') }}</span>
      </button>

      <button
        class="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-sm active:scale-95"
        :disabled="isGameOver || isAiThinking"
        @click="emit('hint')"
      >
        <Lightbulb class="w-4 h-4 text-yellow-200" />
        <span>{{ t(language, 'hint') }}</span>
      </button>
    </div>
  </div>
</template>
