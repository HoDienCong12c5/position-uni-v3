import { Pool } from '@uniswap/v3-sdk'
import { useMemo } from 'react'

export const usePool = (
  token0,
  token1,
  slot0,
  positionBasic,
  isChangeToken
) => {
  const poolHook = useMemo(() => {
    if (token0 && token1 && positionBasic && slot0 && !isChangeToken) {
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
  }, [token0, token1, slot0, positionBasic, isChangeToken])

  return {
    poolHook,
    priceTokenPair: poolHook?.token1Price.toSignificant(6)
  }
}
