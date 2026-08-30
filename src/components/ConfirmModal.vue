<script setup lang="ts">
import { Language } from '../types/game';
import { t } from '../constants/translations';
import { RotateCcw } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  language: Language;
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    @click.self="emit('cancel')"
  >
    <div
      class="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center overflow-hidden text-slate-800 animate-scale"
    >
      <!-- Icon Badge -->
      <div
        class="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-3.5 shadow-sm"
      >
        <RotateCcw class="w-6 h-6" />
      </div>

      <!-- Dialog Title -->
      <h3 class="text-lg font-black text-slate-900 font-cinzel mb-2">
        {{ title || t(language, 'confirmResetTitle') }}
      </h3>

      <!-- Dialog Message Body -->
      <p class="text-xs text-slate-600 mb-6 leading-relaxed">
        {{ message || t(language, 'confirmResetMessage') }}
      </p>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button
          class="w-full px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-300 shadow-sm"
          @click="emit('cancel')"
        >
          {{ t(language, 'cancel') }}
        </button>

        <button
          class="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
          @click="emit('confirm')"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>{{ t(language, 'confirm') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
