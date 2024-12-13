import tw from '@/lib/tailwind';
import { Thought } from '@prisma/client/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, LayoutRectangle, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { PopUpMenu } from './menu';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type ThoughtScrimProps = {
    item: Thought;
    index: number;
    isLastItem: boolean;
    additionalThoughtsLoading: boolean;
}

const ITEM_HEIGHT = 220;
const MARKDOWN_MAX_HEIGHT = 180;

export const ThoughtScrim = ({ item, index, isLastItem, additionalThoughtsLoading }: ThoughtScrimProps) => {
    const [markdownHeight, setMarkdownHeight] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const imageRef = useRef<View>(null);
    const isOdd = index % 2 === 0;
    const animatedHeight = useSharedValue(ITEM_HEIGHT);
    const overflow = markdownHeight > MARKDOWN_MAX_HEIGHT;


    const onLayout = ({ nativeEvent }: { nativeEvent: { layout: LayoutRectangle } }) => {
        setMarkdownHeight(nativeEvent.layout.height);
        nativeEvent.layout.height <= MARKDOWN_MAX_HEIGHT && setShowMore(false);
    }

    const handleCaptureView = async () => {
        const localUri = await captureRef(imageRef, {
            height: 440,
            quality: 1,
            // result: "base64",
        })

        return localUri;
    }


    const rules = useMemo(() => (
        {
            paragraph: (node: any, children: any, parent: any, styles: any, inheritedStyles = {}) => {
                const isImageIncluded = node.children.find((c: any) => c.sourceType === 'image');                
                return (
                    isImageIncluded
                        ? children
                        : (
                            <Text
                                key={node.key}
                                style={[inheritedStyles, styles.text]}
                            >
                                {children}
                            </Text>
                        )
                )
            },
            body: (node: any, children: any, parent: any, styles: any) => (
                <View onLayout={onLayout} key={node.key} style={styles._VIEW_SAFE_body}>
                    {children}
                </View>
            ),
        }
    ), [])


    const collapsableStyle = useAnimatedStyle(() => {
        animatedHeight.value = showMore ? markdownHeight + 67 : ITEM_HEIGHT;

        return {
            height: withDelay(0, withTiming(animatedHeight.value))
        }
    }, [showMore])

    return (
        <Animated.View entering={FadeIn.duration(500).delay(100)} exiting={FadeOut}>
            <Animated.View
                ref={imageRef}
                collapsable={false}
                style={[tw(`overflow-scroll bg-white border-t border-white p-4`, isLastItem && `border-b border-white`), collapsableStyle]}
            >
                <LinearGradient
                    colors={isOdd
                        ? ['rgba(21, 97, 109, 0.23)', 'rgba(255, 212, 128, 0.25)']
                        : ['rgba(255, 212, 128, 0.25)', 'rgba(21, 97, 109, 0.23)']
                    }
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 1]}
                    style={tw(`absolute top-0 bottom-0 left-0 right-0`)}
                />
                <View style={tw(`flex-row items-center justify-between`)}>
                    <Text style={tw(`font-spaceMono text-sm text-slate-500`)}>
                        {item.createdAt.toLocaleDateString('default', {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </Text>
                    <PopUpMenu
                        itemId={item.id}
                        itemContent={item.content}
                        handleCaptureView={handleCaptureView}
                    />
                </View>
                <Markdown
                    style={styles}
                    rules={rules}
                >
                    {item.content}
                </Markdown>
                {(overflow || item.content.match(/!\[.*\]\(https.+\)/i)) && (
                    <AnimatedTouchableOpacity
                        activeOpacity={0.8}
                        entering={FadeIn.delay(150)}
                        exiting={FadeOut}
                        style={tw(`absolute border-b-2 border-white flex-center -bottom-0 left-[50%] w-[90px] h-8 ml-4 bg-slate-200 shadow z-10`, { transform: [{ translateX: -45 }] })}
                        onPress={() => { setShowMore(!showMore) }}
                    >
                        <Text style={tw(`text-sky-700 font-spaceMono`)}>
                            {showMore ? ' Collapse' : 'Expand'}
                        </Text>
                    </AnimatedTouchableOpacity>
                )}
            </Animated.View>
            {isLastItem && additionalThoughtsLoading && (
                <ActivityIndicator size="large" color="#0369a1" style={tw(`z-10 mt-4 absolute -bottom-11 self-center`)} />
            )}
        </Animated.View>

    )
}

const styles = StyleSheet.create({
    code_inline: {
        backgroundColor: '#FFFFF0',
    },
    image: {
        width: '100%',
        height: 300,
    },
    paragraph: {
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: 0.1,
    },
    link: {
        color: "#0369a1",
    },
    blockquote: {
        backgroundColor: "transparent",
        borderColor: "#B0C4DE",
        marginLeft: 8,
        paddingHorizontal: 10,
    },
    body: {
        color: '#1e293b',
        paddingBottom: 16,
    }
})