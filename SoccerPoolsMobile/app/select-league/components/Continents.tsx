import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Continents ({item, selectedContinent, setSelectedContinent}) {
    const isSelected: boolean = selectedContinent.id === item.id;

    return (
        <TouchableOpacity
        style={[
            styles.continentTab,
            isSelected && styles.selectedContinentTab
        ]}
        onPress={() => setSelectedContinent(item)}
        activeOpacity={0.7}
        >
        <Text 
            style={[
                styles.continentTabText,
                isSelected && styles.selectedContinentTabText
            ]}
        >
            {item.name}
        </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    continentTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    selectedContinentTab: {
        backgroundColor: 'white',
    },
    continentTabText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    selectedContinentTabText: {
        color: '#5e48b8',
    },
})