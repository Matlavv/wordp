import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Team } from '../types/game';

interface FinishedPhaseProps {
    teams: Team[];
    onResetGame: () => void;
}

export default function FinishedPhase({ teams, onResetGame }: FinishedPhaseProps) {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    const animatedValues = useRef(sortedTeams.map(() => new Animated.Value(-300))).current;

    useEffect(() => {
        // Réinitialiser les valeurs d'animation à chaque changement d'équipes
        animatedValues.forEach((value) => value.setValue(-300));

        // Animation séquentielle pour chaque équipe
        const animations = sortedTeams.map((_, index) =>
            Animated.timing(animatedValues[index], {
                toValue: 0,
                duration: 1000,
                delay: index * 400, // Délai de 200ms entre chaque équipe
                useNativeDriver: true,
            }),
        );

        // Démarre toutes les animations
        Animated.stagger(400, animations).start();
    }, [teams, animatedValues, sortedTeams]);

    const TeamItem = ({
        team,
        index,
        animatedValue,
    }: {
        team: Team;
        index: number;
        animatedValue: Animated.Value;
    }) => (
        <Animated.View
            style={{
                transform: [{ translateX: animatedValue }],
            }}
            className="flex-row justify-between items-center p-4 mb-2 bg-white/30 rounded-lg"
        >
            <View className="flex-row items-center">
                <Text className="text-lg font-bold mr-3 text-gray-800">{index + 1}.</Text>
                <Text className="text-lg font-medium text-gray-800">{team.name}</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">{team.score} pts</Text>
        </Animated.View>
    );
    return (
        <View className="items-center">
            <Text className="text-center text-3xl font-bold mb-8 text-gray-800">
                Fin de la partie !
            </Text>

            {/* Classement final */}
            <View className="w-full mb-8">
                <Text className="text-xl font-bold mb-4 text-gray-800">Classement final:</Text>
                {sortedTeams.map((team, index) => (
                    <TeamItem
                        key={team.id}
                        team={team}
                        index={index}
                        animatedValue={animatedValues[index]}
                    />
                ))}
            </View>

            <View className="mt-6">
                <TouchableOpacity
                    onPress={onResetGame}
                    className="bg-green-600 px-8 py-4 rounded-2xl"
                >
                    <Text className="text-white text-xl font-bold text-center">Rejouer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
