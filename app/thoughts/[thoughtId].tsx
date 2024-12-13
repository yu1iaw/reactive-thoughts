import { ThoughtScrim } from "@/components/thought-scrim";
import { prisma } from "@/lib/db";
import tw from '@/lib/tailwind';
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolation, FadeIn, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";



export default function SingleThought() {
    const { thoughtId } = useLocalSearchParams();
    const thought = prisma.thought.useFindUnique({
        where: {
            id: +thoughtId,
            creatorId: 1,
        }
    })

    const scrollY = useSharedValue(0);

    const handleScroll = useAnimatedScrollHandler((event) => {
        'worklet';
        scrollY.value = event.contentOffset.y;
    })

    const scrollAnimatedStyles = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [50, 150],
            [0, -60],
            Extrapolation.CLAMP
        )
        return {
            transform: [{ translateY }]
        }
    })


    return (
        <>
            <Animated.View style={[tw(`absolute top-0 left-0 right-0 h-[167px] items-start justify-end bg-slate-300 border-b border-white z-50`), scrollAnimatedStyles]}>
                <View style={tw(`mb-6 mx-4 flex-row items-center gap-x-5`)}>
                    <TouchableOpacity
                        onPress={router.back}
                        style={tw(`bg-slate-200 p-2 rounded-full shadow`)}>
                        <Ionicons name="arrow-back" size={25} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={tw(`body-text`)}>Previous screen</Text>
                </View>
            </Animated.View>

            <View style={tw(`flex-1`)}>
                {!thought ? (
                    <Animated.View style={tw(`flex-1 flex-center`)} entering={FadeIn.delay(500)}>
                        <Text style={tw(`font-spaceMono text-lg text-gray-600`)}>Nothing found</Text>
                    </Animated.View>
                ) : (
                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        contentContainerStyle={tw(`pt-[167px]`)}
                    >
                        <ThoughtScrim
                            item={thought}
                            index={0}
                            isLastItem={true}
                            additionalThoughtsLoading={false}
                        />
                    </Animated.ScrollView>
                )}
            </View>
        </>
    )
}

