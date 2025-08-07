import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../../../contexts/GameContext';

export default function SoloGameSettings() {
    const { dispatch } = useGame();
    const [numberOfRounds, setNumberOfRounds] = useState(3);

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

    const navigateToGameScreen = () => {
        // Utiliser l'action spécifique pour démarrer le jeu solo
        dispatch({ type: 'START_SOLO_GAME', payload: numberOfRounds });
        router.push('/screens/solo/SoloGameScreen');
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-blue">
            <ScrollView className="flex-1">
                <View className="px-6">
                    <Text className="text-white font-bold text-4xl text-center mt-14 mb-12">
                        Paramètres de la partie
                    </Text>
                </View>
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

                {/* Section Règles du jeu */}
                <View className="mx-6 mb-4">
                    <View className="bg-gray-800/30 rounded-2xl p-6">
                        <Text className="text-white font-bold text-xl text-center mb-4">
                            📖 Règles du mode solo
                        </Text>
                        <Text className="text-white text-base leading-7">
                            🎯 Trouvez les <Text className="font-bold">9 réponses</Text> en 2
                            minutes
                            {'\n'}
                            {'\n'}
                            ⚠️ Attention parfois il y a une réponse piège !{'\n'}
                            {'\n'}
                            🏆 Votre objectif : obtenir le meilleur score possible{'\n'}
                            {'\n'}
                            ⏱️ Vous avez 2 minutes par question pour trouver les réponses{'\n'}
                            {'\n'}
                            ⌨️ Tapez les réponses au clavier - elles apparaîtront si elles sont
                            correctes{'\n'}
                            {'\n'}✅ Les bonnes réponses rapportent des points{'\n'}
                            {'\n'}❌ Les réponses pièges font perdre des points{'\n'}
                        </Text>
                    </View>
                </View>

                <View className="mx-6 mb-8">
                    <TouchableOpacity
                        className="bg-blue-500 active:bg-blue-600 p-4 rounded-2xl shadow-lg"
                        onPress={navigateToGameScreen}
                    >
                        <Text className="text-white text-2xl text-center font-bold">
                            Commencer la partie
                        </Text>
                        <Text className="text-blue-100 text-center mt-1">
                            {numberOfRounds} rounds
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
