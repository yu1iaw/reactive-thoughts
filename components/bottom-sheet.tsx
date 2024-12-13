import { useRefetchThoughts } from '@/contexts/refetch-thoughts-provider';
import { createThought, editThought } from '@/lib/prisma';
import tw from '@/lib/tailwind';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExternalLink } from './external-link';

type BottomSheetProps = {
    editableValue: string;
    thoughtId?: string;
}

export const BottomSheetView = ({ thoughtId, editableValue }: BottomSheetProps) => {
    const snapPoints = useMemo(() => ['5%', '95%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 70,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 100,
    });


    return (
        <GestureHandlerRootView>
            <BottomSheet
                android_keyboardInputMode="adjustResize"
                animationConfigs={animationConfigs}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={1}
                handleIndicatorStyle={tw(`bg-slate-400`)}
                style={tw(`rounded-t-3xl shadow overflow-hidden`)}
                handleStyle={tw(`bg-slate-200`)}
            >
                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    style={tw(`flex-1 bg-slate-200`)}
                >
                    <View style={tw(`gap-y-3 p-4`)}>
                        <Text style={tw(`body-text ml-1`)}>{thoughtId ? 'Edit this one' : 'Create a new one'}</Text>
                        <BottomSheetInput
                            thoughtId={thoughtId}
                            editableValue={editableValue}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={router.back}
                        style={tw(`p-2 px-4 mb-3 bg-white/90 rounded-full shadow-md self-center`)}
                    >
                        <Text style={tw(`body-text`)}>Go Back</Text>
                    </TouchableOpacity>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}

const BottomSheetInput = ({ thoughtId, editableValue }: BottomSheetProps) => {
    const [inputValue, setInputValue] = useState("");
    const [imageValue, setImageValue] = useState("");
    const [imageIsPending, setImageIsPending] = useState(false);
    const isEditMode = !!thoughtId;
    const { handleCreate, handleEdit } = useRefetchThoughts();


    useEffect(() => {
        setInputValue(editableValue);
    }, [editableValue])

    const pickImage = useCallback(async () => {
        setImageIsPending(true);

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true
            });

            if (!result.canceled) {
                const form = new FormData();
                form.append('image', result.assets[0].base64!);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.EXPO_PUBLIC_IMGBB_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    body: form
                });
                const hostedImg = await response.json();

                if (!hostedImg.success) return;

                const hostedImgUrl = hostedImg.data.url;
                setImageValue(hostedImgUrl);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setImageIsPending(false);
        }
    }, [])

    const onSend = async () => {
        try {
            let completeValue = inputValue;

            if (imageValue) {
                completeValue = `![image](${imageValue})\n ${inputValue}`;
            }

            if (isEditMode) {
                await editThought(+thoughtId, completeValue);
                handleEdit();
            } else {
                await createThought(completeValue);
                handleCreate();
            }
            router.back();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={tw(`pb-23 bg-white rounded-xl shadow overflow-hidden`)}>
            <BottomSheetTextInput
                placeholder='Markdown is welcome here...'
                multiline
                autoCapitalize='none'
                autoCorrect={false}
                numberOfLines={20}
                textAlignVertical='top'
                textBreakStrategy="balanced"
                style={tw(`bg-white p-5 text-justify`)}
                value={inputValue}
                onChangeText={setInputValue}
            />
            <View style={tw(`absolute border-t-[0.4px] border-gray-200 bottom-0 w-full h-23 px-3 pb-3`)}>
                {imageValue ? (
                    <TouchableOpacity onPress={() => setImageValue("")} style={tw(`flex-row items-center gap-x-2 -mb-7 mt-2`)}>
                        <Fontisto name='paperclip' color="gray" size={13} />
                        <Text style={tw(`font-spaceMono text-xs text-slate-500`)}>{imageValue.split('/')[4]}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={tw(`h-4 -mb-7 mt-2`)} />
                )}
                <View style={tw(`flex-row justify-between items-end h-full`)}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={tw(`p-3 bg-slate-200 rounded-full shadow`)}
                    >
                        <Ionicons name='images' color="cadetblue" size={20} />
                    </TouchableOpacity>
                    <ExternalLink
                        href='https://github.com/iamacup/react-native-markdown-display'
                        style={tw(`p-3 bg-slate-200 rounded-full shadow`)}
                    >
                        <Ionicons name='information' color="#0369a1" size={20} />
                    </ExternalLink>
                    <TouchableOpacity
                        onPress={onSend}
                        disabled={!inputValue && !imageValue || imageIsPending}
                        style={tw(`p-3 bg-slate-200 rounded-full shadow`)}
                    >
                        <Ionicons name='paper-plane' color={!inputValue && !imageValue || imageIsPending ? "#FFFFF0" : "cadetblue"} size={20} />
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
}