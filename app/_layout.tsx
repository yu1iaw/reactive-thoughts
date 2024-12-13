import { ThoughtsHeader } from '@/components/thoughts-header';
import { initializeDb } from '@/lib/db';
import { createUser } from '@/lib/prisma';
import { tw } from '@/lib/tailwind';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as LocalAuthentication from 'expo-local-authentication';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import 'react-native-reanimated';
import { useDeviceContext } from 'twrnc';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(home)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const requestAuth = async () => {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        try {
          await initializeDb();
          await createUser();
          router.replace('/thoughts');

        } catch (error) {
          Alert.alert('Error', 'Failed to initialize db')
        }
      }
    }

    requestAuth();
  }, [])



  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  useDeviceContext(tw);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#f8fafc', marginTop: -16, paddingTop: 16 }
      }}>
      <Stack.Screen
        name="index"
        options={{
          header: () => <ThoughtsHeader title="Welcome 👋🏻" bgDefault />
        }} />
      <Stack.Screen name="thoughts" options={{ headerShown: false }} />
    </Stack>
  );
}
