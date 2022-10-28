import { useMemo } from 'react'
const uni = require('@uniswap/v3-sdk')
const { Position } = uni
export const usePosition = (pool, positionBasic) => {
  const position = useMemo(() => {
    if (
      pool &&
      pool &&
      positionBasic.liquidity &&
      typeof positionBasic?.tickLower === 'number' &&
      typeof positionBasic?.tickUpper === 'number'
    ) {
      return new Position({
        pool,
        liquidity: positionBasic?.liquidity,
        tickLower: positionBasic?.tickLower,
        tickUpper: positionBasic?.tickUpper
      })
    }
    return null
  }, [pool, positionBasic])
  return { position }
}
