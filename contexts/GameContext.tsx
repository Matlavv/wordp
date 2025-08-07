import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import questionsData from '../data/question.json';
import { Question } from '../types/game';

export interface Team {
    id: string;
    name: string;
    color: string;
    score: number;
}

export interface GameState {
    teams: Team[];
    currentTeamIndex: number;
    currentRound: number;
    totalRounds: number;
    currentQuestion: Question | null;
    selectedAnswers: boolean[];
    foundAnswers: string[]; // Pour le mode solo, stocke les réponses trouvées
    gamePhase: 'waiting' | 'playing' | 'results' | 'finished';
    timeRemaining: number;
    isTimerActive: boolean;
}

type GameAction =
    | { type: 'SET_TEAMS'; payload: Team[] }
    | { type: 'SET_ROUNDS'; payload: number }
    | { type: 'START_GAME' }
    | { type: 'START_SOLO_GAME'; payload: number }
    | { type: 'START_ROUND' }
    | { type: 'SELECT_ANSWER'; payload: number }
    | { type: 'SUBMIT_ANSWER'; payload: string } // Pour le mode solo
    | { type: 'SUBMIT_ANSWERS' }
    | { type: 'NEXT_TEAM' }
    | { type: 'NEXT_SOLO_ROUND' }
    | { type: 'START_TIMER' }
    | { type: 'TICK_TIMER' }
    | { type: 'STOP_TIMER' }
    | { type: 'UPDATE_SCORE'; payload: { teamId: string; points: number } }
    | { type: 'SET_TEAM_SCORE'; payload: { teamId: string; score: number } }
    | { type: 'RESET_GAME' };

const initialState: GameState = {
    teams: [],
    currentTeamIndex: 0,
    currentRound: 1,
    totalRounds: 3,
    currentQuestion: null,
    selectedAnswers: new Array(9).fill(false),
    foundAnswers: new Array(9).fill(''),
    gamePhase: 'waiting',
    timeRemaining: 60,
    isTimerActive: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'SET_TEAMS':
            return { ...state, teams: action.payload };

        case 'SET_ROUNDS':
            return { ...state, totalRounds: action.payload };

        case 'START_GAME':
            return {
                ...state,
                gamePhase: 'waiting',
                currentRound: 1,
                currentTeamIndex: 0,
                currentQuestion: getRandomQuestion(),
            };

        case 'START_SOLO_GAME':
            const soloTeam = [
                {
                    id: 'solo-player',
                    name: 'Joueur Solo',
                    color: 'bg-purple-500',
                    score: 0,
                },
            ];
            return {
                ...state,
                teams: soloTeam,
                totalRounds: action.payload,
                gamePhase: 'waiting',
                currentRound: 1,
                currentTeamIndex: 0,
                currentQuestion: getRandomQuestion(),
            };

        case 'NEXT_SOLO_ROUND':
            const nextSoloRound = state.currentRound + 1;

            if (nextSoloRound > state.totalRounds) {
                return { ...state, gamePhase: 'finished' };
            }

            return {
                ...state,
                currentRound: nextSoloRound,
                gamePhase: 'waiting',
                currentQuestion: getRandomQuestion(),
                selectedAnswers: new Array(9).fill(false),
                foundAnswers: new Array(9).fill(''),
                timeRemaining: 120,
                isTimerActive: false,
            };

        case 'START_ROUND':
            return {
                ...state,
                gamePhase: 'playing',
                timeRemaining: 120, // 2 minutes pour le mode solo
                selectedAnswers: new Array(9).fill(false),
                foundAnswers: new Array(9).fill(''),
            };

        case 'SELECT_ANSWER':
            const newSelectedAnswers = [...state.selectedAnswers];
            newSelectedAnswers[action.payload] = !newSelectedAnswers[action.payload];
            return { ...state, selectedAnswers: newSelectedAnswers };

        case 'SUBMIT_ANSWER':
            if (!state.currentQuestion) return state;

            const userAnswer = normalizeString(action.payload);
            const correctAnswers = state.currentQuestion.answers;
            const newFoundAnswers = [...state.foundAnswers];
            let foundMatch = false;

            // Chercher si la réponse correspond à une des réponses correctes
            correctAnswers.forEach((answer, index) => {
                // Réponse déjà trouvée, ignorer
                if (newFoundAnswers[index] !== '') return;

                const answerText = normalizeString(answer.text);
                const answerWords = answerText.split(' ');

                // Correspondance exacte
                if (answerText === userAnswer) {
                    newFoundAnswers[index] = answer.text;
                    foundMatch = true;
                    return;
                }

                // Correspondance partielle (au moins 3 caractères)
                if (userAnswer.length >= 3 && answerText.includes(userAnswer)) {
                    newFoundAnswers[index] = answer.text;
                    foundMatch = true;
                    return;
                }

                // Correspondance sur un mot complet
                answerWords.forEach((word) => {
                    if (word.length >= 3 && word === userAnswer) {
                        newFoundAnswers[index] = answer.text;
                        foundMatch = true;
                    }
                });
            });

            return { ...state, foundAnswers: newFoundAnswers };

        case 'SUBMIT_ANSWERS':
            return { ...state, gamePhase: 'results', isTimerActive: false };

        case 'NEXT_TEAM':
            const nextTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
            const isNewRound = nextTeamIndex === 0;
            const nextMultiRound = isNewRound ? state.currentRound + 1 : state.currentRound;

            if (nextMultiRound > state.totalRounds) {
                return { ...state, gamePhase: 'finished' };
            }

            return {
                ...state,
                currentTeamIndex: nextTeamIndex,
                currentRound: nextMultiRound,
                gamePhase: 'waiting',
                currentQuestion: getRandomQuestion(),
                selectedAnswers: new Array(9).fill(false),
                foundAnswers: new Array(9).fill(''),
                timeRemaining: 60,
                isTimerActive: false,
            };

        case 'START_TIMER':
            return { ...state, isTimerActive: true };

        case 'TICK_TIMER':
            const newTime = Math.max(0, state.timeRemaining - 1);
            return {
                ...state,
                timeRemaining: newTime,
                isTimerActive: newTime > 0,
                gamePhase: newTime === 0 ? 'results' : state.gamePhase,
            };

        case 'STOP_TIMER':
            return { ...state, isTimerActive: false };

        case 'UPDATE_SCORE':
            return {
                ...state,
                teams: state.teams.map((team) =>
                    team.id === action.payload.teamId
                        ? { ...team, score: team.score + action.payload.points }
                        : team,
                ),
            };

        case 'SET_TEAM_SCORE':
            return {
                ...state,
                teams: state.teams.map((team) =>
                    team.id === action.payload.teamId
                        ? { ...team, score: action.payload.score }
                        : team,
                ),
            };

        case 'RESET_GAME':
            return {
                ...initialState,
                teams: state.teams.map((team) => ({ ...team, score: 0 })), // Garder les équipes mais remettre les scores à 0
                totalRounds: state.totalRounds, // Garder le nombre de rounds
                foundAnswers: new Array(9).fill(''),
            };

        default:
            return state;
    }
}

function getRandomQuestion(): Question {
    const questions = questionsData.questions as Question[];
    return questions[Math.floor(Math.random() * questions.length)];
}

function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .trim();
}

const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (state.isTimerActive) {
            timerRef.current = setInterval(() => {
                dispatch({ type: 'TICK_TIMER' });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [state.isTimerActive]);

    return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
