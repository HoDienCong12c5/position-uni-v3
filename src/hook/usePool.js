import { useMemo } from 'react'
const uni = require('@uniswap/v3-sdk')
const { Pool } = uni
export const usePool = (token0, token1, slot0, positionBasic) => {
  const poolHook = useMemo(() => {
    if (token0 && token1 && positionBasic && slot0) {
      return new Pool(
        token0,
        token1,
        positionBasic.fee,
        slot0.sqrtPriceX96,
        positionBasic.liquidity,
        slot0.tick
      )
    }
    return null
  }, [token0, token1, slot0, positionBasic])

  return {
    poolHook,
    priceTokenPair: poolHook?.token1Price.toSignificant(6)
  }
}
