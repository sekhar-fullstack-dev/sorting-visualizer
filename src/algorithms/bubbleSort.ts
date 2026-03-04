import { AnimationStep } from '../types/sorting'

export function generateSteps(input: number[]): AnimationStep[] {
  const arr = [...input]
  const steps: AnimationStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'COMPARE',
        indices: [j, j + 1],
        array: [...arr],
        description: `Comparing index ${j} (value: ${arr[j]}) and index ${j + 1} (value: ${arr[j + 1]})`,
      })
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
        steps.push({
          type: 'SWAP',
          indices: [j, j + 1],
          array: [...arr],
          description: `Swapping index ${j} (value: ${arr[j]}) and index ${j + 1} (value: ${arr[j + 1]})`,
        })
      }
    }
    steps.push({
      type: 'SORTED',
      indices: [n - i - 1],
      array: [...arr],
      description: `Index ${n - i - 1} is now in its final sorted position (value: ${arr[n - i - 1]})`,
    })
    if (!swapped) break
  }

  // Mark remaining elements as sorted
  const sortedCount = steps.filter((s) => s.type === 'SORTED').flatMap((s) => s.indices)
  for (let i = 0; i < n; i++) {
    if (!sortedCount.includes(i)) {
      steps.push({
        type: 'SORTED',
        indices: [i],
        array: [...arr],
        description: `Index ${i} is now in its final sorted position (value: ${arr[i]})`,
      })
    }
  }

  return steps
}
