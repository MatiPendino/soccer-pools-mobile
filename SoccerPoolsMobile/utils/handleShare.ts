import { Share } from "react-native"

export default async function handleShare () {
    try {
      await Share.share({
        message: "Pronosticate all the results and win! Download it here: https://example.com",
      })
    } catch (error) {
      console.error("Error sharing content:", error.message)
    }
}