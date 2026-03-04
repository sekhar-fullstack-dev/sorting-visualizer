import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimationStep } from '../types/sorting'

export interface PlayerState {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  isFinished: boolean
  speed: number
}

export interface PlayerControls {
  play: () => void
  pause: () => void
  reset: () => void
  nextStep: () => void
  prevStep: () => void
  setSpeed: (speed: number) => void
  jumpTo: (step: number) => void
}

export function useAnimationPlayer(steps: AnimationStep[]): PlayerState & PlayerControls & { currentStepData: AnimationStep | null } {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeedState] = useState(150)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalSteps = steps.length
  const isFinished = currentStep >= totalSteps - 1
  const currentStepData = currentStep >= 0 && currentStep < totalSteps ? steps[currentStep] : null

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const tick = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1
      if (next >= steps.length) {
        setIsPlaying(false)
        return prev
      }
      return next
    })
  }, [steps.length])

  useEffect(() => {
    if (!isPlaying) {
      clearTimer()
      return
    }
    if (isFinished) {
      setIsPlaying(false)
      return
    }
    timeoutRef.current = setTimeout(tick, speed)
    return clearTimer
  }, [isPlaying, isFinished, currentStep, speed, tick])

  const play = useCallback(() => {
    if (isFinished) return
    setIsPlaying(true)
  }, [isFinished])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentStep(-1)
  }, [])

  const nextStep = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentStep((prev) => Math.max(prev - 1, -1))
  }, [])

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s)
  }, [])

  const jumpTo = useCallback((step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, totalSteps - 1)))
  }, [totalSteps])

  return {
    currentStep,
    totalSteps,
    isPlaying,
    isFinished,
    speed,
    currentStepData,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setSpeed,
    jumpTo,
  }
}
