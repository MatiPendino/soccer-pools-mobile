import { View, Text } from "react-native";
import { RoundProps } from "../../../types";

interface ResultsProps {
    rounds: RoundProps[]
}

export default function Results ({rounds}: ResultsProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Results Screen</Text>
        </View>
    )
}