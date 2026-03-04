import { AlgorithmKey, ALGORITHM_META } from '../types/sorting'

interface AlgorithmInfoProps {
  algorithmKey: AlgorithmKey
  comparisons: number
  swaps: number
  overwrites: number
  elapsedMs: number
  currentStep: number
  totalSteps: number
  compact?: boolean
}

export function AlgorithmInfo({
  algorithmKey,
  comparisons,
  swaps,
  overwrites,
  elapsedMs,
  currentStep,
  totalSteps,
  compact = false,
}: AlgorithmInfoProps) {
  const meta = ALGORITHM_META[algorithmKey]
  const elapsed = (elapsedMs / 1000).toFixed(1)

  if (compact) {
    return (
      <div className="text-xs text-gray-400 space-y-0.5">
        <div className="flex gap-3">
          <span>Cmp: <span className="text-yellow-400 font-mono">{comparisons}</span></span>
          <span>Swp: <span className="text-red-400 font-mono">{swaps}</span></span>
          <span>Acc: <span className="text-sky-400 font-mono">{overwrites}</span></span>
        </div>
        <div className="text-gray-500">
          {elapsedMs > 0 ? `Done: ${elapsed}s` : `Step: ${Math.max(0, currentStep + 1)}/${totalSteps}`}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white">{meta.name}</h2>
          <p className="text-gray-400 text-sm mt-0.5">{meta.description}</p>
        </div>
        <div className="flex gap-4 text-sm flex-wrap">
          <div className="text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Best</div>
            <div className="font-mono text-emerald-400">{meta.timeComplexity.best}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Avg</div>
            <div className="font-mono text-yellow-400">{meta.timeComplexity.average}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Worst</div>
            <div className="font-mono text-red-400">{meta.timeComplexity.worst}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Space</div>
            <div className="font-mono text-sky-400">{meta.spaceComplexity}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Stable</div>
            <div className={`font-bold ${meta.stable ? 'text-emerald-400' : 'text-red-400'}`}>
              {meta.stable ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800 flex gap-6 text-sm flex-wrap">
        <div>
          <span className="text-gray-500">Comparisons: </span>
          <span className="font-mono text-yellow-400">{comparisons}</span>
        </div>
        <div>
          <span className="text-gray-500">Swaps: </span>
          <span className="font-mono text-red-400">{swaps}</span>
        </div>
        <div>
          <span className="text-gray-500">Array Accesses: </span>
          <span className="font-mono text-sky-400">{overwrites}</span>
        </div>
        <div>
          <span className="text-gray-500">Time: </span>
          <span className="font-mono text-gray-300">{elapsed}s</span>
        </div>
        <div>
          <span className="text-gray-500">Step: </span>
          <span className="font-mono text-gray-300">{Math.max(0, currentStep + 1)}/{totalSteps}</span>
        </div>
      </div>
    </div>
  )
}
