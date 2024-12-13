import { EmptyList } from '@/components/empty-list';
import { FixedBtn } from '@/components/fixed-btn';
import { ListFooter } from '@/components/list-footer';
import { SearchPanel } from '@/components/search-panel';
import { Skeleton } from '@/components/skeleton';
import { ThoughtScrim } from '@/components/thought-scrim';
import { useRefetchThoughts } from '@/contexts/refetch-thoughts-provider';
import { getAllThoughts, getFilteredThoughts, getFilteredThoughtsOverallCount, getThoughtsOverallCount } from '@/lib/prisma';
import tw from '@/lib/tailwind';
import { Thought } from '@prisma/client/react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, NativeScrollEvent, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolation, FadeInLeft, FadeInRight, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

const { height } = Dimensions.get("window");
const ITEM_HEIGHT = 220;


export default function Thoughts() {
    const [searchFilter, setSearchFilter] = useState("");
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [thoughts, setThoughts] = useState<Thought[] | null>(null);
    const [skipNumber, setSkipNumber] = useState(0);
    const [overallCount, setOverallCount] = useState(0);
    const [additionalThoughtsLoading, setAdditionalThoughtsLoading] = useState(false);
    const [flatlistScrollStatus, setFlatlistScrollStatus] = useState('start');
    const flatlistRef = useRef<FlatList>(null);
    const { action } = useRefetchThoughts();
    const scrollY = useSharedValue(0);
    const prevScrollY = useSharedValue(0);
    const currentTranslation = useSharedValue(0);


    useEffect(() => {
        const fetchThoughts = async () => {
            try {
                let count: number;
                let dbThoughts: Thought[];

                if (!dateFilter && !searchFilter) {
                    count = await getThoughtsOverallCount();
                    dbThoughts = await getAllThoughts(0);
                } else {
                    count = await getFilteredThoughtsOverallCount(searchFilter, dateFilter);
                    dbThoughts = await getFilteredThoughts(0, searchFilter, dateFilter);
                }
                setThoughts(dbThoughts);
                setSkipNumber(1);
                setOverallCount(count);
            } catch (error) {
                console.log(error);
            }
        }
        fetchThoughts();
    }, [action, searchFilter, dateFilter])


    const handleEndReached = async () => {
        if (overallCount / 5 <= skipNumber) {
            return (thoughts?.length || 0) < 10 ? undefined : setFlatlistScrollStatus('end');
        }
        setAdditionalThoughtsLoading(true);

        try {
            let dbAdditionalThoughts: Thought[];

            if (!searchFilter && !dateFilter) {
                dbAdditionalThoughts = await getAllThoughts(skipNumber);
            } else {
                dbAdditionalThoughts = await getFilteredThoughts(skipNumber, searchFilter, dateFilter);
            }
            setThoughts(prev => [...prev || [], ...dbAdditionalThoughts]);
            setSkipNumber(prev => prev + 1);
        } catch (error) {
            console.log(error);
        } finally {
            setAdditionalThoughtsLoading(false);
        }
    }

    const handleMomentumScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        if ((thoughts?.length || 0) < 10) return;
        const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;

        if ((contentSize.height - layoutMeasurement.height) / 2 > contentOffset.y) {
            setFlatlistScrollStatus('start');
        } else {
            setFlatlistScrollStatus('end')
        }
    }

    const handleScrollPress = () => {
        flatlistScrollStatus === "start" ? flatlistRef.current?.scrollToIndex({ index: (thoughts?.length || 10) - 1 }) : flatlistRef.current?.scrollToIndex({ index: 0 });
    }


    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            'worklet';
            if (event.contentSize.height < 1235) return scrollY.value = 0;
            scrollY.value = event.contentOffset.y;
        }
    })

    const translateY = useDerivedValue(() => {
        const diff = scrollY.value - prevScrollY.value;

        if (scrollY.value < 450 && diff > 0) {
            const interpolated = interpolate(
                scrollY.value,
                [300, 450],
                [0, -80],
                Extrapolation.CLAMP
            )
            currentTranslation.value = interpolated;
            return interpolated;
        }

        if (diff > 0) {
            currentTranslation.value = Math.max(-80, currentTranslation.value - Math.abs(diff));
        } else {
            currentTranslation.value = Math.min(0, currentTranslation.value + Math.abs(diff));
        }
        prevScrollY.value = scrollY.value;
        return currentTranslation.value;
    })


    const scrollAnimatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: translateY.value
            }]
        }
    })

    if (!thoughts) return <Skeleton triple additionalStyles={height > 600 ? 'mt-27' : 'mt-8'} />;

    return (
        <>
            {thoughts && (
                <Animated.View style={[tw(`h-[111px] justify-end -mt-6 p-4 border-b border-white bg-slate-300 z-50 absolute w-full`), scrollAnimatedStyles]}>
                    <SearchPanel
                        setSearchFilter={setSearchFilter}
                        setDateFilter={setDateFilter}
                        dateFilter={dateFilter}
                    />
                </Animated.View>
            )}
            <View style={tw(`flex-1`)}>
                <Animated.FlatList
                    ref={flatlistRef}
                    style={tw(``)}
                    scrollEventThrottle={16}
                    data={thoughts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item, index }) => <ThoughtScrim item={item} index={index} isLastItem={index === thoughts.length - 1} additionalThoughtsLoading={additionalThoughtsLoading} />}
                    getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    onStartReached={() => thoughts.length > 9 && setFlatlistScrollStatus('start')}
                    onEndReached={handleEndReached}
                    ListEmptyComponent={<EmptyList />}
                    ListFooterComponent={<ListFooter listLength={thoughts.length} />}
                    ListHeaderComponent={<View style={tw(`h-[87px]`)} />}
                    showsVerticalScrollIndicator={false}
                />
                {thoughts.length > 9 && (
                    <Animated.View entering={FadeInLeft.duration(300).delay(300)} style={tw(`absolute bottom-8 left-4 z-50`)}>
                        <FixedBtn
                            iconName={flatlistScrollStatus === "start" ? 'caret-down' : 'caret-up'}
                            onScrollPress={handleScrollPress}
                        />
                    </Animated.View>
                )}
                <Animated.View entering={FadeInRight.duration(300).delay(300)} style={tw(`absolute bottom-[30px] right-5 z-50`)}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => router.navigate('/thoughts/create')}
                    >
                        <Image
                            source={require('@/assets/images/ink.png')}
                            style={tw(`w-12 h-12`)}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </>
    )
}