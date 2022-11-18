import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
export const useGetLiquidityAndPriceWithUSDC = (
  token0,
  token1,
  liquidity,
  position
) => {
  const [isGetting, setIsGetting] = useState(true)
  const [priceAll, setPriceAll] = useState({})
  useEffect(() => {
    !isGetting && setIsGetting(true)
    // @ts-ignore
    priceAll !== {} && setPriceAll({})
    const getPricePairToken = async (symbol1, symbol2) => {
      const priceTokenPre = axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${symbol1.toLowerCase()}`
      )
      const priceTokenSub = axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${symbol2.toLowerCase()}`
      )

      const [price1, price2] = await Promise.all([priceTokenPre, priceTokenSub])
      const ob = {
        price1: price1?.data[0].current_price,
        price2: price2?.data[0].current_price
      }
      setPriceAll(ob)
    }
    if (token0 && token1 && liquidity?.liquidityPre && position) {
      getPricePairToken(token0.symbol, token1.symbol)
    }
  }, [liquidity])
  const dataWithUSDC = useMemo(() => {
    if (priceAll && priceAll !== {} && position) {
      const pricePre = priceAll?.price1 * position?.amount0.toSignificant(4)
      const priceSub = priceAll?.price2 * position?.amount1.toSignificant(4)
      setIsGetting(false)
      return {
        totalLiquidity: pricePre + priceSub,
        priceTokenPre: priceAll?.price1,
        priceTokenSub: priceAll?.price2
      }
    }
    return null
  }, [priceAll])

  return {
    dataWithUSDC,
    isGetting
  }
}
