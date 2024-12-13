import { useRefetchThoughts } from '@/contexts/refetch-thoughts-provider';
import { deleteThought } from '@/lib/prisma';
import tw from '@/lib/tailwind';
import { sleep } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { router, useSegments } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';


type PopUpMenuProps = ViewProps & {
    itemId: number;
    itemContent: string;
    handleCaptureView: () => Promise<string>;
}

export const PopUpMenu = ({ itemId, itemContent, handleCaptureView }: PopUpMenuProps) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const segments = useSegments();
    const { handleDelete } = useRefetchThoughts();
    

    const showMenu = () => {
        setIsMenuVisible(true);
    }
    const hideMenu = () => {
        setIsMenuVisible(false);
    }

    const handleSharePress = async () => {
        hideMenu();

        try {
            const localUri = await handleCaptureView();
            if (localUri) {
                await Sharing.shareAsync(localUri);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditThoughtPress = async () => {
        hideMenu();
        await sleep();
        router.navigate({ pathname: "/thoughts/create", params: { thoughtId: itemId, segmentIndex: segments[1] ? 1 : undefined } })
    }

    const handleMoreOptionsPress = async () => {
        hideMenu();
        await sleep();
        router.navigate(`/thoughts/${itemId}`)
    }

    const handleCopyContentPress = async () => {
        hideMenu();

        try {
            await Clipboard.setStringAsync(itemContent);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSharePDFPress = async () => {
        hideMenu();

        try {
            const res = await fetch('https://rnrt.netlify.app/api/convert', {
                method: "POST",
                headers: {
                    'Content-Type': "text/markdown"
                },
                body: itemContent
            })
            const html = await res.text();
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.log(error);
        }
    }

    const handleTakeScreenshot = async () => {
        hideMenu();
        try {
            const localUri = await handleCaptureView();
            if (localUri) {
                const { granted } = await MediaLibrary.requestPermissionsAsync();
                if (granted) {
                    await MediaLibrary.saveToLibraryAsync(localUri);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleDeleteThoughtPress = async () => {
        hideMenu();

        try {
            await deleteThought(itemId);
            handleDelete();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Menu
            visible={isMenuVisible}
            anchor={
                <TouchableOpacity onPress={showMenu} style={tw(`rounded-full p-2`)}>
                    <Ionicons name='settings' color="#64748b" size={18} />
                </TouchableOpacity>
            }
            onRequestClose={hideMenu}
            style={tw(`-mt-2 -ml-8 bg-slate-200 min-w-[150px]`)}
        >
            <MenuItem onPress={handleEditThoughtPress} pressColor='#bccadc'>
                <View style={tw(`flex-row items-center gap-x-3`)}>
                    <Ionicons name="text" color="#64748b" size={15} />
                    <Text style={tw(`font-spaceMono text-slate-800`)}>Edit</Text>
                </View>
            </MenuItem>
            <MenuDivider color='white' />
            <MenuItem onPress={handleSharePress} pressColor='#bccadc'>
                <View style={tw(`flex-row items-center gap-x-3`)}>
                    <Ionicons name="share-social-outline" color="#64748b" size={15} />
                    <Text style={tw(`font-spaceMono text-slate-800`)}>Share as Image</Text>
                </View>
            </MenuItem>
            <MenuDivider color='white' />
            <MenuItem onPress={handleSharePDFPress} pressColor='#bccadc'>
                <View style={tw(`flex-row items-center gap-x-3`)}>
                    <Ionicons name="share-outline" color="#64748b" size={15} />
                    <Text style={tw(`font-spaceMono text-slate-800`)}>Share as PDF</Text>
                </View>
            </MenuItem>
            <MenuDivider color='white' />
            {segments[1] && (
                <>
                    <MenuItem onPress={handleCopyContentPress} pressColor='#bccadc'>
                        <View style={tw(`flex-row items-center gap-x-3`)}>
                            <Ionicons name="clipboard-outline" color="#64748b" size={15} />
                            <Text style={tw(`font-spaceMono text-slate-800`)}>Copy Content</Text>
                        </View>
                    </MenuItem>
                    <MenuDivider color='white' />
                </>
            )}
            <MenuItem onPress={segments[1] ? handleTakeScreenshot : handleMoreOptionsPress} pressColor='#bccadc'>
                <View style={tw(`flex-row items-center gap-x-3`)}>
                    <Ionicons name={segments[1] ? "image-outline" : "open-outline"} color="#64748b" size={15} />
                    <Text style={tw(`font-spaceMono text-slate-800`)}>{segments[1] ? 'Save to Gallery' : 'More Options'}</Text>
                </View>
            </MenuItem>
            {segments[1] && (
                <>
                    <MenuDivider color='white' />
                    <MenuItem onPress={handleDeleteThoughtPress} pressColor='#bccadc'>
                        <View style={tw(`flex-row items-center gap-x-3`)}>
                            <Ionicons name="trash-outline" color="#64748b" size={15} />
                            <Text style={tw(`font-spaceMono text-slate-800`)}>Delete</Text>
                        </View>
                    </MenuItem>
                </>
            )}
        </Menu>
    )
}