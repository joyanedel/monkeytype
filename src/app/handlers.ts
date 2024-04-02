import { KeyboardEventHandler } from "react"
import { CharEvent, SequenceCharState, SequenceStatus } from "../types"

const ALLOWED_CHARACTERS_REGEX = /^(Key[A-Z]|Backspace|Space)$/

export const handleKeyDown: (setter: any, previousValues: any) => KeyboardEventHandler<HTMLElement> = (setter, previousValues) => (event) => {
  if (!ALLOWED_CHARACTERS_REGEX.test(event.code)) return
  else if (event.code === "Space") setter([...previousValues, { timestamp: new Date(), character: " " }])
  else if (event.code === "Backspace") setter([...previousValues, { timestamp: new Date() }])
  else setter([...previousValues, { timestamp: new Date(), character: event.code.at(-1)!.toLowerCase() }])
}

export const getCurrentSentence = (currentWords: string[], text: string) => {
  return currentWords.reduce((acc, currentWord, currentIndex) => {
    const correlatedTextWord = text.split(" ").at(currentIndex)!
    const intermediateCurrentWord = currentIndex == currentWords.length - 1 ? currentWord.padEnd(correlatedTextWord.length, "-") : currentWord.padEnd(correlatedTextWord.length, "_")
    const zip = intermediateCurrentWord.split("").map((k, i) => [k, correlatedTextWord[i]])
    const spaceElement = currentIndex == 0 ? [] : [{ character: " ", result: SequenceStatus.CORRECT }]
    return [
      ...acc,
      ...spaceElement,
      ...zip.map(([userChar, textChar]) => {
        if (textChar == null) return { character: userChar, result: SequenceStatus.OVERWRITE }
        else if (userChar == "-") return { character: textChar, result: SequenceStatus.NONE }
        else if (userChar == "_") return { character: textChar, result: SequenceStatus.MISSED }
        else if (userChar != textChar) return { character: textChar, result: SequenceStatus.WRONG }
        return { character: textChar, result: SequenceStatus.CORRECT }
      })
    ]
  }, [] as SequenceCharState[])
}

export const getCurrentWords = (wordEvents: CharEvent[]) => {
  return wordEvents.reduce((acc, wordEvent) => {
    if (wordEvent.character == null) return acc.slice(0, -1)
    return [...acc, wordEvent.character]
  }, [] as string[]).join("").split(" ")
}
