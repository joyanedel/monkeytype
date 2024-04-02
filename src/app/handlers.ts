import { KeyboardEventHandler } from "react"

const ALLOWED_CHARACTERS_REGEX = /^(Key[A-Z]|Backspace|Space)$/

export const handleKeyDown: (setter: any, previousValues: any) => KeyboardEventHandler<HTMLElement> = (setter, previousValues) => (event) => {
  if (!ALLOWED_CHARACTERS_REGEX.test(event.code)) return
  else if (event.code === "Space") setter([...previousValues, { timestamp: new Date(), character: " " }])
  else if (event.code === "Backspace") setter([...previousValues, { timestamp: new Date() }])
  else setter([...previousValues, { timestamp: new Date(), character: event.code.at(-1)!.toLowerCase() }])
}
