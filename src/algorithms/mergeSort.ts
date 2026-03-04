import { AnimationStep } from '../types/sorting'

export function generateSteps(input: number[]): AnimationStep[] {
  const arr = [...input]
  const steps: AnimationStep[] = []
  mergeSort(arr, 0, arr.length - 1, steps)
  return steps
}

function mergeSort(arr: number[], left: number, right: number, steps: AnimationStep[]): void {
  if (left >= right) return
  const mid = Math.floor((left + right) / 2)

  steps.push({
    type: 'SUBARRAY',
    indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
    array: [...arr],
    description: `Dividing subarray [${left}..${right}] at midpoint ${mid}`,
    metadata: { left, mid, right },
  })

  mergeSort(arr, left, mid, steps)
  mergeSort(arr, mid + 1, right, steps)
  merge(arr, left, mid, right, steps)
}

function merge(arr: number[], left: number, mid: number, right: number, steps: AnimationStep[]): void {
  const leftArr = arr.slice(left, mid + 1)
  const rightArr = arr.slice(mid + 1, right + 1)

  steps.push({
    type: 'SUBARRAY',
    indices: [
      ...Array.from({ length: mid - left + 1 }, (_, i) => left + i),
      ...Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
    ],
    array: [...arr],
    description: `Merging left [${left}..${mid}] and right [${mid + 1}..${right}]`,
    metadata: { left, mid, right, leftBound: mid, rightBound: right },
  })

  let i = 0, j = 0, k = left

  while (i < leftArr.length && j < rightArr.length) {
    const li = left + i
    const rj = mid + 1 + j

    steps.push({
      type: 'COMPARE',
      indices: [li, rj],
      array: [...arr],
      description: `Comparing left[${i}] (value: ${leftArr[i]}) and right[${j}] (value: ${rightArr[j]})`,
      metadata: { left, mid, right },
    })

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i]
      i++
    } else {
      arr[k] = rightArr[j]
      j++
    }

    steps.push({
      type: 'OVERWRITE',
      indices: [k],
      array: [...arr],
      description: `Writing value ${arr[k]} to index ${k}`,
      metadata: { left, mid, right },
    })
    k++
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i]
    steps.push({
      type: 'OVERWRITE',
      indices: [k],
      array: [...arr],
      description: `Copying remaining left value ${arr[k]} to index ${k}`,
      metadata: { left, mid, right },
    })
    i++; k++
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j]
    steps.push({
      type: 'OVERWRITE',
      indices: [k],
      array: [...arr],
      description: `Copying remaining right value ${arr[k]} to index ${k}`,
      metadata: { left, mid, right },
    })
    j++; k++
  }

  const sortedIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i)
  steps.push({
    type: 'SORTED',
    indices: sortedIndices,
    array: [...arr],
    description: `Merged subarray [${left}..${right}] is now sorted`,
    metadata: { left, right },
  })
}
