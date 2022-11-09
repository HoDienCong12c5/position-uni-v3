import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
export const useGetRatioUSDC = (token0, token1, liquidity, position) => {
  const [isGetting, setIsGetting] = useState(true)
  const [priceAll, setPriceAll] = useState({})
  useEffect(() => {
    setIsGetting(true)
    setPriceAll({})
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
      Promise.all([getPriceTokenPre(), getPriceTokenSub()]).then((rs) => {
        const ob = {
          price1: rs[0]?.data[0].current_price,
          price2: rs[1]?.data[0].current_price
        }
        setPriceAll(ob)
      })
    }
  }, [liquidity])
  const liquidityByUSDC = useMemo(() => {
    if (priceAll && position) {
      const pricePre = priceAll.price1 * position?.amount0.toSignificant(4)
      const priceSub = priceAll.price2 * position?.amount1.toSignificant(4)
      setIsGetting(false)
      return (pricePre + priceSub).toFixed(2)
    }
    return null
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
