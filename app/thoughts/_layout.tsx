import { ThoughtsHeader } from "@/components/thoughts-header";
import { RefetchThoughtsContextProvider } from "@/contexts/refetch-thoughts-provider";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function StackLayout() {
    return (
        <RefetchThoughtsContextProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: '#f8fafc' }
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        header: () => <ThoughtsHeader title="Thoughts" bgDefault />,
                    }}
                />
                <Stack.Screen
                    name="create"
                    options={{
                        header: () => <ThoughtsHeader title="Thought" bgDefault />
                    }}
                />
                <Stack.Screen
                    name="[thoughtId]"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>
        </RefetchThoughtsContextProvider>
    )
}