import {
  DAI,
  USDT,
  USDC_MAINNET,
  WRAPPED_NATIVE_CURRENCY,
  WBTC
} from '../constants/tokens'
import { useMemo } from 'react'

export const usePriceOrderingFromPositionForUI = (position) => {
  const price = useMemo(() => {
    if (!position) {
      return null
    } else {
      const token0 = position.amount0.currency
      const token1 = position.amount1.currency

      // if token0 is a dollar-stable asset, set it as the quote token
      const stables = [DAI, USDC_MAINNET, USDT]
      if (stables.some((stable) => stable.equals(token0))) {
        // console.log('token0', token0)
        // console.log('=stables coin======')
        return {
          priceLower: position.token0PriceUpper.invert(),
          priceUpper: position.token0PriceLower.invert(),
          quote: token0,
          base: token1
        }
      } else {
        const bases = [...Object.values(WRAPPED_NATIVE_CURRENCY), WBTC]
        if (bases.some((base) => base && base.equals(token1))) {
          return {
            priceLower: position.token0PriceUpper.invert(),
            priceUpper: position.token0PriceLower.invert(),
            quote: token0,
            base: token1
          }
        } else {
          if (position.token0PriceUpper.lessThan(1)) {
            return {
              priceLower: position.token0PriceUpper.invert(),
              priceUpper: position.token0PriceLower.invert(),
              quote: token0,
              base: token1
            }
          } else {
            // otherwise, just return the default
            return {
              priceLower: position.token0PriceLower,
              priceUpper: position.token0PriceUpper,
              quote: token1,
              base: token0
            }
          }
        }
      }
    }
  }, [position])
  return price

  // if both prices are below 1, invert
}
