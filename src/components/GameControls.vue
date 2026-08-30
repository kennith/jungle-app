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
  <div class="flex flex-col gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md">
    <!-- Current Status Bar -->
    <div
      class="flex items-center justify-between px-3 py-2 rounded-lg border transition-all"
      :class="[
        currentTurn === 'red'
          ? 'bg-red-950/40 border-red-800/60 text-red-200'
          : 'bg-blue-950/40 border-blue-800/60 text-blue-200',
        isAiThinking ? 'animate-pulse' : ''
      ]"
    >
      <div class="flex items-center space-x-2">
        <span
          class="w-3 h-3 rounded-full animate-ping"
          :class="currentTurn === 'red' ? 'bg-red-500' : 'bg-cyan-400'"
        ></span>
        <span class="font-bold text-sm">
          {{ currentTurn === 'red' ? t(language, 'turnRed') : t(language, 'turnBlue') }}
        </span>
      </div>

      <div class="flex items-center text-xs font-semibold">
        <span v-if="isAiThinking" class="text-amber-400 flex items-center gap-1">
          <Bot class="w-3.5 h-3.5 animate-spin" />
          {{ t(language, 'aiThinking') }}
        </span>
        <span v-else-if="!isGameOver && mode === 'pve' && currentTurn === playerSide" class="text-emerald-400">
          {{ t(language, 'yourTurn') }}
        </span>
      </div>
    </div>

    <!-- Mode Selector & Difficulty Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <!-- Game Mode -->
      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          {{ t(language, 'mode') }}
        </label>
        <div class="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            class="px-2 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            :class="mode === 'pve' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
            @click="emit('update:mode', 'pve')"
          >
            <Bot class="w-3 h-3" />
            <span>AI</span>
          </button>

          <button
            class="px-2 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            :class="mode === 'pvp' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
            @click="emit('update:mode', 'pvp')"
          >
            <Users class="w-3 h-3" />
            <span>2P</span>
          </button>

          <button
            class="px-2 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            :class="mode === 'eve' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
            @click="emit('update:mode', 'eve')"
          >
            <Play class="w-3 h-3" />
            <span>Demo</span>
          </button>
        </div>
      </div>

      <!-- AI Difficulty (visible if PvE) -->
      <div v-if="mode === 'pve'">
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          {{ t(language, 'difficulty') }}
        </label>
        <div class="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            class="px-1.5 py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all text-center"
            :class="difficulty === 'easy' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'"
            @click="emit('update:difficulty', 'easy')"
          >
            {{ language === 'zh-TW' ? '初級' : 'Easy' }}
          </button>
          <button
            class="px-1.5 py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all text-center"
            :class="difficulty === 'medium' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'"
            @click="emit('update:difficulty', 'medium')"
          >
            {{ language === 'zh-TW' ? '中級' : 'Med' }}
          </button>
          <button
            class="px-1.5 py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all text-center"
            :class="difficulty === 'hard' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'"
            @click="emit('update:difficulty', 'hard')"
          >
            {{ language === 'zh-TW' ? '高級' : 'Hard' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Actions: Undo, Redo, Hint -->
    <div class="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
      <button
        class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all shadow-sm border border-slate-700"
        :disabled="!canUndo || isAiThinking"
        @click="emit('undo')"
      >
        <Undo2 class="w-3.5 h-3.5 text-amber-400" />
        <span>{{ t(language, 'undo') }}</span>
      </button>

      <button
        class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all shadow-sm border border-slate-700"
        :disabled="!canRedo || isAiThinking"
        @click="emit('redo')"
      >
        <Redo2 class="w-3.5 h-3.5 text-amber-400" />
        <span>{{ t(language, 'redo') }}</span>
      </button>

      <button
        class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-sm active:scale-95"
        :disabled="isGameOver || isAiThinking"
        @click="emit('hint')"
      >
        <Lightbulb class="w-3.5 h-3.5 text-yellow-300" />
        <span>{{ t(language, 'hint') }}</span>
      </button>
    </div>
  </div>
</template>
