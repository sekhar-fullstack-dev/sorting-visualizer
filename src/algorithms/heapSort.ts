import { AnimationStep } from '../types/sorting'

export function generateSteps(input: number[]): AnimationStep[] {
  const arr = [...input]
  const steps: AnimationStep[] = []
  const n = arr.length

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps, 'Building max-heap')
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    steps.push({
      type: 'SWAP',
      indices: [0, i],
      array: [...arr],
      description: `Extracting max (value: ${arr[i]}) — swapping root with index ${i}`,
      metadata: { heapSize: i },
    })
    steps.push({
      type: 'SORTED',
      indices: [i],
      array: [...arr],
      description: `Index ${i} is now in its final sorted position (value: ${arr[i]})`,
    })
    heapify(arr, i, 0, steps, 'Restoring heap property')
  }

  steps.push({
    type: 'SORTED',
    indices: [0],
    array: [...arr],
    description: `Index 0 is the last remaining element and is sorted (value: ${arr[0]})`,
  })

  return steps
}

function heapify(arr: number[], n: number, i: number, steps: AnimationStep[], phase: string): void {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  if (left < n) {
    steps.push({
      type: 'COMPARE',
      indices: [left, largest],
      array: [...arr],
      description: `${phase}: Comparing left child index ${left} (value: ${arr[left]}) with current largest at index ${largest} (value: ${arr[largest]})`,
      metadata: { heapSize: n },
    })
    if (arr[left] > arr[largest]) largest = left
  }

  if (right < n) {
    steps.push({
      type: 'COMPARE',
      indices: [right, largest],
      array: [...arr],
      description: `${phase}: Comparing right child index ${right} (value: ${arr[right]}) with current largest at index ${largest} (value: ${arr[largest]})`,
      metadata: { heapSize: n },
    })
    if (arr[right] > arr[largest]) largest = right
  }

  if (largest !== i) {
    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
    steps.push({
      type: 'SWAP',
      indices: [i, largest],
      array: [...arr],
      description: `${phase}: Swapping index ${i} (value: ${arr[i]}) and index ${largest} (value: ${arr[largest]}) to maintain heap property`,
      metadata: { heapSize: n },
    })
    heapify(arr, n, largest, steps, phase)
  }
}
