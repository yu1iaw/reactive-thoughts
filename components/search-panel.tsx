import { useDebounce } from '@/hooks/useDebounce';
import tw from '@/lib/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from 'react-native-wheel-pick';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const selectedMonth = months[new Date().getMonth()];
const years = Array.from({ length: 202 }, (_, i) => 2022 + i);
const selectedYear = years.find((y) => y === new Date().getFullYear()) as number;

type SearchPanelProps = {
    setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
    setDateFilter: React.Dispatch<React.SetStateAction<string | null>>;
    dateFilter: string | null;
}

export const SearchPanel = ({ setSearchFilter, setDateFilter, dateFilter }: SearchPanelProps) => {
    const [value, setValue] = useState("");
    const [month, setMonth] = useState(selectedMonth);
    const [year, setYear] = useState(selectedYear);
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const searchFilter = useDebounce<string>(value, 800);


    useEffect(() => {
        setSearchFilter(searchFilter);
    }, [searchFilter])


    const handleSelectPress = () => {
        setDateFilter(`${month} ${year}`);
        setFilterIsOpen(false);
    }

    const handleResetDateFilter = () => {
        dateFilter !== null && setDateFilter("");
    }

        
    return (
        <>
            <View style={tw(`flex-row p-1 gap-x-3`)}>
                <View style={tw(`relative flex-1 flex-row items-center gap-x-1 px-2 bg-white/90 rounded-full shadow`)}>
                    <Ionicons
                        name='search'
                        color="gray"
                        size={18}
                        style={tw(`mx-1`)}
                    />
                    <TextInput
                        value={value}
                        onChangeText={setValue}
                        placeholder='Search for thoughts...'
                        style={tw(`flex-1 text-sm`)}
                    />

                    {value && (
                        <TouchableOpacity onPress={() => setValue('')}>
                            <Ionicons
                                name='close'
                                color="gray"
                                size={19}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={tw(`flex-row gap-x-[10px]`)}>
                    <TouchableOpacity
                        onPress={handleResetDateFilter}
                        style={tw(`p-2 bg-slate-200 rounded-full shadow-md`)}
                    >
                        <MaterialCommunityIcons name='filter-remove-outline' size={25} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilterIsOpen(!filterIsOpen)}
                        style={tw(`p-2 bg-slate-200 rounded-full shadow-md`)}
                    >
                        <MaterialCommunityIcons name='filter-outline' size={25} color={dateFilter ? "#4d7c0f" : "#BC8F8F"} />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                isVisible={filterIsOpen}
                backdropColor='rgba(30, 41, 59, 0.9)'
                onBackdropPress={() => setFilterIsOpen(false)}
            >
                <View style={tw(`bg-slate-300 rounded-2xl overflow-hidden gap-y-3`)}>
                    <View style={tw(`bg-[#a3b0c2] h-[60px] justify-center pl-5`)}>
                        <Text style={tw(`body-text opacity-90`)}>Select Month/Year</Text>
                    </View>
                    <View style={tw(`bg-slate-300 h-[195px] flex-row justify-center items-center gap-x-5 rounded-2xl`)}>
                        <Picker
                            style={tw(`w-[140px] h-[190px] bg-transparent`)}
                            selectedValue={month}
                            pickerData={months}
                            onValueChange={(value: typeof months[0]) => setMonth(value)}
                            textColor="#64748b"
                            selectTextColor='#1e293b'
                            isShowSelectBackground={true}
                            selectBackgroundColor='rgba(255, 255, 240, 0.25)'
                            isShowSelectLine={false}
                        />
                        <Picker
                            style={tw(`w-[120px] h-[190px] bg-transparent`)}
                            selectedValue={String(year)}
                            pickerData={years}
                            onValueChange={(value: typeof years[0]) => setYear(value)}
                            textColor="#64748b"
                            selectTextColor='#1e293b'
                            isShowSelectBackground={true}
                            selectBackgroundColor='rgba(255, 255, 240, 0.25)'
                            isShowSelectLine={false}
                        />
                    </View>
                    <View style={tw(`flex-row justify-around items-center h-[60px] bg-[#a3b0c2]`)}>
                        <TouchableOpacity onPress={() => setFilterIsOpen(false)} style={tw(`p-2`)}>
                            <Text style={tw(`text-slate-500 font-spaceMono text-[15px]`)}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSelectPress} style={tw(`p-2`)}>
                            <Text style={tw(`text-sky-700 font-spaceMono text-[15px]`)}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}