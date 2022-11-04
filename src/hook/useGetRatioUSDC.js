import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
export const useGetRatioUSDC = (token0, token1, liquidity, position) => {
  const [isGetting, setIsGetting] = useState(true)
  const [priceAll, setPriceAll] = useState(0)
  useEffect(() => {
    if (token0 && token1 && liquidity?.liquidityPre && position) {
      const symbol1 = token0.symbol
      const symbol2 = token1.symbol
      const getPriceTokenPre = async () => {
        return await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${symbol1.toLowerCase()}`
        )
      }
      const getPriceTokenSub = async () => {
        return await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${symbol2.toLowerCase()}`
        )
      }
      setPriceAll([
        {
          price1: getPriceTokenPre().data[0].current_price,
          price2: getPriceTokenSub().data[0].current_price
        }
      ])
    } else {
      setIsGetting(false)
    }
  }, [token0, token1, liquidity, position])
  const liquidityByUSDC = useMemo(() => {
    if (priceAll) {
      const price1 =
        priceAll.price1 * position?.position?.amount0.toSignificant(4)
      const price2 =
        priceAll.price1 * position?.position?.amount1.toSignificant(4)
      setIsGetting(false)
      return (price1 + price2).toFixed(2)
    }
    return -1
  }, [priceAll])

  return {
    liquidityByUSDC,
    isGetting
  }
}

// {price &&
//   fullPosition?.position &&
//   (
//     price.price1 * fullPosition?.position?.amount0.toSignificant(4) +
//     price.price2 * fullPosition?.position?.amount1.toSignificant(4)
//   ).toFixed(2)}</div>
