import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Question, Team } from '../types/game';

interface SoloGameHeaderProps {
    currentRound: number;
    totalRounds: number;
    currentTeamName: string;
    teams: Team[];
    timeRemaining: number;
    formatTime: (seconds: number) => string;
    currentQuestion?: Question;
    foundAnswers?: string[];
}

export default function SoloGameHeader({
    currentRound,
    totalRounds,
    currentTeamName,
    teams,
    timeRemaining,
    formatTime,
    currentQuestion,
    foundAnswers,
}: SoloGameHeaderProps) {
    const foundCount = foundAnswers ? foundAnswers.filter((answer) => answer !== '').length : 0;

    return (
        <View className="mb-6 mt-4">
            {/* Round avec bouton home aligné */}
            <View className="flex-row justify-between items-center mt-10 mb-4">
                <View className="flex-1" />
                <Text className="text-center text-2xl font-bold text-gray-800">
                    Round {currentRound}/{totalRounds}
                </Text>
                <View className="flex-1 items-end">
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                        className="bg-white/20 p-3 rounded-full"
                    >
                        <Text className="text-xl">🏠</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Score global */}
            <View className="flex-row justify-center mb-6">
                {teams.map((team) => (
                    <View key={team.id} className="mx-2 p-2 bg-white/20 rounded-lg">
                        <Text className="text-center text-sm font-medium text-gray-800">
                            Score total
                        </Text>
                        <Text className="text-center text-lg font-bold text-gray-800">
                            {team.score} pts
                        </Text>
                    </View>
                ))}
            </View>

            {/* Timer */}
            <Text
                className={`text-center text-3xl font-bold mb-4 ${
                    timeRemaining <= 30
                        ? 'text-red-600'
                        : timeRemaining <= 60
                          ? 'text-orange-600'
                          : 'text-green-600'
                }`}
            >
                {formatTime(timeRemaining)}
            </Text>

            {/* Question et compteur (uniquement en phase de jeu) */}
            {currentQuestion && foundAnswers && (
                <>
                    <View className="bg-white/30 rounded-2xl p-6 mb-4">
                        <Text className="text-center text-xl font-bold mb-2 text-gray-800">
                            {currentQuestion.theme}
                        </Text>
                        <Text className="text-center text-sm text-gray-600">
                            {foundCount}/9 réponses trouvées
                        </Text>
                    </View>
                </>
            )}

            {/* Barre pointillée */}
            <View className="border-b-2 border-dashed border-gray-600" />
        </View>
    );
}
