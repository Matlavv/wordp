import { router } from 'expo-router';
import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import GameHeader from '../../../components/GameHeader';
import SoloGameHeader from '../../../components/SoloGameHeader';
import SoloPlayingPhase from '../../../components/SoloPlayingPhase';
import SoloResultsPhase from '../../../components/SoloResultsPhase';
import SoloWaitingPhase from '../../../components/SoloWaitingPhase';
import { useGame } from '../../../contexts/GameContext';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function calculateSoloScore(foundAnswers: string[], answers: any[]): number {
    let score = 0;
    foundAnswers.forEach((foundAnswer, index) => {
        if (foundAnswer !== '' && answers[index]) {
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
    const scrollViewRef = useRef<ScrollView>(null);

    const startRound = () => {
        dispatch({ type: 'START_ROUND' });
        dispatch({ type: 'START_TIMER' });
    };

    const submitAnswer = (answer: string) => {
        dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const submitAllAnswers = React.useCallback(() => {
        if (state.currentQuestion) {
            const points = calculateSoloScore(state.foundAnswers, state.currentQuestion.answers);
            dispatch({ type: 'UPDATE_SCORE', payload: { teamId: currentTeam.id, points } });
        }
        dispatch({ type: 'SUBMIT_ANSWERS' });
    }, [state.currentQuestion, state.foundAnswers, currentTeam.id, dispatch]);

    const nextRound = () => {
        if (state.currentRound >= state.totalRounds) {
            // Si c'est le dernier round, finir la partie
            dispatch({ type: 'NEXT_SOLO_ROUND' });
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
            submitAllAnswers();
        }
    }, [state.timeRemaining, state.gamePhase, submitAllAnswers]);

    return (
        <SafeAreaView className="flex-1 bg-purple-200">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header affiché dans toutes les phases sauf playing */}
                {state.gamePhase !== 'playing' && (
                    <View className="px-6">
                        <GameHeader
                            currentRound={state.currentRound}
                            totalRounds={state.totalRounds}
                            currentTeamName={currentTeam?.name || ''}
                            teams={state.teams}
                            timeRemaining={state.timeRemaining}
                            formatTime={formatTime}
                        />
                    </View>
                )}

                {/* Header spécial pour la phase de jeu avec question et timer fixe */}
                {state.gamePhase === 'playing' && (
                    <View className="px-6">
                        <SoloGameHeader
                            currentRound={state.currentRound}
                            totalRounds={state.totalRounds}
                            currentTeamName={currentTeam?.name || ''}
                            teams={state.teams}
                            timeRemaining={state.timeRemaining}
                            formatTime={formatTime}
                            currentQuestion={state.currentQuestion || undefined}
                            foundAnswers={state.foundAnswers}
                        />
                    </View>
                )}

                <View className="flex-1 px-6">
                    {/* Composant dynamique selon la phase */}
                    {state.gamePhase === 'waiting' && (
                        <SoloWaitingPhase
                            currentRound={state.currentRound}
                            totalRounds={state.totalRounds}
                            onStartRound={startRound}
                        />
                    )}

                    {state.gamePhase === 'playing' && state.currentQuestion && (
                        <SoloPlayingPhase
                            currentQuestion={state.currentQuestion}
                            foundAnswers={state.foundAnswers}
                            isTimerActive={state.isTimerActive}
                            onSubmitAnswer={submitAnswer}
                            onSubmitAllAnswers={submitAllAnswers}
                            onInputFocus={scrollToBottom}
                        />
                    )}

                    {state.gamePhase === 'results' && state.currentQuestion && (
                        <SoloResultsPhase
                            currentQuestion={state.currentQuestion}
                            foundAnswers={state.foundAnswers}
                            calculateSoloScore={calculateSoloScore}
                            onNextRound={nextRound}
                            isLastRound={state.currentRound >= state.totalRounds}
                        />
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
                                <Text className="text-center text-lg text-gray-700">
                                    Merci d&apos;avoir joué en mode solo !
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
