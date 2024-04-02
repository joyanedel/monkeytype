export enum SequenceStatus {
  CORRECT = "CORRECT",
  WRONG = "WRONG",
  MISSED = "MISSED",
  OVERWRITE = "OVERWRITE",
  NONE = "NONE"
}

export type SequenceCharState = {
  character: string
  result: SequenceStatus
}

export type CharEvent = {
  timestamp: Date
  character?: string
}
