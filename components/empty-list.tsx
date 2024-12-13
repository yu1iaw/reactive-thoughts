import tw from '@/lib/tailwind';
import { Text, View } from 'react-native';


export const EmptyList = () => {
    return (
        <View style={tw(`h-[250px] justify-end items-center`)}>
            <Text style={tw(`font-spaceMono text-lg text-gray-600`)}>Nothing found</Text>
        </View>
    )
}