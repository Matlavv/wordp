import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WaitingPhaseProps {
    currentTeamName: string;
    onStartRound: () => void;
}

export default function WaitingPhase({ currentTeamName, onStartRound }: WaitingPhaseProps) {
    return (
        <View className="items-center">
            <Text className="text-center text-xl font-semibold mb-6 text-gray-800">
                À l&apos;équipe &quot;{currentTeamName}&quot; de jouer !
            </Text>
            <Text className="text-center text-lg mb-8 text-gray-700">
                Passe le téléphone à une autre équipe
            </Text>
            <TouchableOpacity onPress={onStartRound} className="bg-green-600 px-8 py-4 rounded-2xl">
                <Text className="text-white text-xl font-bold">Jouer</Text>
            </TouchableOpacity>
        </View>
    );
}
