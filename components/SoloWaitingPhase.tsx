import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SoloWaitingPhaseProps {
    currentRound: number;
    totalRounds: number;
    onStartRound: () => void;
}

export default function SoloWaitingPhase({
    currentRound,
    totalRounds,
    onStartRound,
}: SoloWaitingPhaseProps) {
    return (
        <View className="items-center">
            <View className="bg-white/30 rounded-2xl p-6 mb-6">
                <Text className="text-center text-2xl font-bold mb-4 text-gray-800">
                    🎮 Mode Solo
                </Text>
                <Text className="text-center text-lg text-gray-800 mb-2">
                    Round {currentRound} sur {totalRounds}
                </Text>
                <Text className="text-center text-base text-gray-600">
                    Tapez les réponses au clavier pour les découvrir !
                </Text>
            </View>

            <View className="bg-blue-100/50 rounded-2xl p-4 mb-6">
                <Text className="text-center text-sm text-gray-700 mb-2">
                    💡 <Text className="font-bold">Conseil :</Text>
                </Text>
                <Text className="text-center text-sm text-gray-600">
                    Vous avez 2 minutes pour trouver un maximum de réponses. Attention aux pièges
                    qui font perdre des points !
                </Text>
            </View>

            <TouchableOpacity onPress={onStartRound} className="bg-green-600 px-8 py-4 rounded-2xl">
                <Text className="text-white text-xl font-bold">Commencer le round</Text>
            </TouchableOpacity>
        </View>
    );
}
