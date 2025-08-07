import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import GameHeader from '../../../components/GameHeader';
import PlayingPhase from '../../../components/PlayingPhase';
import { useGame } from '../../../contexts/GameContext';

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

export default function SoloGameScreen() {
    const { state, dispatch } = useGame();
    const currentTeam = state.teams[0];

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

    const nextRound = () => {
        // En mode solo, utiliser l'action spécifique pour passer au round suivant
        if (state.currentRound >= state.totalRounds) {
            // Si c'est le dernier round, finir la partie
            router.push('/');
            return;
        }

        // Passer au round suivant
        dispatch({ type: 'NEXT_SOLO_ROUND' });
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        router.push('/');
    };

    // Gestion automatique de la soumission quand le timer arrive à 0
    React.useEffect(() => {
        if (state.timeRemaining === 0 && state.gamePhase === 'playing') {
            submitAnswers();
        }
    }, [state.timeRemaining, state.gamePhase, submitAnswers]);

    return (
        <SafeAreaView className="flex-1 bg-blue-200">
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
                    <View>
                        <View className="bg-white/30 rounded-2xl p-6 mb-6">
                            <Text className="text-center text-xl font-bold mb-4 text-gray-800">
                                🎮 Mode Solo
                            </Text>
                            <Text className="text-center text-lg text-gray-800 mb-4">
                                Prêt pour le round {state.currentRound} ?
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={startRound}
                            className="bg-blue-600 p-6 rounded-2xl mb-6"
                        >
                            <Text className="text-white text-center text-xl font-bold">
                                Commencer le round
                            </Text>
                        </TouchableOpacity>
                    </View>
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
                    <View>
                        <Text className="text-center text-2xl font-bold mb-6 text-gray-800">
                            Résultats
                        </Text>

                        {/* Score de ce round */}
                        <View className="bg-white/30 rounded-2xl p-6 mb-6">
                            <Text className="text-center text-lg text-gray-800">
                                Points gagnés ce round:
                            </Text>
                            <Text className="text-center text-3xl font-bold text-green-600">
                                {calculateScore(
                                    state.selectedAnswers,
                                    state.currentQuestion.answers,
                                    state.currentQuestion.difficulty,
                                )}
                            </Text>
                        </View>

                        {/* Corrections */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold mb-4 text-gray-800">Réponses :</Text>
                            {state.currentQuestion.answers.map((answer, index) => {
                                const isSelected = state.selectedAnswers[index];
                                const isCorrect = answer.isCorrect;
                                const isTrap = answer.isTrap;

                                let bgColor = 'bg-white/30';
                                let textColor = 'text-gray-800';
                                let icon = '';

                                if (isSelected) {
                                    if (isTrap) {
                                        bgColor = 'bg-red-500';
                                        textColor = 'text-white';
                                        icon = '❌ ';
                                    } else if (isCorrect) {
                                        bgColor = 'bg-green-500';
                                        textColor = 'text-white';
                                        icon = '✅ ';
                                    } else {
                                        bgColor = 'bg-gray-500';
                                        textColor = 'text-white';
                                        icon = '⭕ ';
                                    }
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => selectAnswer(index)}
                                        className={`p-3 mb-2 rounded-lg ${bgColor} border-2 ${
                                            isSelected ? 'border-blue-400' : 'border-transparent'
                                        }`}
                                    >
                                        <View className="flex-row justify-between items-center">
                                            <Text className={`${textColor} font-medium flex-1`}>
                                                {icon}
                                                {answer.text}
                                            </Text>
                                            <View className="ml-3">
                                                <Text className={`${textColor} text-sm font-bold`}>
                                                    {answer.isTrap ? '-5' : `+${answer.points}`} pts
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            onPress={nextRound}
                            className="bg-blue-600 p-4 rounded-2xl mb-4"
                        >
                            <Text className="text-white text-center text-lg font-bold">
                                {state.currentRound >= state.totalRounds
                                    ? 'Terminer'
                                    : 'Round suivant'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {state.gamePhase === 'finished' && (
                    <View>
                        <View className="bg-white/30 rounded-2xl p-6 mb-6">
                            <Text className="text-center text-3xl font-bold mb-4 text-gray-800">
                                🎉 Partie terminée !
                            </Text>
                            <Text className="text-center text-2xl font-bold mb-6 text-gray-800">
                                Score final : {currentTeam.score} points
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={resetGame}
                            className="bg-blue-600 p-6 rounded-2xl mb-6"
                        >
                            <Text className="text-white text-center text-xl font-bold">
                                Retour au menu
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
