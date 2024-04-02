"use client"

import { useRef, useState } from "react"
import { getCurrentSentence, getCurrentWords, handleKeyDown } from "./handlers"
import { useRandomWords } from "../hooks/words"
import { CharEvent, SequenceStatus } from "../types"
import { redirect, useRouter } from "next/navigation"

const CHAR_COLORS = {
  CORRECT: "text-gray-300",
  WRONG: "text-red-600",
  MISSED: "text-red-800",
  OVERWRITE: "text-red-800",
  NONE: "text-gray-500"
}

export default function Home() {
  const { text, length, wordsLength } = useRandomWords(20)
  const mainRef = useRef<HTMLElement>(null)
  mainRef.current?.focus()
  const [wordEvents, setWordEvents] = useState<CharEvent[]>([])

  const currentWords = getCurrentWords(wordEvents)
  const currentSequence = getCurrentSentence(currentWords, text)
  const sequenceAhead = " " + text.split(" ").slice(currentWords.length).join(" ")

  const isFinished = (currentWords.length == wordsLength && length > 0 && currentSequence.every(char => char.result != SequenceStatus.NONE)) || (currentWords.length > wordsLength && length > 0)

  if (isFinished) {
    redirect("/finish")
  }
  
  return (
    <main className="h-full font-mono focus:outline-none" tabIndex={0} onKeyDown={handleKeyDown(setWordEvents, wordEvents)} ref={mainRef}>
      <header className="grid grid-cols-3 h-20 bg-gray-800 text-gray-300">
        <div className="flex flex-row justify-start items-center px-20">
          <span>{currentWords.join("").length}</span>
          /
          <span>{length}</span>
        </div>
        <h1 className="text-3xl col-start-2 flex flex-column justify-center items-center">Typing Test</h1>
        <span
          className="flex flex-row justify-end items-center px-20 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Repeat?
        </span>
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
