"use client"

import { useEffect, useState } from "react"

const TARGET_TEXT = "hola mundo esto es un texto al azar Lorem ipsum dolot sit amet".toLowerCase()
const ALLOWED_CHARACTERS_REGEX = /^(Key[A-Z]|Backspace|Space)$/

enum SequenceStatus {
  CORRECT = "CORRECT",
  WRONG = "WRONG",
  MISSED = "MISSED",
  OVERWRITE = "OVERWRITE",
  NONE = "NONE"
}

const CHAR_COLORS = {
  CORRECT: "text-gray-300",
  WRONG: "text-red-600",
  MISSED: "text-red-800",
  OVERWRITE: "text-yellow-500",
  NONE: "text-gray-500"
}

type CharEvent = {
  timestamp: Date
  character?: string
}

type SequenceCharState = {
  character: string
  result: SequenceStatus
}

export default function Home() {
  const [wordEvents, setWordEvents] = useState<CharEvent[]>([])

  const currentWords = wordEvents.reduce((acc, wordEvent) => {
    if (wordEvent.character == null) return acc.slice(0, -1)
    return [...acc, wordEvent.character]
  }, [] as string[]).join("").split(" ").filter(word => word.length > 0)

  const currentSequence = currentWords.reduce((acc, currentWord, currentIndex) => {
    const correlatedTextWord = TARGET_TEXT.split(" ").at(currentIndex)!
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
        else if (userChar != textChar) return { character: userChar, result: SequenceStatus.WRONG }
        return { character: textChar, result: SequenceStatus.CORRECT }
      })
    ]
  }, [] as SequenceCharState[])

  const sequenceAhead = " " + TARGET_TEXT.split(" ").slice(currentWords.length).join(" ")
  
  return (
    <main className="h-screen">
      <section
        className="flex flex-col items-start justify-center w-full h-full p-20"
        aria-label="typing zone"
      >
        <input onKeyDown={(event) => {
            if (!ALLOWED_CHARACTERS_REGEX.test(event.code)) return
            else if (event.code === "Space") setWordEvents([...wordEvents, { timestamp: new Date(), character: " " }])
            else if (event.code === "Backspace") setWordEvents([...wordEvents, { timestamp: new Date() }])
            else setWordEvents([...wordEvents, { timestamp: new Date(), character: event.code.at(-1)!.toLowerCase() }])
          }} />
        <div style={{ letterSpacing: "2px", fontFamily: "monospace" }} className="text-2xl">
          {
            currentSequence.map((char, index) => (
              <span key={`user-char-${index}`} className={CHAR_COLORS[char.result]}>{char.character}</span>
            ))
          }
          {
            sequenceAhead.split("").map((char, index) => (
              <span key={index} className="text-gray-500">{char}</span>
            ))
          }
        </div>
      </section>
    </main>
  )
}
