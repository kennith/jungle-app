<script setup lang="ts">
import { Language } from '../types/game';
import { ANIMALS } from '../constants/board';
import { t } from '../constants/translations';
import { X, Trophy, Shield, Zap } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  language: Language;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const animalList = [
  ANIMALS.elephant,
  ANIMALS.lion,
  ANIMALS.tiger,
  ANIMALS.leopard,
  ANIMALS.wolf,
  ANIMALS.dog,
  ANIMALS.cat,
  ANIMALS.rat,
];
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    @click.self="emit('close')"
  >
    <div class="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <span class="font-oriental font-bold text-amber-400 text-lg">規</span>
          </div>
          <h2 class="text-lg sm:text-xl font-bold text-amber-400 font-cinzel">
            {{ t(language, 'rulesTitle') }}
          </h2>
        </div>
        <button
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-300">
        <!-- Objective -->
        <section class="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center space-x-2 text-amber-400 font-bold mb-2">
            <Trophy class="w-4 h-4" />
            <h3 class="text-base">{{ t(language, 'rulesObjectiveHeading') }}</h3>
          </div>
          <p class="leading-relaxed text-slate-300">
            {{ t(language, 'rulesObjectiveText') }}
          </p>
        </section>

        <!-- Animal Ranks -->
        <section class="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center space-x-2 text-amber-400 font-bold mb-3">
            <Shield class="w-4 h-4" />
            <h3 class="text-base">{{ t(language, 'rulesHierarchyHeading') }}</h3>
          </div>
          <p class="text-xs text-slate-400 mb-3">
            {{ t(language, 'rulesHierarchyDesc') }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              v-for="animal in animalList"
              :key="animal.type"
              class="flex items-center space-x-3 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-colors"
            >
              <!-- Rank token badge -->
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-lg shadow shrink-0">
                {{ animal.emoji }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-white">
                    {{ language === 'zh-TW' ? animal.nameZh : animal.nameEn }}
                  </span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {{ t(language, 'rank') }} {{ animal.rank }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {{ language === 'zh-TW' ? animal.descriptionZh : animal.descriptionEn }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Special Terrain & Powers -->
        <section class="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
          <div class="flex items-center space-x-2 text-amber-400 font-bold">
            <Zap class="w-4 h-4" />
            <h3 class="text-base">{{ t(language, 'rulesSpecialRulesHeading') }}</h3>
          </div>

          <div class="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div class="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40">
              <p>{{ t(language, 'rulesRatSpecial') }}</p>
            </div>

            <div class="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40">
              <p>{{ t(language, 'rulesJumpSpecial') }}</p>
            </div>

            <div class="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
              <p>{{ t(language, 'rulesTrapSpecial') }}</p>
            </div>

            <div class="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40">
              <p>{{ t(language, 'rulesDenSpecial') }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
        <button
          class="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow transition-colors"
          @click="emit('close')"
        >
          {{ t(language, 'close') }}
        </button>
      </div>
    </div>
  </div>
</template>
