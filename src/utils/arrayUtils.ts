export function randomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

export function validateCustomInput(input: string): number[] | null {
  const parts = input.split(',').map((s) => s.trim()).filter((s) => s !== '')
  if (parts.length === 0) return null
  const nums = parts.map(Number)
  if (nums.some(isNaN)) return null
  return nums
}

export function normalizeValues(arr: number[]): number[] {
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  if (min === max) return arr.map(() => 50)
  return arr.map((v) => Math.round(((v - min) / (max - min)) * 95 + 5))
}
