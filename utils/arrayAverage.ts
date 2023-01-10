export function getArrayAverage(listOfNumbers: number[]) {
  if (listOfNumbers.length === 0) return 0
  if (listOfNumbers.length === 1) return 1

  const sum = listOfNumbers.reduce((t, n) => t + n)
  const average = sum / listOfNumbers.length

  return Number(average.toFixed(1))
}
