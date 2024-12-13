import tw from '@/lib/tailwind';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';


type ListFooterProps = {
    listLength: number;
}

export const ListFooter = ({ listLength }: ListFooterProps) => {
    const isOdd = listLength % 2 !== 0;

    return (
        <View style={tw(`bg-transparent h-12 relative border-t border-white`, {
            'border-t-0': listLength < 3
        })}>
            {listLength < 3
                ? null 
                : (
                    <LinearGradient
                        colors={isOdd
                            ? ['rgba(255, 212, 128, 0.25)', 'rgba(147, 198, 214, 0.35)']
                            : ['rgba(21, 97, 109, 0.23)', 'rgba(236, 217, 198, 0.2)']
                        }
                        start={{ x: 1, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={[0, 1]}
                        style={tw(`absolute w-full h-full`)}
                    />
                )
            }
        </View>
    )
}