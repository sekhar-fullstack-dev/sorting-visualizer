import { useState } from 'react'
import { AlgorithmKey, ALGORITHM_META } from '../types/sorting'
import { validateCustomInput } from '../utils/arrayUtils'

const SPEED_PRESETS = [
  { label: 'Slow', value: 600 },
  { label: 'Medium', value: 200 },
  { label: 'Fast', value: 60 },
  { label: 'Blazing', value: 8 },
]

const ALL_ALGORITHMS: AlgorithmKey[] = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'heap']

interface ControlPanelProps {
  // mode
  mode: 'single' | 'race'
  onModeChange: (mode: 'single' | 'race') => void
  // algorithm(s)
  selectedAlgorithm: AlgorithmKey
  onAlgorithmChange: (key: AlgorithmKey) => void
  selectedRaceAlgorithms: AlgorithmKey[]
  onRaceAlgorithmsChange: (keys: AlgorithmKey[]) => void
  // array
  arraySize: number
  onArraySizeChange: (size: number) => void
  onRandomize: () => void
  onCustomInput: (arr: number[]) => void
  // playback
  isPlaying: boolean
  isFinished: boolean
  stepMode: boolean
  onStepModeToggle: () => void
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onNextStep: () => void
  onPrevStep: () => void
  speed: number
  onSpeedChange: (speed: number) => void
}

export function ControlPanel({
  mode, onModeChange,
  selectedAlgorithm, onAlgorithmChange,
  selectedRaceAlgorithms, onRaceAlgorithmsChange,
  arraySize, onArraySizeChange, onRandomize, onCustomInput,
  isPlaying, isFinished, stepMode, onStepModeToggle,
  onPlay, onPause, onReset, onNextStep, onPrevStep,
  speed, onSpeedChange,
}: ControlPanelProps) {
  const [customText, setCustomText] = useState('')
  const [customError, setCustomError] = useState('')

  function handleCustomSubmit() {
    const result = validateCustomInput(customText)
    if (!result) {
      setCustomError('Invalid input. Enter comma-separated numbers.')
      return
    }
    setCustomError('')
    onCustomInput(result)
  }

  function toggleRaceAlgorithm(key: AlgorithmKey) {
    if (selectedRaceAlgorithms.includes(key)) {
      if (selectedRaceAlgorithms.length <= 2) return // minimum 2
      onRaceAlgorithmsChange(selectedRaceAlgorithms.filter((k) => k !== key))
    } else {
      if (selectedRaceAlgorithms.length >= 4) return // maximum 4
      onRaceAlgorithmsChange([...selectedRaceAlgorithms, key])
    }
  }

  const speedLabel = SPEED_PRESETS.reduce((closest, preset) =>
    Math.abs(preset.value - speed) < Math.abs(closest.value - speed) ? preset : closest
  ).label

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm font-medium">Mode:</span>
        <button
          onClick={() => onModeChange('single')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            mode === 'single'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Single
        </button>
        <button
          onClick={() => onModeChange('race')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            mode === 'race'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Race Mode
        </button>
      </div>

      {/* Algorithm Selection */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-400 text-sm font-medium">
          {mode === 'race' ? 'Algorithms (2–4):' : 'Algorithm:'}
        </span>
        {ALL_ALGORITHMS.map((key) => {
          const meta = ALGORITHM_META[key]
          const isSelected = mode === 'race'
            ? selectedRaceAlgorithms.includes(key)
            : selectedAlgorithm === key
          return (
            <button
              key={key}
              onClick={() =>
                mode === 'race' ? toggleRaceAlgorithm(key) : onAlgorithmChange(key)
              }
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {meta.name}
            </button>
          )
        })}
      </div>

      {/* Array Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm whitespace-nowrap">Size: {arraySize}</label>
          <input
            type="range"
            min={10}
            max={150}
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className="w-28 accent-indigo-500"
          />
        </div>
        <button
          onClick={onRandomize}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
        >
          Randomize
        </button>
        <div className="flex gap-1">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            placeholder="5, 3, 8, 1, 9…"
            className="w-36 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleCustomSubmit}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
        {customError && <span className="text-red-400 text-xs">{customError}</span>}
      </div>

      {/* Speed */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm whitespace-nowrap">Speed: <span className="text-white">{speedLabel}</span></span>
        <span className="text-gray-600 text-xs">Slow</span>
        <input
          type="range"
          min={8}
          max={600}
          step={1}
          value={600 - speed + 8}
          onChange={(e) => onSpeedChange(600 - Number(e.target.value) + 8)}
          className="w-32 accent-indigo-500"
        />
        <span className="text-gray-600 text-xs">Blazing</span>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {!stepMode ? (
          <>
            {isPlaying ? (
              <button
                onClick={onPause}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded-lg font-medium transition-colors"
              >
                ⏸ Pause
              </button>
            ) : (
              <button
                onClick={onPlay}
                disabled={isFinished}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
              >
                ▶ Play
              </button>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onPrevStep}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={onNextStep}
              disabled={isFinished}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        <button
          onClick={onReset}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium transition-colors"
        >
          ↺ Reset
        </button>

        {mode === 'single' && (
          <button
            onClick={onStepModeToggle}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
              stepMode
                ? 'bg-indigo-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {stepMode ? 'Step Mode ON' : 'Step Mode'}
          </button>
        )}
      </div>
    </div>
  )
}
