import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Question } from '../types/game';

interface PlayingPhaseProps {
    currentQuestion: Question;
    selectedAnswers: boolean[];
    isTimerActive: boolean;
    onSelectAnswer: (index: number) => void;
    onSubmitAnswers: () => void;
}

export default function PlayingPhase({
    currentQuestion,
    selectedAnswers,
    isTimerActive,
    onSelectAnswer,
    onSubmitAnswers,
}: PlayingPhaseProps) {
    return (
        <View>
            {/* Question */}
            <View className="bg-white/30 rounded-2xl p-6 mb-6">
                <Text className="text-center text-xl font-bold mb-2 text-gray-800">
                    {currentQuestion.theme}
                </Text>
            </View>

            {/* Réponses */}
            <View className="mb-6">
                {currentQuestion.answers.map((answer, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelectAnswer(index)}
                        disabled={!isTimerActive}
                        className={`p-4 mb-3 rounded-xl border-2 ${
                            selectedAnswers[index]
                                ? 'bg-blue-600 border-blue-700'
                                : 'bg-white/50 border-gray-400'
                        }`}
                    >
                        <View className="flex-row justify-between items-center">
                            <Text
                                className={`flex-1 font-medium ${
                                    selectedAnswers[index] ? 'text-white' : 'text-gray-800'
                                }`}
                            >
                                {answer.text}
                            </Text>
                            <View className={`ml-3 px-2`}>
                                <Text className="text-gray-500 text-base font-bold">
                                    {answer.isTrap ? '-5' : `+${answer.points}`}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bouton valider */}
            {selectedAnswers.some(Boolean) && isTimerActive && (
                <TouchableOpacity
                    onPress={onSubmitAnswers}
                    className="bg-blue-600 p-4 rounded-2xl mb-6"
                >
                    <Text className="text-white text-center text-lg font-bold">
                        Valider les réponses
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
