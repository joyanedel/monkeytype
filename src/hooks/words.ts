import { loadWord } from "@/lib/loaders"
import { useEffect, useState } from "react"

export const useRandomWords = (quantity: number) => {
  const [words, setWords] = useState<string>("")
  const [length, setLength] = useState<number>(0)
  const [wordsLength, setWordsLength] = useState<number>(0)

  useEffect(() => {
    loadWord(quantity).then(w => w.join(" ").toLowerCase()).then(txt => {
      setWords(txt)
      setLength(txt.replaceAll(" ", "").length)
      setWordsLength(txt.split(" ").length)
    })
  }, [quantity])

  return {
    text: words,
    length,
    wordsLength
  }
}
