export type StepType =
  | 'COMPARE'
  | 'SWAP'
  | 'OVERWRITE'
  | 'PIVOT'
  | 'SORTED'
  | 'SUBARRAY'

export interface AnimationStep {
  type: StepType
  indices: number[]
  array: number[]
  description: string
  metadata?: Record<string, unknown>
}

export type AlgorithmKey =
  | 'bubble'
  | 'insertion'
  | 'selection'
  | 'merge'
  | 'quick'
  | 'heap'

export interface AlgorithmMeta {
  key: AlgorithmKey
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  stable: boolean
}

export const ALGORITHM_META: Record<AlgorithmKey, AlgorithmMeta> = {
  bubble: {
    key: 'bubble',
    name: 'Bubble Sort',
    description: 'Repeatedly swaps adjacent elements that are out of order, bubbling the largest to the end each pass.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
  },
  insertion: {
    key: 'insertion',
    name: 'Insertion Sort',
    description: 'Builds a sorted portion one element at a time by inserting each new element into its correct position.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
  },
  selection: {
    key: 'selection',
    name: 'Selection Sort',
    description: 'Finds the minimum element in the unsorted portion and swaps it to the front each pass.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
  },
  merge: {
    key: 'merge',
    name: 'Merge Sort',
    description: 'Divides the array in half recursively, then merges sorted halves — classic divide and conquer.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
  },
  quick: {
    key: 'quick',
    name: 'Quick Sort',
    description: 'Picks a pivot, partitions elements around it, and recursively sorts each partition.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
  },
  heap: {
    key: 'heap',
    name: 'Heap Sort',
    description: 'Builds a max-heap from the array, then repeatedly extracts the maximum to sort in place.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
  },
}

export interface BarState {
  value: number
  color: BarColor
}

export type BarColor =
  | 'default'
  | 'compare'
  | 'swap'
  | 'pivot'
  | 'sorted'
  | 'selected'
  | 'left'
  | 'right'
