export interface Answer {
    text: string;
    isCorrect: boolean;
    isTrap: boolean;
}

export interface Question {
    id: number;
    theme: string;
    difficulty: number; // 1 à 5
    answers: Answer[];
}

export interface Team {
    id: string;
    name: string;
    score: number;
    color: string;
}

export interface GameAnswer {
    answerId: number;
    isSelected: boolean;
}

export interface GameState {
    teams: Team[];
    currentTeamIndex: number;
    currentQuestion: Question | null;
    selectedAnswers: boolean[]; // Index correspond aux réponses de la question
    currentRound: number;
    totalRounds: number;
    gamePhase: 'setup' | 'question' | 'answers' | 'results' | 'finished';
    timeRemaining: number;
    isTimerActive: boolean;
}

export interface GameContextType {
    gameState: GameState;
    questions: Question[];

    // Actions pour gérer les équipes
    addTeam: (name: string, color: string) => void;
    removeTeam: (teamId: string) => void;
    updateTeamScore: (teamId: string, points: number) => void;

    // Actions pour gérer le jeu
    startGame: (numberOfRounds: number) => void;
    nextQuestion: () => void;
    selectAnswer: (answerIndex: number) => void;
    submitAnswers: () => void;
    nextTeam: () => void;

    // Timer
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;

    // Utilitaires
    calculateScore: (selectedAnswers: boolean[], question: Question) => number;
    getCurrentTeam: () => Team | null;
    resetGame: () => void;
}
