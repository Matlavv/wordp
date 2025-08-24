import { router } from 'expo-router';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const navigateToGameSettings = () => {
    router.push('/screens/GameSettings');
};

const navigateToSoloGameSettings = () => {
    router.push('/screens/solo/SoloGameSettings');
};

const openLinkedInProfile = () => {
    Linking.openURL('https://www.linkedin.com/in/mathis-laversin/');
};

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-dark-blue">
            <ScrollView>
                <View>
                    <Text className="text-white font-bold text-5xl text-center mt-14">Wordp</Text>
                </View>
                <View className="w-2/3 text-center mx-auto justify-center items-center mt-10">
                    <TouchableOpacity
                        className="bg-blue-400 p-6 rounded-xl m-4"
                        onPress={navigateToSoloGameSettings}
                    >
                        <Text className="text-white text-3xl text-center font-bold">
                            Jouer seul
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-blue-400 p-6 rounded-xl m-4"
                        onPress={navigateToGameSettings}
                    >
                        <Text className="text-white text-3xl text-center font-bold">
                            Jouer à plusieurs
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-1 justify-between">
                    <View className="mx-8 mt-8 p-4 bg-blue-600/30 rounded-lg">
                        <Text className="text-white font-bold text-xl text-center mb-4">
                            📖 Règles du jeu
                        </Text>
                        <Text className="text-white text-base leading-7">
                            📱 Le jeu se joue sur un seul appareil qui passe entre chaque équipe
                            {'\n'}
                            {'\n'}
                            🎯 Trouvez les <Text className="font-bold">9 réponses</Text> en 60
                            secondes
                            {'\n'}
                            {'\n'}
                            ⚠️ Attention parfois il y a une réponse piège !{'\n'}
                            {'\n'}
                            🏆 L&apos;équipe ayant trouvé le plus de mots gagne la partie{'\n'}
                            {'\n'}
                            👥 Quand c&apos;est le tour d&apos;une équipe, l&apos;équipe adverse lit
                            la question{'\n'}
                            {'\n'}
                            🎶 L&apos;équipe active doit donner ses réponses à voix haute.
                            Lorsqu&apos;une bonne réponse est donnée, l&apos;équipe adverse doit
                            cocher la réponse dans la liste.
                            {'\n'}
                        </Text>
                    </View>
                    <View className="items-center pb-4 mt-12">
                        <TouchableOpacity onPress={openLinkedInProfile}>
                            <Text className="text-sm text-gray-400">
                                Made with love by{' '}
                                <Text className="text-blue-400 underline">Matlav</Text> 🏴‍☠️
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
