import { WEBSITE_URL } from '../constants';
import { Share } from "react-native"

export default async function handleShare (referralCode?: string) {
    try {
      await Share.share({
        message: `Pronosticate all the results and win! Download it here: ${WEBSITE_URL}?referralCode=${referralCode ? referralCode : ''}`,
      })
    } catch (error) {
      console.error("Error sharing content:", error.message)
    }
}