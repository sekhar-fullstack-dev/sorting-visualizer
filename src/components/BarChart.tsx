import { useMemo } from 'react'
import { AnimationStep, BarColor } from '../types/sorting'

interface BarChartProps {
  array: number[]
  currentStep: AnimationStep | null
  sortedIndices: Set<number>
  isFinished: boolean
  rippleIndex?: number
}

const BAR_COLORS: Record<BarColor, string> = {
  default: 'bg-indigo-500',
  compare: 'bg-yellow-400',
  swap: 'bg-red-500',
  pivot: 'bg-purple-500',
  sorted: 'bg-emerald-500',
  selected: 'bg-cyan-400',
  left: 'bg-sky-400',
  right: 'bg-orange-400',
}

function getBarColor(
  idx: number,
  step: AnimationStep | null,
  sortedIndices: Set<number>,
  rippleIndex: number
): BarColor {
  if (sortedIndices.has(idx) && idx <= rippleIndex) return 'sorted'

  if (!step) return 'default'

  const { type, indices, metadata } = step

  // Merge sort subarray coloring
  if (type === 'SUBARRAY' && metadata) {
    const left = metadata.left as number
    const mid = metadata.leftBound as number ?? metadata.mid as number
    const right = metadata.right as number
    if (indices.includes(idx)) {
      if (idx >= left && idx <= mid) return 'left'
      if (idx > mid && idx <= right) return 'right'
    }
  }

  if (type === 'PIVOT' && indices.includes(idx)) return 'pivot'

  if (type === 'COMPARE') {
    if (indices.includes(idx)) return 'compare'
    // Quick sort pivot remains purple
    if (metadata?.pivot !== undefined) {
      const pivotPos = step.array.lastIndexOf(metadata.pivot as number)
      if (idx === pivotPos) return 'pivot'
    }
  }

  if (type === 'SWAP' && indices.includes(idx)) return 'swap'

  if (type === 'OVERWRITE' && indices.includes(idx)) {
    if (metadata?.selected !== undefined && metadata.selected === idx) return 'selected'
    return 'selected'
  }

  if (sortedIndices.has(idx)) return 'sorted'

  return 'default'
}

export function BarChart({ array, currentStep, sortedIndices, isFinished, rippleIndex = -1 }: BarChartProps) {
  const max = useMemo(() => Math.max(...array, 1), [array])

  return (
    <div className="flex items-end gap-px w-full h-full" aria-label="Sorting bar chart">
      {array.map((value, idx) => {
        const color = isFinished
          ? idx <= rippleIndex ? 'sorted' : 'default'
          : getBarColor(idx, currentStep, sortedIndices, rippleIndex)
        const heightPct = Math.max(2, (value / max) * 100)

        return (
          <div
            key={idx}
            className={`flex-1 rounded-t-sm bar-transition ${BAR_COLORS[color]}`}
            style={{ height: `${heightPct}%` }}
            title={`Index ${idx}: ${value}`}
          />
        )
      })}
    </div>
  )
}
