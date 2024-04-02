import { loadWord } from "@/lib/loaders"
import { pickRandom } from "@/lib/random"
import { useEffect, useState } from "react"

export const useRandomWords = (quantity: number) => {
  const [words, setWords] = useState<string>("")

  useEffect(() => {
    loadWord(quantity).then(w => w.join(" ").toLowerCase()).then(setWords)
  }, [quantity])

  return {
    text: words
  }
}
