import { useMemo } from 'react'
import { AlgorithmKey, ALGORITHM_META, AnimationStep } from '../types/sorting'
import { BarChart } from './BarChart'
import { AlgorithmInfo } from './AlgorithmInfo'

interface RacePanelProps {
  algorithmKey: AlgorithmKey
  steps: AnimationStep[]
  currentStep: number
  isFinished: boolean
  isWinner: boolean
  finishedAt: number | null
  startTime: number | null
  comparisons: number
  swaps: number
  overwrites: number
  rippleIndex: number
}

function RacePanel({
  algorithmKey,
  steps,
  currentStep,
  isFinished,
  isWinner,
  finishedAt,
  startTime,
  comparisons,
  swaps,
  overwrites,
  rippleIndex,
}: RacePanelProps) {
  const meta = ALGORITHM_META[algorithmKey]

  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null
  const array = currentStepData?.array ?? (steps[0]?.array ?? [])

  const sortedIndices = useMemo(() => {
    const set = new Set<number>()
    for (let i = 0; i <= currentStep; i++) {
      const s = steps[i]
      if (s?.type === 'SORTED') s.indices.forEach((idx) => set.add(idx))
    }
    return set
  }, [steps, currentStep])

  const elapsed = finishedAt && startTime ? finishedAt - startTime : Date.now() - (startTime ?? Date.now())

  return (
    <div
      className={`flex flex-col bg-gray-900 rounded-xl border overflow-hidden transition-all ${
        isWinner ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-gray-800'
      }`}
    >
      {/* Header */}
      <div className={`px-3 py-2 flex items-center justify-between ${isWinner ? 'bg-yellow-500/10' : 'bg-gray-800/50'}`}>
        <span className="font-semibold text-white text-sm">{meta.name}</span>
        {isWinner && <span className="text-lg">🏆 Winner</span>}
        {isFinished && !isWinner && <span className="text-emerald-400 text-xs font-medium">Done</span>}
      </div>

      {/* Bar Chart */}
      <div className="flex-1 p-2" style={{ height: '200px' }}>
        <BarChart
          array={array}
          currentStep={currentStepData}
          sortedIndices={sortedIndices}
          isFinished={isFinished}
          rippleIndex={rippleIndex}
        />
      </div>

      {/* Stats */}
      <div className="px-3 pb-3">
        <AlgorithmInfo
          algorithmKey={algorithmKey}
          comparisons={comparisons}
          swaps={swaps}
          overwrites={overwrites}
          elapsedMs={isFinished ? elapsed : 0}
          currentStep={currentStep}
          totalSteps={steps.length}
          compact
        />
      </div>
    </div>
  )
}

interface RaceModeProps {
  players: {
    key: AlgorithmKey
    steps: AnimationStep[]
    currentStep: number
    isFinished: boolean
    finishedAt: number | null
    comparisons: number
    swaps: number
    overwrites: number
  }[]
  winnerId: AlgorithmKey | null
  startTime: number | null
  rippleIndices: Record<AlgorithmKey, number>
}

export function RaceMode({ players, winnerId, startTime, rippleIndices }: RaceModeProps) {
  const cols =
    players.length <= 2 ? 'grid-cols-2' :
    players.length === 3 ? 'grid-cols-3' :
    'grid-cols-2 md:grid-cols-4'

  return (
    <div className={`grid ${cols} gap-4 h-full`}>
      {players.map((p) => (
        <RacePanel
          key={p.key}
          algorithmKey={p.key}
          steps={p.steps}
          currentStep={p.currentStep}
          isFinished={p.isFinished}
          isWinner={winnerId === p.key}
          finishedAt={p.finishedAt}
          startTime={startTime}
          comparisons={p.comparisons}
          swaps={p.swaps}
          overwrites={p.overwrites}
          rippleIndex={rippleIndices[p.key] ?? -1}
        />
      ))}
    </div>
  )
}
