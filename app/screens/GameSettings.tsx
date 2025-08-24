import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGame } from '../../contexts/GameContext';

const AVAILABLE_COLORS = [
    { name: 'Rose', value: 'bg-pink-200', textColor: 'text-pink-100' },
    { name: 'Bleu', value: 'bg-blue-200', textColor: 'text-blue-900' },
    { name: 'Vert', value: 'bg-green-200', textColor: 'text-green-900' },
    { name: 'Violet', value: 'bg-purple-200', textColor: 'text-purple-900' },
    { name: 'Jaune', value: 'bg-yellow-200', textColor: 'text-yellow-900' },
];

export default function GameSettings() {
    const { dispatch } = useGame();
    const [numberOfTeams, setNumberOfTeams] = useState(2);
    const [numberOfRounds, setNumberOfRounds] = useState(3);
    const [teams, setTeams] = useState([
        {
            id: '1',
            name: 'Équipe 1',
            color: AVAILABLE_COLORS[0].value,
            textColor: AVAILABLE_COLORS[0].textColor,
        },
        {
            id: '2',
            name: 'Équipe 2',
            color: AVAILABLE_COLORS[1].value,
            textColor: AVAILABLE_COLORS[1].textColor,
        },
    ]);

    const incrementTeams = () => {
        if (numberOfTeams < 5) {
            const newTeamNumber = numberOfTeams + 1;
            setNumberOfTeams(newTeamNumber);
            const newTeam = {
                id: newTeamNumber.toString(),
                name: `Équipe ${newTeamNumber}`,
                color: AVAILABLE_COLORS[newTeamNumber - 1].value,
                textColor: AVAILABLE_COLORS[newTeamNumber - 1].textColor,
            };
            setTeams([...teams, newTeam]);
        }
    };

    const decrementTeams = () => {
        if (numberOfTeams > 2) {
            setNumberOfTeams(numberOfTeams - 1);
            setTeams(teams.slice(0, -1));
        }
    };

    const incrementRounds = () => {
        if (numberOfRounds < 10) {
            setNumberOfRounds(numberOfRounds + 1);
        }
    };

    const decrementRounds = () => {
        if (numberOfRounds > 1) {
            setNumberOfRounds(numberOfRounds - 1);
        }
    };

    const updateTeamName = (teamId: string, newName: string) => {
        setTeams(teams.map((team) => (team.id === teamId ? { ...team, name: newName } : team)));
    };

    const updateTeamColor = (teamId: string, colorIndex: number) => {
        // Vérifier si la couleur est déjà utilisée par une autre équipe
        const selectedColor = AVAILABLE_COLORS[colorIndex].value;
        const isColorUsed = teams.some(
            (team) => team.id !== teamId && team.color === selectedColor,
        );

        if (isColorUsed) {
            return; // Ne pas permettre la sélection d'une couleur déjà utilisée
        }

        setTeams(
            teams.map((team) =>
                team.id === teamId
                    ? {
                          ...team,
                          color: AVAILABLE_COLORS[colorIndex].value,
                          textColor: AVAILABLE_COLORS[colorIndex].textColor,
                      }
                    : team,
            ),
        );
    };

    const navigateToGameScreen = () => {
        const gameTeams = teams.map((team) => ({
            id: team.id,
            name: team.name,
            color: team.color,
            score: 0,
        }));

        dispatch({ type: 'SET_TEAMS', payload: gameTeams });
        dispatch({ type: 'SET_ROUNDS', payload: numberOfRounds });
        dispatch({ type: 'START_GAME' });
        router.push('/screens/GameScreen');
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-blue">
            <ScrollView className="flex-1">
                <View className="px-6">
                    <Text className="text-white font-bold text-4xl text-center mt-16 mb-12">
                        Paramètres de la partie
                    </Text>
                </View>

                {/* Section Nombre d'équipes */}
                <View className="mx-6 mb-8">
                    <Text className="text-white text-xl font-semibold text-center mb-4">
                        Nombre d&apos;équipes
                    </Text>

                    <View className="bg-gray-800/30 rounded-2xl p-6">
                        <View className="flex-row justify-center items-center mb-4">
                            <TouchableOpacity
                                onPress={decrementTeams}
                                disabled={numberOfTeams <= 2}
                                className={`w-12 h-12 rounded-full justify-center items-center ${
                                    numberOfTeams <= 2
                                        ? 'bg-gray-600'
                                        : 'bg-red-500 active:bg-red-600'
                                }`}
                            >
                                <Text
                                    className={`font-bold text-2xl ${
                                        numberOfTeams <= 2 ? 'text-gray-400' : 'text-white'
                                    }`}
                                >
                                    −
                                </Text>
                            </TouchableOpacity>

                            <View className="mx-8 bg-blue-500 rounded-xl px-6 py-3 min-w-[60px]">
                                <Text className="text-white font-bold text-3xl text-center">
                                    {numberOfTeams}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={incrementTeams}
                                disabled={numberOfTeams >= 5}
                                className={`w-12 h-12 rounded-full justify-center items-center ${
                                    numberOfTeams >= 5
                                        ? 'bg-gray-600'
                                        : 'bg-green-500 active:bg-green-600'
                                }`}
                            >
                                <Text
                                    className={`font-bold text-2xl ${
                                        numberOfTeams >= 5 ? 'text-gray-400' : 'text-white'
                                    }`}
                                >
                                    +
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Configuration des équipes */}
                        {teams.map((team, index) => (
                            <View key={team.id} className="mb-4">
                                <TextInput
                                    value={team.name}
                                    onChangeText={(text) => updateTeamName(team.id, text)}
                                    className="bg-white rounded-lg p-3 mb-2 text-gray-800 font-medium"
                                    placeholder={`Nom de l'équipe ${index + 1}`}
                                />

                                <View className="flex-row justify-center">
                                    {AVAILABLE_COLORS.map((color, colorIndex) => {
                                        const isSelected = team.color === color.value;
                                        const isUsedByOtherTeam = teams.some(
                                            (t) => t.id !== team.id && t.color === color.value,
                                        );

                                        return (
                                            <TouchableOpacity
                                                key={colorIndex}
                                                onPress={() => updateTeamColor(team.id, colorIndex)}
                                                disabled={isUsedByOtherTeam}
                                                className={`w-10 h-10 rounded-full mx-1 ${color.value} ${
                                                    isSelected ? 'border-4 border-blue-400' : ''
                                                } ${
                                                    isUsedByOtherTeam ? 'opacity-30' : 'opacity-100'
                                                }`}
                                                style={{
                                                    shadowColor: isSelected
                                                        ? '#3B82F6'
                                                        : 'transparent',
                                                    shadowOffset: { width: 0, height: 0 },
                                                    shadowOpacity: isSelected ? 0.8 : 0,
                                                    shadowRadius: isSelected ? 4 : 0,
                                                    elevation: isSelected ? 8 : 0,
                                                }}
                                            />
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Section Nombre de rounds */}
                <View className="mx-6 mb-8">
                    <Text className="text-white text-xl font-semibold text-center mb-4">
                        Nombre de rounds
                    </Text>

                    <View className="bg-gray-800/30 rounded-2xl p-6">
                        <View className="flex-row justify-center items-center">
                            <TouchableOpacity
                                onPress={decrementRounds}
                                disabled={numberOfRounds <= 1}
                                className={`w-12 h-12 rounded-full justify-center items-center ${
                                    numberOfRounds <= 1
                                        ? 'bg-gray-600'
                                        : 'bg-red-500 active:bg-red-600'
                                }`}
                            >
                                <Text
                                    className={`font-bold text-2xl ${
                                        numberOfRounds <= 1 ? 'text-gray-400' : 'text-white'
                                    }`}
                                >
                                    −
                                </Text>
                            </TouchableOpacity>

                            <View className="mx-8 bg-purple-500 rounded-xl px-6 py-3 min-w-[60px]">
                                <Text className="text-white font-bold text-3xl text-center">
                                    {numberOfRounds}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={incrementRounds}
                                disabled={numberOfRounds >= 10}
                                className={`w-12 h-12 rounded-full justify-center items-center ${
                                    numberOfRounds >= 10
                                        ? 'bg-gray-600'
                                        : 'bg-green-500 active:bg-green-600'
                                }`}
                            >
                                <Text
                                    className={`font-bold text-2xl ${
                                        numberOfRounds >= 10 ? 'text-gray-400' : 'text-white'
                                    }`}
                                >
                                    +
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-300 text-sm text-center mt-3">
                            Minimum: 1 round • Maximum: 10 rounds
                        </Text>
                    </View>
                </View>

                <View className="mx-6 mt-8 mb-8">
                    <TouchableOpacity
                        className="bg-blue-500 active:bg-blue-600 p-6 rounded-2xl shadow-lg"
                        onPress={navigateToGameScreen}
                    >
                        <Text className="text-white text-2xl text-center font-bold">
                            Commencer la partie
                        </Text>
                        <Text className="text-blue-100 text-center mt-1">
                            {numberOfTeams} équipes • {numberOfRounds} rounds
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
