import React, { useState } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../types/game';

interface SoloPlayingPhaseProps {
    currentQuestion: Question;
    foundAnswers: string[];
    isTimerActive: boolean;
    onSubmitAnswer: (answer: string) => void;
    onSubmitAllAnswers: () => void;
    onInputFocus?: () => void;
}

export default function SoloPlayingPhase({
    currentQuestion,
    foundAnswers,
    isTimerActive,
    onSubmitAnswer,
    onSubmitAllAnswers,
    onInputFocus,
}: SoloPlayingPhaseProps) {
    const [currentInput, setCurrentInput] = useState('');
    const [shakeAnimation] = useState(new Animated.Value(0));

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleSubmitAnswer = () => {
        if (currentInput.trim()) {
            const inputValue = currentInput.trim().toLowerCase();
            const isCorrectAnswer = currentQuestion.answers.some(
                (answer, index) => !foundAnswers[index] && answer.text.toLowerCase() === inputValue,
            );

            onSubmitAnswer(currentInput.trim());

            // Déclencher l'animation seulement si la réponse est incorrecte
            if (!isCorrectAnswer) {
                triggerShake();
            }

            setCurrentInput('');
        }
    };

    const foundCount = foundAnswers.filter((answer) => answer !== '').length;

    return (
        <View className="flex-1">
            {/* Zone de saisie */}
            {isTimerActive && (
                <Animated.View
                    style={{
                        transform: [{ translateX: shakeAnimation }],
                    }}
                    className="mb-6"
                >
                    <Text className="text-lg font-bold mb-3 text-gray-800">
                        Tapez votre réponse :
                    </Text>
                    <View className="flex-row space-x-3">
                        <TextInput
                            value={currentInput}
                            onChangeText={setCurrentInput}
                            onFocus={onInputFocus}
                            placeholder="Votre réponse..."
                            className="flex-1 bg-white/80 p-4 rounded-xl border border-gray-300 text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            onSubmitEditing={handleSubmitAnswer}
                            autoCapitalize="words"
                            autoCorrect={false}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            onPress={handleSubmitAnswer}
                            disabled={!currentInput.trim()}
                            className={`px-6 py-4 rounded-xl ${
                                currentInput.trim() ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                        >
                            <Text className="text-white font-bold">✓</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
            {/* Liste des réponses avec tirets */}
            <View className="mb-6">
                <Text className="text-lg font-bold mb-4 text-gray-800">Réponses :</Text>
                {currentQuestion.answers.map((answer, index) => (
                    <View
                        key={index}
                        className={`p-4 mb-3 rounded-xl border-2 ${
                            foundAnswers[index]
                                ? answer.isTrap
                                    ? 'bg-red-200 border-red-400'
                                    : 'bg-green-200 border-green-400'
                                : 'bg-white/50 border-gray-400'
                        }`}
                    >
                        <View className="flex-row justify-between items-center">
                            <Text
                                className={`flex-1 font-medium ${
                                    foundAnswers[index]
                                        ? answer.isTrap
                                            ? 'text-red-800'
                                            : 'text-green-800'
                                        : 'text-gray-800'
                                }`}
                            >
                                {foundAnswers[index] || '_ _ _ _ _ _ _ _ _'}
                            </Text>
                            <View className="ml-3">
                                <Text
                                    className={`text-base font-bold ${
                                        foundAnswers[index]
                                            ? answer.isTrap
                                                ? 'text-red-800'
                                                : 'text-green-800'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {answer.isTrap ? '-5' : `+${answer.points}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Bouton terminer */}
            {foundCount > 0 && isTimerActive && (
                <TouchableOpacity
                    onPress={onSubmitAllAnswers}
                    className="bg-orange-600 p-4 rounded-2xl mb-12"
                >
                    <Text className="text-white text-center text-lg font-bold">
                        Terminer le round ({foundCount} réponses)
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
