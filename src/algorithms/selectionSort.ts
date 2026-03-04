import { AnimationStep } from '../types/sorting'

export function generateSteps(input: number[]): AnimationStep[] {
  const arr = [...input]
  const steps: AnimationStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({
      type: 'OVERWRITE',
      indices: [minIdx],
      array: [...arr],
      description: `Scanning for minimum starting at index ${i} (current min: ${arr[minIdx]})`,
      metadata: { minIdx },
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'COMPARE',
        indices: [j, minIdx],
        array: [...arr],
        description: `Comparing index ${j} (value: ${arr[j]}) with current min at index ${minIdx} (value: ${arr[minIdx]})`,
        metadata: { minIdx },
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          type: 'OVERWRITE',
          indices: [minIdx],
          array: [...arr],
          description: `New minimum found at index ${minIdx} (value: ${arr[minIdx]})`,
          metadata: { minIdx },
        })
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      steps.push({
        type: 'SWAP',
        indices: [i, minIdx],
        array: [...arr],
        description: `Swapping index ${i} (value: ${arr[i]}) and index ${minIdx} (value: ${arr[minIdx]})`,
      })
    }

    steps.push({
      type: 'SORTED',
      indices: [i],
      array: [...arr],
      description: `Index ${i} is now in its final sorted position (value: ${arr[i]})`,
    })
  }

  steps.push({
    type: 'SORTED',
    indices: [n - 1],
    array: [...arr],
    description: `Index ${n - 1} is the last element and is sorted (value: ${arr[n - 1]})`,
  })

  return steps
}
