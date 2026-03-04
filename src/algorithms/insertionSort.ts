import { AnimationStep } from '../types/sorting'

export function generateSteps(input: number[]): AnimationStep[] {
  const arr = [...input]
  const steps: AnimationStep[] = []
  const n = arr.length

  steps.push({
    type: 'SORTED',
    indices: [0],
    array: [...arr],
    description: `Index 0 (value: ${arr[0]}) is trivially sorted`,
  })

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    steps.push({
      type: 'OVERWRITE',
      indices: [i],
      array: [...arr],
      description: `Picking key element at index ${i} (value: ${key}) to insert`,
      metadata: { selected: i },
    })

    let j = i - 1
    while (j >= 0) {
      steps.push({
        type: 'COMPARE',
        indices: [j, j + 1],
        array: [...arr],
        description: `Comparing index ${j} (value: ${arr[j]}) with key (value: ${key})`,
        metadata: { selected: j + 1 },
      })
      if (arr[j] > key) {
        arr[j + 1] = arr[j]
        steps.push({
          type: 'OVERWRITE',
          indices: [j + 1],
          array: [...arr],
          description: `Shifting index ${j} (value: ${arr[j + 1]}) right to index ${j + 1}`,
          metadata: { selected: j },
        })
        j--
      } else {
        break
      }
    }
    arr[j + 1] = key
    steps.push({
      type: 'OVERWRITE',
      indices: [j + 1],
      array: [...arr],
      description: `Inserting key (value: ${key}) at index ${j + 1}`,
    })
    steps.push({
      type: 'SORTED',
      indices: Array.from({ length: i + 1 }, (_, k) => k),
      array: [...arr],
      description: `Indices 0–${i} are now sorted`,
    })
  }

  return steps
}
