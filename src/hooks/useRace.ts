import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimationStep, AlgorithmKey } from '../types/sorting'

export interface RacePlayerState {
  key: AlgorithmKey
  steps: AnimationStep[]
  currentStep: number
  isFinished: boolean
  finishedAt: number | null
  comparisons: number
  swaps: number
  overwrites: number
}

export interface RaceState {
  players: RacePlayerState[]
  isPlaying: boolean
  speed: number
  winnerId: AlgorithmKey | null
  startTime: number | null
}

export interface RaceControls {
  play: () => void
  pause: () => void
  reset: () => void
  setSpeed: (speed: number) => void
}

export function useRace(
  algorithms: { key: AlgorithmKey; steps: AnimationStep[] }[]
): RaceState & RaceControls {
  const makeInitialPlayers = useCallback((): RacePlayerState[] =>
    algorithms.map(({ key, steps }) => ({
      key,
      steps,
      currentStep: -1,
      isFinished: false,
      finishedAt: null,
      comparisons: 0,
      swaps: 0,
      overwrites: 0,
    })),
  [algorithms])

  const [players, setPlayers] = useState<RacePlayerState[]>(makeInitialPlayers)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeedState] = useState(150)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [winnerId, setWinnerId] = useState<AlgorithmKey | null>(null)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current)
      intervalRef.current = null
    }
  }

  const tick = useCallback(() => {
    setPlayers((prev) => {
      const now = Date.now()
      const updated = prev.map((p) => {
        if (p.isFinished) return p
        const nextStep = p.currentStep + 1
        if (nextStep >= p.steps.length) {
          return { ...p, isFinished: true, finishedAt: now, currentStep: p.steps.length - 1 }
        }
        const step = p.steps[nextStep]
        return {
          ...p,
          currentStep: nextStep,
          comparisons: p.comparisons + (step.type === 'COMPARE' ? 1 : 0),
          swaps: p.swaps + (step.type === 'SWAP' ? 1 : 0),
          overwrites: p.overwrites + (step.type === 'OVERWRITE' ? 1 : 0),
        }
      })

      // Set winner once — the first player to finish, never overwrite
      const firstFinished = updated.find((p) => p.isFinished)
      if (firstFinished) {
        setWinnerId((current) => current ?? firstFinished.key)
      }

      if (updated.every((p) => p.isFinished)) {
        setIsPlaying(false)
      }
      return updated
    })
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      clearTimer()
      return
    }
    if (players.every((p) => p.isFinished)) {
      setIsPlaying(false)
      return
    }
    intervalRef.current = setTimeout(tick, speed)
    return clearTimer
  }, [isPlaying, players, speed, tick])

  const play = useCallback(() => {
    setStartTime((prev) => prev ?? Date.now())
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setStartTime(null)
    setWinnerId(null)
    setPlayers(makeInitialPlayers())
  }, [makeInitialPlayers])

  const setSpeed = useCallback((s: number) => setSpeedState(s), [])

  return { players, isPlaying, speed, winnerId, startTime, play, pause, reset, setSpeed }
}
