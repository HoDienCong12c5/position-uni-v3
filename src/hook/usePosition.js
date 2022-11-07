import { Position } from '@uniswap/v3-sdk'
import { useMemo } from 'react'

export const usePosition = (
  pool,
  positionBasic
) => {
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
