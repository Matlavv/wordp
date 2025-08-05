import { Stack } from 'expo-router';
import { GameProvider } from '../contexts/GameContext';
import '../global.css';

export default function RootLayout() {
    return (
        <GameProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </GameProvider>
    );
}
