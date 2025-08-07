import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import FinishedPhase from '../../components/FinishedPhase';
import GameHeader from '../../components/GameHeader';
import PlayingPhase from '../../components/PlayingPhase';
import ResultsPhase from '../../components/ResultsPhase';
import WaitingPhase from '../../components/WaitingPhase';
import { useGame } from '../../contexts/GameContext';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function calculateScore(selectedAnswers: boolean[], answers: any[], difficulty: number): number {
    let score = 0;
    selectedAnswers.forEach((isSelected, index) => {
        if (isSelected && answers[index]) {
            const answer = answers[index];
            if (answer.isTrap) {
                score += answer.points;
            } else if (answer.isCorrect) {
                score += answer.points;
            }
        }
    });
    return score;
}

export default function GameScreen() {
    const { state, dispatch } = useGame();
    const currentTeam = state.teams[state.currentTeamIndex];

    const startRound = () => {
        dispatch({ type: 'START_ROUND' });
        dispatch({ type: 'START_TIMER' });
    };

    const selectAnswer = (index: number) => {
        if (
            (state.gamePhase === 'playing' && state.isTimerActive) ||
            state.gamePhase === 'results'
        ) {
            dispatch({ type: 'SELECT_ANSWER', payload: index });

            // Si on est en phase de résultats, recalculer et mettre à jour le score immédiatement
            if (state.gamePhase === 'results' && state.currentQuestion) {
                // Calculer le nouveau tableau de sélections
                const newSelectedAnswers = [...state.selectedAnswers];
                newSelectedAnswers[index] = !newSelectedAnswers[index];

                // Calculer le nouveau score basé sur les nouvelles sélections
                const newPoints = calculateScore(
                    newSelectedAnswers,
                    state.currentQuestion.answers,
                    state.currentQuestion.difficulty,
                );

                // Calculer l'ancien score pour cette question
                const oldPoints = calculateScore(
                    state.selectedAnswers,
                    state.currentQuestion.answers,
                    state.currentQuestion.difficulty,
                );

                // Mettre à jour le score total en ajustant la différence
                const scoreDifference = newPoints - oldPoints;
                dispatch({
                    type: 'SET_TEAM_SCORE',
                    payload: {
                        teamId: currentTeam.id,
                        score: currentTeam.score + scoreDifference,
                    },
                });
            }
        }
    };

    const submitAnswers = React.useCallback(() => {
        if (state.currentQuestion) {
            const points = calculateScore(
                state.selectedAnswers,
                state.currentQuestion.answers,
                state.currentQuestion.difficulty,
            );
            dispatch({ type: 'UPDATE_SCORE', payload: { teamId: currentTeam.id, points } });
        }
        dispatch({ type: 'SUBMIT_ANSWERS' });
    }, [state.currentQuestion, state.selectedAnswers, currentTeam.id, dispatch]);

    const nextTeam = () => {
        dispatch({ type: 'NEXT_TEAM' });
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        dispatch({ type: 'START_GAME' });
    };

    // Gestion automatique de la soumission quand le timer arrive à 0
    React.useEffect(() => {
        if (state.timeRemaining === 0 && state.gamePhase === 'playing') {
            submitAnswers();
        }
    }, [state.timeRemaining, state.gamePhase, submitAnswers]);

    return (
        <SafeAreaView className={`flex-1 ${currentTeam?.color || 'bg-dark-blue'}`}>
            <ScrollView className="flex-1 px-6 mt-6 mb-6">
                <GameHeader
                    currentRound={state.currentRound}
                    totalRounds={state.totalRounds}
                    currentTeamName={currentTeam?.name || ''}
                    teams={state.teams}
                    timeRemaining={state.timeRemaining}
                    formatTime={formatTime}
                />

                {/* Composant dynamique selon la phase */}
                {state.gamePhase === 'waiting' && (
                    <WaitingPhase
                        currentTeamName={currentTeam?.name || ''}
                        onStartRound={startRound}
                    />
                )}

                {state.gamePhase === 'playing' && state.currentQuestion && (
                    <PlayingPhase
                        currentQuestion={state.currentQuestion}
                        selectedAnswers={state.selectedAnswers}
                        isTimerActive={state.isTimerActive}
                        onSelectAnswer={selectAnswer}
                        onSubmitAnswers={submitAnswers}
                    />
                )}

                {state.gamePhase === 'results' && state.currentQuestion && (
                    <ResultsPhase
                        currentQuestion={state.currentQuestion}
                        selectedAnswers={state.selectedAnswers}
                        calculateScore={calculateScore}
                        onSelectAnswer={selectAnswer}
                        onNextTeam={nextTeam}
                    />
                )}

                {state.gamePhase === 'finished' && (
                    <FinishedPhase teams={state.teams} onResetGame={resetGame} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
