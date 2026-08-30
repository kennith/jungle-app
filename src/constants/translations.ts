import { Language } from '../types/game';

export const TRANSLATIONS = {
  en: {
    appTitle: 'Jungle Board Game',
    subtitle: 'Dou Shou Qi / Animal Chess',
    tagline: 'An ancient game of wits and jungle instincts',

    // Nav & Controls
    newGame: 'New Game',
    restart: 'Restart',
    undo: 'Undo Move',
    redo: 'Redo',
    hint: 'Get Hint',
    rules: 'Game Rules',
    settings: 'Settings',
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
    switchLang: '繁體中文',

    // Game Mode & Difficulty
    mode: 'Game Mode',
    modePvE: 'vs Computer',
    modePvP: 'Pass & Play (2P)',
    modeEvE: 'AI vs AI (Demo)',
    difficulty: 'AI Difficulty',
    diffEasy: 'Beginner (Easy)',
    diffMedium: 'Adept (Medium)',
    diffHard: 'Master (Hard)',
    selectSide: 'Play As',
    sideRed: 'Red (Goes First)',
    sideBlue: 'Blue (Goes Second)',

    // In-game status
    turnRed: "Red's Turn",
    turnBlue: "Blue's Turn",
    yourTurn: 'Your Turn',
    aiThinking: 'Computer is thinking...',
    evaluating: 'Evaluating moves...',
    gameOver: 'Game Over',
    redWins: 'Red Wins!',
    blueWins: 'Blue Wins!',
    draw: 'Draw Game',
    denCapturedMsg: 'infiltrated the enemy Den!',
    allCapturedMsg: 'captured all enemy pieces!',
    noMovesMsg: 'opponent has no legal moves left!',
    surrenderMsg: 'resigned the match.',

    // Board & pieces
    den: 'Den',
    trap: 'Trap',
    river: 'River',
    rank: 'Rank',
    capturedPieces: 'Captured Pieces',
    moveHistory: 'Move History',
    noMovesYet: 'No moves recorded yet.',
    step: 'Step',

    // Pieces
    elephant: 'Elephant',
    lion: 'Lion',
    tiger: 'Tiger',
    leopard: 'Leopard',
    wolf: 'Wolf',
    dog: 'Dog',
    cat: 'Cat',
    rat: 'Rat',

    // Victory modal
    victoryTitle: 'Victory!',
    defeatTitle: 'Defeat',
    drawTitle: 'Match Drawn',
    victorySubtitle: 'You outsmarted the wild beasts and claimed the den!',
    defeatSubtitle: 'The computer outmaneuvered your animals.',
    totalMoves: 'Total Moves',
    gameDuration: 'Game Duration',
    playAgain: 'Play Again',
    reviewBoard: 'Review Board',

    // Rulebook
    rulesTitle: 'Jungle (Dou Shou Qi) Rules',
    rulesIntro: 'Jungle is a traditional Chinese two-player strategy game played on a 7×9 grid. The objective is to move any animal into the opponent’s Den or capture all opponent pieces.',
    rulesObjectiveHeading: '1. Objective',
    rulesObjectiveText: 'Win by entering any of your animal pieces into the opponent\'s Den (獸穴), or by eliminating all enemy pieces.',
    rulesHierarchyHeading: '2. Animal Hierarchy (Rank 8 to 1)',
    rulesHierarchyDesc: 'Stronger pieces can capture pieces of equal or lower rank. The hierarchy from strongest to weakest is:',
    rulesSpecialRulesHeading: '3. Special Terrain & Abilities',
    rulesRatSpecial: '• Rat (鼠, Rank 1): Can enter river squares. On land, the Rat can capture the mighty Elephant! However, a Rat in water cannot attack any piece on land, nor can an Elephant attack a Rat in water.',
    rulesJumpSpecial: '• Lion (獅, Rank 7) & Tiger (虎, Rank 6): Can jump over the river horizontally or vertically in a straight line, capturing any valid enemy piece on the landing square. If a Rat (friend or foe) is swimming in the intervening water path, the jump is blocked.',
    rulesTrapSpecial: '• Traps (陷阱): If an animal enters an OPPONENT’s trap, its rank drops to 0 while inside. Any defending piece can capture it! Animals are safe in their own traps.',
    rulesDenSpecial: '• Dens (獸穴): You CANNOT enter your own Den. Entering the opponent’s Den wins the game immediately!',
    close: 'Close',
  },

  'zh-TW': {
    appTitle: '鬥獸棋',
    subtitle: 'Dou Shou Qi / Jungle Board Game',
    tagline: '經典傳統智力棋盤遊戲，縱橫叢林，智破獸穴',

    // Nav & Controls
    newGame: '開新局',
    restart: '重新開始',
    undo: '悔棋 (撤銷)',
    redo: '重做',
    hint: '提示走法',
    rules: '遊戲規則',
    settings: '設定',
    soundOn: '音效開啟',
    soundOff: '音效靜音',
    switchLang: 'English',

    // Game Mode & Difficulty
    mode: '對戰模式',
    modePvE: '人機對戰 (單人)',
    modePvP: '雙人同屏 (對戰)',
    modeEvE: '電腦對局 (觀戰)',
    difficulty: '電腦難度',
    diffEasy: '初級 (入門)',
    diffMedium: '中級 (熟練)',
    diffHard: '高級 (大師)',
    selectSide: '執棋方',
    sideRed: '執紅棋 (先手)',
    sideBlue: '執藍棋 (後手)',

    // In-game status
    turnRed: '紅方走棋',
    turnBlue: '藍方走棋',
    yourTurn: '輪到你的回合',
    aiThinking: '電腦正在思考...',
    evaluating: '正在計算最佳走法...',
    gameOver: '對局結束',
    redWins: '紅方獲勝！',
    blueWins: '藍方獲勝！',
    draw: '雙方和棋',
    denCapturedMsg: '佔領了對手的獸穴！',
    allCapturedMsg: '消滅了對手所有動物！',
    noMovesMsg: '對手已無子可動！',
    surrenderMsg: '認輸投降。',

    // Board & pieces
    den: '獸穴',
    trap: '陷阱',
    river: '小河',
    rank: '等級',
    capturedPieces: '已吃棋子',
    moveHistory: '棋譜記錄',
    noMovesYet: '尚未走棋',
    step: '步數',

    // Pieces
    elephant: '象',
    lion: '獅',
    tiger: '虎',
    leopard: '豹',
    wolf: '狼',
    dog: '狗',
    cat: '貓',
    rat: '鼠',

    // Victory modal
    victoryTitle: '恭喜獲勝！',
    defeatTitle: '對局惜敗',
    drawTitle: '握手言和',
    victorySubtitle: '你運籌帷幄，成功攻佔敵方獸穴！',
    defeatSubtitle: '電腦棋高一著，再接再厲！',
    totalMoves: '總回合步數',
    gameDuration: '對局時間',
    playAgain: '再來一局',
    reviewBoard: '查看棋局',

    // Rulebook
    rulesTitle: '鬥獸棋規則說明',
    rulesIntro: '鬥獸棋是中華傳統棋類遊戲，棋盤為 7×9 格。勝負目標為將己方任一動物棋子走進對手的獸穴，或吃光對手的所有棋子。',
    rulesObjectiveHeading: '一、勝負判定',
    rulesObjectiveText: '只要任一動物進入對方的「獸穴」（Den）即直接獲勝；或者將對手的所有動物全部吃光亦獲勝。',
    rulesHierarchyHeading: '二、動物等級（8級 至 1級）',
    rulesHierarchyDesc: '高等級動物可吃同級或低等級動物。等級由高至低依次為：',
    rulesSpecialRulesHeading: '三、特殊地形與特殊能力',
    rulesRatSpecial: '• 老鼠（鼠，1級）：唯一能進入小河的動物。在陸地上可吃大象！但在水中小河中不能攻擊陸地上的動物，大象在陸地上也不能吃水中的老鼠。',
    rulesJumpSpecial: '• 獅子（獅，7級）與老虎（虎，6級）：可橫向或縱向直線跳過小河，並吃掉對岸同級或低級的敵方動物。若小河中有老鼠（無論敵我）擋道，則不可跳河。',
    rulesTrapSpecial: '• 陷阱（陷阱）：當動物走入「敵方」的陷阱時，該動物等級暫時降為0級，任何敵方棋子皆可將其吃掉！動物在己方陷阱中不受影響。',
    rulesDenSpecial: '• 獸穴（獸穴）：不可進入己方獸穴。進入敵方獸穴立即獲勝！',
    close: '關閉',
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export function t(lang: Language, key: TranslationKey): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return (dict as Record<string, string>)[key] || TRANSLATIONS.en[key] || key;
}
