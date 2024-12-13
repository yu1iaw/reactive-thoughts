import tw from '@/lib/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';



type FixedBtnProps = {
    iconName: React.ComponentProps<typeof Ionicons>['name'];
    onPress?: () => void;
    onScrollPress?: () => void;
}

export const FixedBtn = ({ iconName, onScrollPress, onPress }: FixedBtnProps) => {
    return (
        <TouchableOpacity onPress={iconName.startsWith("caret") ? onScrollPress : onPress} style={tw(`p-2 bg-slate-200/80 rounded-full shadow-md`)}>
            <Ionicons name={iconName} size={25} color="#1e293b" />
        </TouchableOpacity>
    )
}