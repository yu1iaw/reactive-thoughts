import { BottomSheetView } from '@/components/bottom-sheet';
import { getSingleThought } from '@/lib/prisma';
import tw from '@/lib/tailwind';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';



export default function CreateThought() {
  const [editableValue, setEditableValue] = useState("");
  const { thoughtId } = useLocalSearchParams<{ thoughtId?: string }>();
  

  useEffect(() => {
    if (!thoughtId) return;

    const getThoughtDetails = async () => {
      try {
        const res = await getSingleThought(+thoughtId);        
        if (res) setEditableValue(res.content);
      } catch (error) {
        console.log(error);
      }
    }

    getThoughtDetails();
  }, [thoughtId])


  return (
    <View style={tw(`flex-1`)}>
      <BottomSheetView
        thoughtId={thoughtId}
        editableValue={editableValue}
      />
    </View>
  );
}

