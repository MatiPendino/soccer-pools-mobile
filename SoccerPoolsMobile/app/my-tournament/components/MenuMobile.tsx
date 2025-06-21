import { View, Pressable } from "react-native"
import { Menu } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { TournamentProps } from "types";

interface MenuMobileProps {
    tournament: TournamentProps;
    t: (key: string) => string;
    handleTournamentClick: (slug: string) => void;
    isMenuVisible: boolean;
    setIsMenuVisible: (visible: boolean) => void;
    handleShare: () => void;
}

export default function MenuMobile ({
    tournament, t, handleTournamentClick, isMenuVisible, setIsMenuVisible, handleShare
}: MenuMobileProps) {

    return (
        <View>
            <Menu
                visible={isMenuVisible}
                onDismiss={() => setIsMenuVisible(false)}
                anchor={
                    <Pressable onPress={() => setIsMenuVisible(true)}>
                        <Entypo name="dots-three-vertical" color="white" size={30} />   
                    </Pressable>
                }
            >
                <Menu.Item onPress={handleShare} title={t('invite-friends')} />
                {
                    tournament.is_current_user_admin &&
                    <View>
                        <Menu.Item 
                            onPress={
                                () => handleTournamentClick('pending-invites')
                            } 
                            title={t('pending-invites')}
                        />
                        <Menu.Item 
                            onPress={
                                () => handleTournamentClick('edit-tournament')
                            } 
                            title={t('tournament-settings')}
                        />
                    </View>
                }
            </Menu>
        </View>
    )
}