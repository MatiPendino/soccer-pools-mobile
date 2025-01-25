import { Share } from "react-native"

export default async function handleShare () {
    try {
      await Share.share({
        message: "Pronosticate all the results and win! Download it here: https://play.google.com/store/apps/details?id=com.matipendino2001.soccerpools",
      })
    } catch (error) {
      console.error("Error sharing content:", error.message)
    }
}