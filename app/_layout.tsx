import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#1C1C1E',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Vamoaê' }} />
        <Stack.Screen name="detalhe" options={{ title: 'Detalhes da Viagem' }} />
        <Stack.Screen name="adicionar" options={{ title: 'Nova Viagem', presentation: 'modal' }} />
      </Stack>
    </>
  );
}