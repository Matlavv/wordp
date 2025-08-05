import { router } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const navigateToGameSettings = () => {
    router.push('/screens/GameSettings');
    console.log('Navigating to GameSettings');
};

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-dark-blue">
            <View>
                <Text className="text-white font-bold text-5xl text-center mt-14">Wordp</Text>
            </View>
            <View className="w-2/3 text-center mx-auto justify-center items-center mt-10">
                <TouchableOpacity
                    className="bg-blue-400 p-6 rounded-xl m-4"
                    onPress={navigateToGameSettings}
                >
                    <Text className="text-white text-3xl text-center font-bold">Jouer</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
