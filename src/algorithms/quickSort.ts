import { AnimationStep } from '../types/sorting'

export function generateSteps(input: number[]): AnimationStep[] {
  const arr = [...input]
  const steps: AnimationStep[] = []
  quickSort(arr, 0, arr.length - 1, steps)
  return steps
}

function quickSort(arr: number[], low: number, high: number, steps: AnimationStep[]): void {
  if (low >= high) {
    if (low === high) {
      steps.push({
        type: 'SORTED',
        indices: [low],
        array: [...arr],
        description: `Index ${low} is a single element, trivially sorted (value: ${arr[low]})`,
      })
    }
    return
  }
  const pivotIdx = partition(arr, low, high, steps)
  quickSort(arr, low, pivotIdx - 1, steps)
  quickSort(arr, pivotIdx + 1, high, steps)
}

function partition(arr: number[], low: number, high: number, steps: AnimationStep[]): number {
  const pivot = arr[high]

  steps.push({
    type: 'PIVOT',
    indices: [high],
    array: [...arr],
    description: `Pivot selected: value ${pivot} at index ${high}`,
    metadata: { pivot, low, high },
  })

  let i = low - 1

  for (let j = low; j < high; j++) {
    steps.push({
      type: 'COMPARE',
      indices: [j, high],
      array: [...arr],
      description: `Comparing index ${j} (value: ${arr[j]}) with pivot (value: ${pivot})`,
      metadata: { pivot, low, high },
    })
    if (arr[j] <= pivot) {
      i++
      if (i !== j) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        steps.push({
          type: 'SWAP',
          indices: [i, j],
          array: [...arr],
          description: `Swapping index ${i} (value: ${arr[i]}) and index ${j} (value: ${arr[j]}) — moving smaller element left of pivot`,
          metadata: { pivot, low, high },
        })
      }
    }
  }

  ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
  steps.push({
    type: 'SWAP',
    indices: [i + 1, high],
    array: [...arr],
    description: `Placing pivot (value: ${pivot}) at its final position: index ${i + 1}`,
    metadata: { pivot, low, high },
  })
  steps.push({
    type: 'SORTED',
    indices: [i + 1],
    array: [...arr],
    description: `Pivot (value: ${pivot}) is now in its final sorted position at index ${i + 1}`,
  })

  return i + 1
}
