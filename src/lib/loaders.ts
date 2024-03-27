import { pickRandom } from "./random"

export const loadWordList = async () => {
  const response = await fetch("static/words_minified.json")
  const words = await response.json()
  return words
}

export const loadWord = async (quantity: number) => {
  const words = (await loadWordList())
  return Array.from({ length: quantity }, () => pickRandom(words))
}
