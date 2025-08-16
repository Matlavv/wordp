import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Team } from '../types/game';

interface GameHeaderProps {
    currentRound: number;
    totalRounds: number;
    currentTeamName: string;
    teams: Team[];
    timeRemaining: number;
    formatTime: (seconds: number) => string;
}

export default function GameHeader({
    currentRound,
    totalRounds,
    currentTeamName,
    teams,
    timeRemaining,
    formatTime,
}: GameHeaderProps) {
    return (
        <>
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

            {/* Nom de l'équipe */}
            <Text className="text-center text-3xl font-bold mb-4 text-gray-800">
                {currentTeamName}
            </Text>

            {/* Score global des équipes */}
            <View className="flex-row justify-center mb-6">
                {teams.map((team) => (
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
                    timeRemaining <= 10
                        ? 'text-red-600'
                        : timeRemaining <= 30
                          ? 'text-orange-600'
                          : 'text-green-600'
                }`}
            >
                {formatTime(timeRemaining)}
            </Text>
        </>
    );
}
