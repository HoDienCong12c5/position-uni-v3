import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/chain'

export const getRatio = (lower, current, upper) => {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    } else if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(20))
    const b = Number.parseFloat(upper.toSignificant(20))
    const c = Number.parseFloat(current.toSignificant(20))
    const ratio = Math.floor(
      (1 /
        ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) *
        100
    )
    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}
export const getPositionUniswapAddress = (chainId) => {
  return NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]
}
