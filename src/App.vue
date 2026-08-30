<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { Difficulty, GameMode, GameState, Language, Player, Position } from './types/game';
import { createInitialGameState, executePlayerMove } from './engine/boardState';
import { getValidMovesForPiece, isInOpponentTrap } from './engine/rules';
import { getBestAiMove } from './engine/ai/minimax';
import { soundEffects } from './audio/soundEffects';

// Components
import HeaderComponent from './components/Header.vue';
import BoardComponent from './components/Board.vue';
import GraveyardComponent from './components/Graveyard.vue';
import MoveHistoryComponent from './components/MoveHistory.vue';
import GameControlsComponent from './components/GameControls.vue';
import RulebookModal from './components/RulebookModal.vue';
import VictoryModal from './components/VictoryModal.vue';

// --- State ---
const language = ref<Language>(
  (localStorage.getItem('jungle_language') as Language) || 'zh-TW'
);
const isMuted = ref<boolean>(soundEffects.getMuted());
const mode = ref<GameMode>(
  (localStorage.getItem('jungle_mode') as GameMode) || 'pve'
);
const difficulty = ref<Difficulty>(
  (localStorage.getItem('jungle_difficulty') as Difficulty) || 'medium'
);
const playerSide = ref<Player>(
  (localStorage.getItem('jungle_player_side') as Player) || 'red'
);

const isRulebookOpen = ref<boolean>(false);
const isVictoryModalOpen = ref<boolean>(false);

const gameState = reactive<GameState>(createInitialGameState());

// Undo / Redo history stacks
const undoStack = ref<GameState[]>([]);
const redoStack = ref<GameState[]>([]);

// Hint move
const hintMove = ref<{ from: Position; to: Position } | null>(null);

// --- Computed ---
const canUndo = computed(() => undoStack.value.length > 0 && !gameState.isAiThinking);
const canRedo = computed(() => redoStack.value.length > 0 && !gameState.isAiThinking);

// --- Sound Controls ---
function toggleSound() {
  isMuted.value = soundEffects.toggleMute();
}

function toggleLanguage() {
  language.value = language.value === 'zh-TW' ? 'en' : 'zh-TW';
  localStorage.setItem('jungle_language', language.value);
}

// Watch settings to persist
watch(mode, (newMode) => localStorage.setItem('jungle_mode', newMode));
watch(difficulty, (newDiff) => localStorage.setItem('jungle_difficulty', newDiff));
watch(playerSide, (newSide) => localStorage.setItem('jungle_player_side', newSide));

// --- Game Logic ---
function resetGame() {
  const initial = createInitialGameState();
  Object.assign(gameState, initial);
  undoStack.value = [];
  redoStack.value = [];
  hintMove.value = null;
  isVictoryModalOpen.value = false;

  // If computer plays first (e.g. human is Blue or in demo mode)
  checkTriggerAiTurn();
}

function selectPiece(pos: Position) {
  if (gameState.isGameOver || gameState.isAiThinking) return;

  // In PvE, check if it's the player's turn to click
  if (mode.value === 'pve' && gameState.currentTurn !== playerSide.value) {
    return;
  }
  // In EvE (Demo), player cannot move pieces manually
  if (mode.value === 'eve') return;

  const piece = gameState.board[pos.row][pos.col];
  if (piece && piece.player === gameState.currentTurn) {
    gameState.selectedPosition = pos;
    gameState.validMoves = getValidMovesForPiece(gameState.board, pos);
    soundEffects.playSelect();
  } else {
    gameState.selectedPosition = null;
    gameState.validMoves = [];
  }
  hintMove.value = null;
}

async function handleMovePiece(from: Position, to: Position) {
  if (gameState.isGameOver || gameState.isAiThinking) return;

  // Push current state to undo stack before moving
  undoStack.value.push(JSON.parse(JSON.stringify(gameState)));
  redoStack.value = []; // Clear redo on new move

  const { nextState, executedMove } = executePlayerMove(gameState, from, to);
  if (!executedMove) return;

  Object.assign(gameState, nextState);
  hintMove.value = null;

  // Play appropriate sound
  if (executedMove.isJump) {
    soundEffects.playJump();
  } else if (executedMove.capturedPiece) {
    soundEffects.playCapture();
  } else if (isInOpponentTrap(to, executedMove.piece.player)) {
    soundEffects.playTrap();
  } else {
    soundEffects.playMove();
  }

  // Check victory / game over
  if (gameState.isGameOver) {
    if (gameState.winner === playerSide.value || mode.value === 'pvp') {
      soundEffects.playVictory();
    } else {
      soundEffects.playDefeat();
    }
    isVictoryModalOpen.value = true;
    return;
  }

  // Trigger AI if applicable
  checkTriggerAiTurn();
}

async function checkTriggerAiTurn() {
  if (gameState.isGameOver) return;

  const isAiTurn =
    mode.value === 'eve' ||
    (mode.value === 'pve' && gameState.currentTurn !== playerSide.value);

  if (!isAiTurn) return;

  gameState.isAiThinking = true;

  try {
    const aiMove = await getBestAiMove(
      gameState.board,
      gameState.currentTurn,
      difficulty.value,
      gameState.lastMove
    );

    if (aiMove && !gameState.isGameOver) {
      const { nextState, executedMove } = executePlayerMove(
        gameState,
        aiMove.from,
        aiMove.to
      );

      if (executedMove) {
        Object.assign(gameState, nextState);

        if (executedMove.isJump) {
          soundEffects.playJump();
        } else if (executedMove.capturedPiece) {
          soundEffects.playCapture();
        } else if (isInOpponentTrap(executedMove.to, executedMove.piece.player)) {
          soundEffects.playTrap();
        } else {
          soundEffects.playMove();
        }

        if (gameState.isGameOver) {
          if (gameState.winner === playerSide.value || mode.value === 'pvp') {
            soundEffects.playVictory();
          } else {
            soundEffects.playDefeat();
          }
          isVictoryModalOpen.value = true;
        } else if (mode.value === 'eve') {
          // In Demo mode, loop AI turns with delay
          setTimeout(() => {
            checkTriggerAiTurn();
          }, 600);
        }
      }
    }
  } finally {
    gameState.isAiThinking = false;
  }
}

function handleUndo() {
  if (!canUndo.value || gameState.isAiThinking) return;

  // In PvE mode, undo 2 steps (AI move + human move) unless it's only 1 move
  if (mode.value === 'pve' && undoStack.value.length >= 2) {
    redoStack.value.push(JSON.parse(JSON.stringify(gameState)));
    undoStack.value.pop(); // Pop AI move state
    const prevState = undoStack.value.pop();
    if (prevState) {
      Object.assign(gameState, prevState);
    }
  } else {
    redoStack.value.push(JSON.parse(JSON.stringify(gameState)));
    const prevState = undoStack.value.pop();
    if (prevState) {
      Object.assign(gameState, prevState);
    }
  }

  hintMove.value = null;
  isVictoryModalOpen.value = false;
  soundEffects.playMove();
}

function handleRedo() {
  if (!canRedo.value || gameState.isAiThinking) return;

  const nextState = redoStack.value.pop();
  if (nextState) {
    undoStack.value.push(JSON.parse(JSON.stringify(gameState)));
    Object.assign(gameState, nextState);
    soundEffects.playMove();
  }
}

async function handleHint() {
  if (gameState.isGameOver || gameState.isAiThinking) return;

  const bestMove = await getBestAiMove(
    gameState.board,
    gameState.currentTurn,
    'hard',
    gameState.lastMove
  );

  if (bestMove) {
    hintMove.value = { from: bestMove.from, to: bestMove.to };
    gameState.selectedPosition = bestMove.from;
    gameState.validMoves = getValidMovesForPiece(gameState.board, bestMove.from);
    soundEffects.playSelect();
  }
}

onMounted(() => {
  checkTriggerAiTurn();
});
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-white text-slate-800 antialiased selection:bg-red-500 selection:text-white">
    <!-- Top Navigation Header -->
    <HeaderComponent
      :language="language"
      :is-muted="isMuted"
      @toggle-language="toggleLanguage"
      @toggle-sound="toggleSound"
      @open-rules="isRulebookOpen = true"
      @restart-game="resetGame"
    />

    <!-- Main Game Arena -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 py-3 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
      <!-- Left Sidebar: Controls & Captured pieces -->
      <div class="lg:col-span-3 flex flex-col gap-3.5 order-2 lg:order-1">
        <!-- Blue Player Tray (Captured Red pieces) -->
        <GraveyardComponent
          player="blue"
          :captured-pieces="gameState.capturedPieces.blue"
          :language="language"
          :title="language === 'zh-TW' ? '藍方吃子 (俘虜)' : 'Blue Captures'"
        />

        <!-- Game Controls & Settings -->
        <GameControlsComponent
          v-model:mode="mode"
          v-model:difficulty="difficulty"
          v-model:playerSide="playerSide"
          :current-turn="gameState.currentTurn"
          :is-ai-thinking="gameState.isAiThinking"
          :can-undo="canUndo"
          :can-redo="canRedo"
          :language="language"
          :is-game-over="gameState.isGameOver"
          @undo="handleUndo"
          @redo="handleRedo"
          @hint="handleHint"
        />
      </div>

      <!-- Center: 7x9 Jungle Board -->
      <div class="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
        <BoardComponent
          :game-state="gameState"
          :language="language"
          :hint-move="hintMove"
          @select-piece="selectPiece"
          @move-piece="handleMovePiece"
        />
      </div>

      <!-- Right Sidebar: Move History & Red Player Tray -->
      <div class="lg:col-span-3 flex flex-col gap-3.5 order-3">
        <!-- Red Player Tray (Captured Blue pieces) -->
        <GraveyardComponent
          player="red"
          :captured-pieces="gameState.capturedPieces.red"
          :language="language"
          :title="language === 'zh-TW' ? '紅方吃子 (俘虜)' : 'Red Captures'"
        />

        <!-- Move History Log -->
        <MoveHistoryComponent
          :moves="gameState.moveHistory"
          :language="language"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full text-center py-3 text-slate-500 text-xs border-t border-slate-200 bg-white">
      <span>Jungle / 鬥獸棋 &copy; 2026 • Built with Vue 3 & Vite • 繁體中文 & English</span>
    </footer>

    <!-- Modals -->
    <RulebookModal
      :is-open="isRulebookOpen"
      :language="language"
      @close="isRulebookOpen = false"
    />

    <VictoryModal
      :is-open="isVictoryModalOpen"
      :winner="gameState.winner"
      :win-reason="gameState.winReason"
      :player-side="playerSide"
      :mode="mode"
      :move-count="gameState.moveHistory.length"
      :language="language"
      @play-again="resetGame"
      @close="isVictoryModalOpen = false"
    />
  </div>
</template>
