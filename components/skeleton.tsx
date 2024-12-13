import tw from '@/lib/tailwind';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';


const duration = 600;
const easing = Easing.linear;

type SkeletonProps = {
    triple?: boolean;
    additionalStyles?: string;
}

export const Skeleton = ({ triple, additionalStyles }: SkeletonProps) => {
    const opacity1 = useSharedValue(0.5);
    const opacity2 = useSharedValue(1);


    useEffect(() => {
        // highlight-next-line
        opacity1.value = withRepeat(withTiming(1, { duration, easing }), -1, true);
        opacity2.value = withRepeat(withTiming(0.5, { duration, easing }), -1, true);
    }, []);


    const animatedStyle1 = useAnimatedStyle(() => ({
        opacity: opacity1.value
    }));
    const animatedStyle2 = useAnimatedStyle(() => ({
        opacity: opacity2.value
    }));

    return (
        <View style={tw(`flex-1 gap-6 px-3`, additionalStyles)}>
            <SkeletonItem order={1} animatedStyle={animatedStyle1} />
            <SkeletonItem order={2} animatedStyle={animatedStyle2} />
            {triple && <SkeletonItem order={1} animatedStyle={animatedStyle1} />}
        </View>
    );
}

type SkeletonItemProps = {
    order: number;
    animatedStyle: {
        opacity: number;
    }
}
export const SkeletonItem = ({ order, animatedStyle }: SkeletonItemProps) => {
    return (
        <Animated.View
            style={[
                {
                    ...styles.box,
                    height: order === 1 ? 150 : 120,
                    borderRadius: order === 1 ? 33 : 30,
                },
                animatedStyle
            ]}
        />
    )
}

const styles = StyleSheet.create({
    box: {
        width: '100%',
        backgroundColor: '#cbd5e1',
    },
});
