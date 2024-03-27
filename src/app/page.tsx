"use client"

import { KeyboardEventHandler, useEffect, useRef, useState } from "react"
import { loadWord } from "@/lib/loaders"

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
  OVERWRITE: "text-red-800",
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
  const mainRef = useRef<HTMLElement>(null)
  mainRef.current?.focus()
  const [TARGET_TEXT, setTARGET_TEXT] = useState("")
  const [wordEvents, setWordEvents] = useState<CharEvent[]>([])

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
      if (!ALLOWED_CHARACTERS_REGEX.test(event.code)) return
      else if (event.code === "Space") setWordEvents([...wordEvents, { timestamp: new Date(), character: " " }])
      else if (event.code === "Backspace") setWordEvents([...wordEvents, { timestamp: new Date() }])
      else setWordEvents([...wordEvents, { timestamp: new Date(), character: event.code.at(-1)!.toLowerCase() }])
  }

  useEffect(() => {
    loadWord(20).then(words => setTARGET_TEXT(words.join(" ").toLowerCase()))
  }, [])

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
        else if (userChar != textChar) return { character: textChar, result: SequenceStatus.WRONG }
        return { character: textChar, result: SequenceStatus.CORRECT }
      })
    ]
  }, [] as SequenceCharState[])

  const sequenceAhead = " " + TARGET_TEXT.split(" ").slice(currentWords.length).join(" ")
  
  return (
    <main className="h-full font-mono focus:outline-none" tabIndex={0} onKeyDown={handleKeyDown} ref={mainRef}>
      <header className="grid grid-cols-3 h-20 bg-gray-800 text-gray-300">
        <div className="flex flex-row justify-start items-center px-20">
          <span>{currentWords.join("").length}</span>
          /
          <span>{TARGET_TEXT.replaceAll(" ", "").length}</span>
        </div>
        <h1 className="text-3xl col-start-2 flex flex-column justify-center items-center">Typing Test</h1>
      </header>

      <section
        className="flex flex-col items-start justify-center w-full h-full p-20"
        aria-label="typing zone"
      >
        <div style={{ letterSpacing: "2px"}} className="text-2xl">
          {
            currentSequence.filter(char => char.result != SequenceStatus.NONE).map((char, index) => (
              <span key={`user-char-${index}`} className={CHAR_COLORS[char.result]}>{char.character}</span>
            ))
          }
          <span className="animate-cursor-blink absolute -ml-2" style={{ letterSpacing: 0 }}>|</span>
          {
            currentSequence.filter(char => char.result == SequenceStatus.NONE).map((char, index) => (
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
