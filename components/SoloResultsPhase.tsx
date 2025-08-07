import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Question } from '../types/game';

interface SoloResultsPhaseProps {
    currentQuestion: Question;
    foundAnswers: string[];
    calculateSoloScore: (foundAnswers: string[], answers: any[]) => number;
    onNextRound: () => void;
    isLastRound: boolean;
}

export default function SoloResultsPhase({
    currentQuestion,
    foundAnswers,
    calculateSoloScore,
    onNextRound,
    isLastRound,
}: SoloResultsPhaseProps) {
    const roundScore = calculateSoloScore(foundAnswers, currentQuestion.answers);
    const foundCount = foundAnswers.filter((answer) => answer !== '').length;

    return (
        <View>
            <Text className="text-center text-2xl font-bold mb-6 text-gray-800">Résultats</Text>

            {/* Score de ce round */}
            <View className="bg-white/30 rounded-2xl p-6 mb-6">
                <Text className="text-center text-lg text-gray-800">Points gagnés ce round:</Text>
                <Text className="text-center text-3xl font-bold text-blue-600">{roundScore}</Text>
                <Text className="text-center text-sm text-gray-600 mt-2">
                    {foundCount}/9 réponses trouvées
                </Text>
            </View>

            {/* Corrections détaillées */}
            <View className="mb-6">
                <Text className="text-lg font-bold mb-4 text-gray-800">Réponses complètes :</Text>
                {currentQuestion.answers.map((answer, index) => {
                    const wasFound = foundAnswers[index] !== '';
                    const isCorrect = answer.isCorrect;
                    const isTrap = answer.isTrap;

                    let bgColor = 'bg-white/30';
                    let textColor = 'text-gray-800';
                    let icon = '';
                    let status = '';

                    if (wasFound) {
                        if (isTrap) {
                            bgColor = 'bg-red-500';
                            textColor = 'text-white';
                            icon = '❌ ';
                        } else if (isCorrect) {
                            bgColor = 'bg-green-500';
                            textColor = 'text-white';
                            icon = '✅ ';
                        }
                    } else {
                        if (isTrap) {
                            bgColor = 'bg-orange-200';
                            textColor = 'text-orange-800';
                            icon = '⚠️ ';
                        } else {
                            bgColor = 'bg-gray-200';
                            textColor = 'text-gray-600';
                            icon = '⭕ ';
                        }
                    }

                    return (
                        <View key={index} className={`p-3 mb-2 rounded-lg ${bgColor}`}>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1">
                                    <Text className={`${textColor} font-medium`}>
                                        {icon}
                                        {answer.text}
                                    </Text>
                                </View>
                                <View className="ml-3">
                                    <Text className={`${textColor} text-sm font-bold`}>
                                        {wasFound
                                            ? answer.isTrap
                                                ? '-5'
                                                : `+${answer.points}`
                                            : '0'}{' '}
                                        pts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>

            <TouchableOpacity onPress={onNextRound} className="bg-blue-600 p-4 rounded-2xl mb-4">
                <Text className="text-white text-center text-lg font-bold">
                    {isLastRound ? 'Voir le score final' : 'Round suivant'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
