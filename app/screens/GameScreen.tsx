import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
                score -= 5;
            } else if (answer.isCorrect) {
                score += difficulty;
            }
        }
    });
    return Math.max(0, score);
}

export default function GameScreen() {
    const { state, dispatch } = useGame();
    const currentTeam = state.teams[state.currentTeamIndex];

    const startRound = () => {
        dispatch({ type: 'START_ROUND' });
        dispatch({ type: 'START_TIMER' });
    };

    const selectAnswer = (index: number) => {
        if (state.gamePhase === 'playing' && state.isTimerActive) {
            dispatch({ type: 'SELECT_ANSWER', payload: index });
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

    // Gestion automatique de la soumission quand le timer arrive à 0
    React.useEffect(() => {
        if (state.timeRemaining === 0 && state.gamePhase === 'playing') {
            submitAnswers();
        }
    }, [state.timeRemaining, state.gamePhase, submitAnswers]);

    return (
        <SafeAreaView className={`flex-1 ${currentTeam?.color || 'bg-dark-blue'}`}>
            <ScrollView className="flex-1 px-6">
                {/* Round */}
                <Text className="text-center text-2xl font-bold mt-8 mb-4 text-gray-800">
                    Round {state.currentRound}/{state.totalRounds}
                </Text>

                {/* Nom de l'équipe */}
                <Text className="text-center text-3xl font-bold mb-4 text-gray-800">
                    {currentTeam?.name}
                </Text>

                {/* Score global des équipes */}
                <View className="flex-row justify-center mb-6">
                    {state.teams.map((team) => (
                        <View key={team.id} className="mx-2 p-2 bg-white/20 rounded-lg">
                            <Text className="text-center text-sm font-medium text-gray-800">
                                {team.name}
                            </Text>
                            <Text className="text-center text-lg font-bold text-gray-800">
                                {team.score} pts
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Barre pointillée */}
                <View className="border-b-2 border-dashed border-gray-600 mb-6" />

                {/* Timer */}
                <Text
                    className={`text-center text-4xl font-bold mb-6 ${
                        state.timeRemaining <= 10
                            ? 'text-red-600'
                            : state.timeRemaining <= 30
                              ? 'text-orange-600'
                              : 'text-green-600'
                    }`}
                >
                    {formatTime(state.timeRemaining)}
                </Text>

                {/* Composant dynamique selon la phase */}
                {state.gamePhase === 'waiting' && (
                    <View className="items-center">
                        <Text className="text-center text-xl font-semibold mb-6 text-gray-800">
                            À l&apos;équipe &quot;{currentTeam?.name}&quot; de jouer !
                        </Text>
                        <Text className="text-center text-lg mb-8 text-gray-700">
                            Passe le téléphone à une autre équipe
                        </Text>
                        <TouchableOpacity
                            onPress={startRound}
                            className="bg-green-600 px-8 py-4 rounded-2xl"
                        >
                            <Text className="text-white text-xl font-bold">Jouer</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {state.gamePhase === 'playing' && state.currentQuestion && (
                    <View>
                        {/* Question */}
                        <View className="bg-white/30 rounded-2xl p-6 mb-6">
                            <Text className="text-center text-xl font-bold mb-2 text-gray-800">
                                {state.currentQuestion.theme}
                            </Text>
                        </View>

                        {/* Réponses */}
                        <View className="mb-6">
                            {state.currentQuestion.answers.map((answer, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => selectAnswer(index)}
                                    disabled={!state.isTimerActive}
                                    className={`p-4 mb-3 rounded-xl border-2 ${
                                        state.selectedAnswers[index]
                                            ? 'bg-blue-600 border-blue-700'
                                            : 'bg-white/50 border-gray-400'
                                    }`}
                                >
                                    <Text
                                        className={`text-center font-medium ${
                                            state.selectedAnswers[index]
                                                ? 'text-white'
                                                : 'text-gray-800'
                                        }`}
                                    >
                                        {answer.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Bouton valider */}
                        {state.selectedAnswers.some(Boolean) && state.isTimerActive && (
                            <TouchableOpacity
                                onPress={submitAnswers}
                                className="bg-blue-600 p-4 rounded-2xl mb-6"
                            >
                                <Text className="text-white text-center text-lg font-bold">
                                    Valider les réponses
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
                            <Text className="text-lg font-bold mb-4 text-gray-800">
                                Corrections:
                            </Text>
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
                                } else if (isCorrect) {
                                    bgColor = 'bg-green-200';
                                    textColor = 'text-green-800';
                                    icon = '✅ ';
                                }

                                return (
                                    <View key={index} className={`p-3 mb-2 rounded-lg ${bgColor}`}>
                                        <Text className={`${textColor} font-medium`}>
                                            {icon}
                                            {answer.text}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            onPress={nextTeam}
                            className="bg-blue-600 p-4 rounded-2xl"
                        >
                            <Text className="text-white text-center text-lg font-bold">
                                Équipe suivante
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {state.gamePhase === 'finished' && (
                    <View className="items-center">
                        <Text className="text-center text-3xl font-bold mb-8 text-gray-800">
                            Fin du jeu !
                        </Text>

                        {/* Classement final */}
                        <View className="w-full mb-8">
                            <Text className="text-xl font-bold mb-4 text-gray-800">
                                Classement final:
                            </Text>
                            {[...state.teams]
                                .sort((a, b) => b.score - a.score)
                                .map((team, index) => (
                                    <View
                                        key={team.id}
                                        className="flex-row justify-between items-center p-4 mb-2 bg-white/30 rounded-lg"
                                    >
                                        <View className="flex-row items-center">
                                            <Text className="text-lg font-bold mr-3 text-gray-800">
                                                {index + 1}.
                                            </Text>
                                            <Text className="text-lg font-medium text-gray-800">
                                                {team.name}
                                            </Text>
                                        </View>
                                        <Text className="text-lg font-bold text-gray-800">
                                            {team.score} pts
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
