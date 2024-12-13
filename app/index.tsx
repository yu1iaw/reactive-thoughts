import { Skeleton } from '@/components/skeleton';
import { Dimensions } from 'react-native';


const { height } = Dimensions.get("window");

export default function Auth() {
    return <Skeleton triple additionalStyles={height > 600 ? 'mt-27' : 'mt-8'} />
}