import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Question } from '../types/game';

interface ResultsPhaseProps {
    currentQuestion: Question;
    selectedAnswers: boolean[];
    calculateScore: (selectedAnswers: boolean[], answers: any[], difficulty: number) => number;
    onSelectAnswer: (index: number) => void;
    onNextTeam: () => void;
}

export default function ResultsPhase({
    currentQuestion,
    selectedAnswers,
    calculateScore,
    onSelectAnswer,
    onNextTeam,
}: ResultsPhaseProps) {
    return (
        <View>
            <Text className="text-center text-2xl font-bold mb-6 text-gray-800">Résultats</Text>

            {/* Score de ce round */}
            <View className="bg-white/30 rounded-2xl p-6 mb-6">
                <Text className="text-center text-lg text-gray-800">Points gagnés ce round:</Text>
                <Text className="text-center text-3xl font-bold text-green-600">
                    {calculateScore(
                        selectedAnswers,
                        currentQuestion.answers,
                        currentQuestion.difficulty,
                    )}
                </Text>
            </View>

            {/* Corrections */}
            <View className="mb-6">
                <Text className="text-lg font-bold mb-4 text-gray-800">Réponses :</Text>
                {currentQuestion.answers.map((answer, index) => {
                    const isSelected = selectedAnswers[index];
                    const isCorrect = answer.isCorrect;
                    const isTrap = answer.isTrap;

                    let bgColor = 'bg-white/30';
                    let textColor = 'text-gray-800';
                    let icon = '';

                    if (isSelected) {
                        if (isTrap) {
                            bgColor = 'bg-red-500';
                            textColor = 'text-white';
                            icon = '❌ ';
                        } else if (isCorrect) {
                            bgColor = 'bg-green-500';
                            textColor = 'text-white';
                            icon = '✅ ';
                        } else {
                            bgColor = 'bg-gray-500';
                            textColor = 'text-white';
                            icon = '⭕ ';
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onSelectAnswer(index)}
                            className={`p-3 mb-2 rounded-lg ${bgColor} border-2 ${
                                isSelected ? 'border-blue-400' : 'border-transparent'
                            }`}
                        >
                            <View className="flex-row justify-between items-center">
                                <Text className={`${textColor} font-medium flex-1`}>
                                    {icon}
                                    {answer.text}
                                </Text>
                                <View className="ml-3">
                                    <Text className={`${textColor} text-sm font-bold`}>
                                        {answer.isTrap ? '-5' : `+${answer.points}`} pts
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity onPress={onNextTeam} className="bg-blue-600 p-4 rounded-2xl mb-4">
                <Text className="text-white text-center text-lg font-bold">Équipe suivante</Text>
            </TouchableOpacity>
        </View>
    );
}
