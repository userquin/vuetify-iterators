export interface Row {
  id: number
  text: string
  filtered?: boolean
}

export type Mode =  1 | 2 | 3

export /*async */function* newArray(list: Row[], mode: Mode) {
  const f = filter(mode)
  for (const item of list) {
    // await new Promise((r) => setTimeout(r, 0))
    item.filtered = !f(item)
    yield item
  }
}

export function filter(mode: Mode) {
  return (item: Row) => {
    return mode === 1
      ? true
      : mode == 2
        ? item.id % 2 !== 0
        : item.id % 2 === 0
  }
}
