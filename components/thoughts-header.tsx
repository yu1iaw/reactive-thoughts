import tw from '@/lib/tailwind';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type ThoughtsHeaderProps = {
    title: string;
    bgDefault?: boolean;
}

export const ThoughtsHeader = ({ title, bgDefault }: ThoughtsHeaderProps) => {
    const { top } = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={!bgDefault
                ? ['#e0ebeb', '#c1d7d7']
                : ['#dfe5ec', '#dde4ee']
            }
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.1, 1]}
            style={tw(`h-20 flex-center pt-[${top}]px rounded-b-3xl shadow-sm`)}
        >
            <Text style={tw(`body-text`)}>{title}</Text>
        </LinearGradient>
    )
}