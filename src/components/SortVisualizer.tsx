import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlgorithmKey, AnimationStep } from '../types/sorting'
import { randomArray } from '../utils/arrayUtils'
import { generateSteps as bubbleSteps } from '../algorithms/bubbleSort'
import { generateSteps as insertionSteps } from '../algorithms/insertionSort'
import { generateSteps as selectionSteps } from '../algorithms/selectionSort'
import { generateSteps as mergeSteps } from '../algorithms/mergeSort'
import { generateSteps as quickSteps } from '../algorithms/quickSort'
import { generateSteps as heapSteps } from '../algorithms/heapSort'
import { useAnimationPlayer } from '../hooks/useAnimationPlayer'
import { useRace } from '../hooks/useRace'
import { BarChart } from './BarChart'
import { ControlPanel } from './ControlPanel'
import { AlgorithmInfo } from './AlgorithmInfo'
import { StepDescription } from './StepDescription'
import { RaceMode } from './RaceMode'

const GENERATORS: Record<AlgorithmKey, (arr: number[]) => AnimationStep[]> = {
  bubble: bubbleSteps,
  insertion: insertionSteps,
  selection: selectionSteps,
  merge: mergeSteps,
  quick: quickSteps,
  heap: heapSteps,
}

function useRipple(isFinished: boolean, arrayLength: number): number {
  const [rippleIndex, setRippleIndex] = useState(-1)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isFinished) {
      setRippleIndex(-1)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    let idx = 0
    const step = () => {
      setRippleIndex(idx)
      idx++
      if (idx < arrayLength) {
        rafRef.current = requestAnimationFrame(step)
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isFinished, arrayLength])

  return rippleIndex
}

export function SortVisualizer() {
  const [mode, setMode] = useState<'single' | 'race'>('single')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>('bubble')
  const [selectedRaceAlgorithms, setSelectedRaceAlgorithms] = useState<AlgorithmKey[]>(['bubble', 'quick', 'merge'])
  const [arraySize, setArraySize] = useState(50)
  const [baseArray, setBaseArray] = useState<number[]>(() => randomArray(50))
  const [stepMode, setStepMode] = useState(false)
  const [elapsedStart, setElapsedStart] = useState<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pre-compute steps for single mode
  const steps = useMemo(
    () => GENERATORS[selectedAlgorithm](baseArray),
    [selectedAlgorithm, baseArray]
  )

  const player = useAnimationPlayer(steps)

  // Race mode
  const raceInputs = useMemo(
    () => selectedRaceAlgorithms.map((key) => ({ key, steps: GENERATORS[key](baseArray) })),
    [selectedRaceAlgorithms, baseArray]
  )
  const race = useRace(raceInputs)

  // Ripple effect
  const singleRipple = useRipple(player.isFinished, baseArray.length)
  const [raceRipples, setRaceRipples] = useState<Record<string, number>>({})
  const raceRippleRefs = useRef<Record<string, number>>({})

  // Track race ripples per player
  useEffect(() => {
    race.players.forEach((p) => {
      if (p.isFinished && raceRippleRefs.current[p.key] === undefined) {
        raceRippleRefs.current[p.key] = -1
        let idx = 0
        const step = () => {
          raceRippleRefs.current[p.key] = idx
          setRaceRipples((prev) => ({ ...prev, [p.key]: idx }))
          idx++
          if (idx < baseArray.length) {
            requestAnimationFrame(step)
          }
        }
        requestAnimationFrame(step)
      }
    })
  }, [race.players, baseArray.length])

  // Elapsed timer (single mode)
  useEffect(() => {
    if (player.isPlaying) {
      if (!elapsedStart) setElapsedStart(Date.now())
      elapsedRef.current = setInterval(() => {
        setElapsedMs(Date.now() - (elapsedStart ?? Date.now()))
      }, 100)
    } else {
      if (elapsedRef.current) clearInterval(elapsedRef.current)
    }
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current)
    }
  }, [player.isPlaying, elapsedStart])

  // Build sorted indices set for single mode
  const sortedIndices = useMemo(() => {
    const set = new Set<number>()
    for (let i = 0; i <= player.currentStep; i++) {
      const s = steps[i]
      if (s?.type === 'SORTED') s.indices.forEach((idx) => set.add(idx))
    }
    return set
  }, [steps, player.currentStep])

  // Stat counters for single mode
  const { comparisons, swaps, overwrites } = useMemo(() => {
    let comparisons = 0, swaps = 0, overwrites = 0
    for (let i = 0; i <= player.currentStep; i++) {
      const s = steps[i]
      if (!s) continue
      if (s.type === 'COMPARE') comparisons++
      if (s.type === 'SWAP') swaps++
      if (s.type === 'OVERWRITE') overwrites++
    }
    return { comparisons, swaps, overwrites }
  }, [steps, player.currentStep])

  const handleRandomize = useCallback(() => {
    const arr = randomArray(arraySize)
    setBaseArray(arr)
    player.reset()
    race.reset()
    setElapsedStart(null)
    setElapsedMs(0)
    raceRippleRefs.current = {}
    setRaceRipples({})
  }, [arraySize, player, race])

  const handleCustomInput = useCallback((arr: number[]) => {
    setBaseArray(arr)
    setArraySize(arr.length)
    player.reset()
    race.reset()
    setElapsedStart(null)
    setElapsedMs(0)
    raceRippleRefs.current = {}
    setRaceRipples({})
  }, [player, race])

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size)
    const arr = randomArray(size)
    setBaseArray(arr)
    player.reset()
    race.reset()
    setElapsedStart(null)
    setElapsedMs(0)
    raceRippleRefs.current = {}
    setRaceRipples({})
  }, [player, race])

  const handleAlgorithmChange = useCallback((key: AlgorithmKey) => {
    setSelectedAlgorithm(key)
    player.reset()
    setElapsedStart(null)
    setElapsedMs(0)
  }, [player])

  const handleModeChange = useCallback((m: 'single' | 'race') => {
    setMode(m)
    player.reset()
    race.reset()
    setElapsedStart(null)
    setElapsedMs(0)
    raceRippleRefs.current = {}
    setRaceRipples({})
  }, [player, race])

  const handlePlay = useCallback(() => {
    if (mode === 'single') {
      setElapsedStart(Date.now())
      player.play()
    } else {
      race.play()
    }
  }, [mode, player, race])

  const handlePause = useCallback(() => {
    if (mode === 'single') player.pause()
    else race.pause()
  }, [mode, player, race])

  const handleReset = useCallback(() => {
    player.reset()
    race.reset()
    setElapsedStart(null)
    setElapsedMs(0)
    raceRippleRefs.current = {}
    setRaceRipples({})
  }, [player, race])

  const handleSpeedChange = useCallback((speed: number) => {
    player.setSpeed(speed)
    race.setSpeed(speed)
  }, [player, race])

  const isPlaying = mode === 'single' ? player.isPlaying : race.isPlaying
  const isFinished = mode === 'single' ? player.isFinished : race.players.every((p) => p.isFinished)

  const currentDisplayArray = player.currentStepData?.array ?? baseArray

  return (
    <div className="flex flex-col h-screen p-4 gap-4 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white tracking-tight">Sorting Visualizer</h1>
        <span className="text-gray-600 text-sm">— visualize &amp; compare classic sorting algorithms</span>
      </div>

      {/* Controls */}
      <ControlPanel
        mode={mode}
        onModeChange={handleModeChange}
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={handleAlgorithmChange}
        selectedRaceAlgorithms={selectedRaceAlgorithms}
        onRaceAlgorithmsChange={setSelectedRaceAlgorithms}
        arraySize={arraySize}
        onArraySizeChange={handleArraySizeChange}
        onRandomize={handleRandomize}
        onCustomInput={handleCustomInput}
        isPlaying={isPlaying}
        isFinished={isFinished}
        stepMode={stepMode}
        onStepModeToggle={() => setStepMode((v) => !v)}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onNextStep={player.nextStep}
        onPrevStep={player.prevStep}
        speed={player.speed}
        onSpeedChange={handleSpeedChange}
      />

      {/* Main Visualization Area */}
      <div className="flex-1 min-h-0">
        {mode === 'single' ? (
          <div className="flex flex-col h-full gap-3">
            {/* Bar Chart */}
            <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 min-h-0">
              <BarChart
                array={currentDisplayArray}
                currentStep={player.currentStepData}
                sortedIndices={sortedIndices}
                isFinished={player.isFinished}
                rippleIndex={singleRipple}
              />
            </div>

            {/* Step Description */}
            {stepMode && (
              <StepDescription
                description={player.currentStepData?.description ?? ''}
                currentStep={player.currentStep}
                totalSteps={player.totalSteps}
              />
            )}

            {/* Algorithm Info */}
            <AlgorithmInfo
              algorithmKey={selectedAlgorithm}
              comparisons={comparisons}
              swaps={swaps}
              overwrites={overwrites}
              elapsedMs={elapsedMs}
              currentStep={player.currentStep}
              totalSteps={player.totalSteps}
            />
          </div>
        ) : (
          <RaceMode
            players={race.players}
            winnerId={race.winnerId}
            startTime={race.startTime}
            rippleIndices={raceRipples as Record<AlgorithmKey, number>}
          />
        )}
      </div>
    </div>
  )
}
