import { usePool } from './usePool'
import { useMemo, useState, useEffect } from 'react'
import {
  getToken,
  getPositionUniswapAddress,
  formatCurrencyAmount,
  getRatio
} from '../service/function'
import { getPositions } from '../service/web3'

import { BigNumber } from 'ethers'
import { usePosition } from './usePosition'
import { usePriceOrderingFromPositionForUI } from './usePriceOrderingFromPositionForUI'
import { useInverter } from './useInverter'
import { useSlot0 } from './useSlot0'
import { useV3PositionFees } from './useV3PositionFees'
import { useGetRatioUSDC } from './useGetRatioUSDC'

export const useFullPosition = (idPool, chainId, listAllTokenSupport, web3) => {
  const [isNoData, setIsNoData] = useState(true)
  const [tokenPre, setTokenPre] = useState(null)
  const [tokenSub, setTokenSub] = useState(null)
  const [positionBasic, setPositionBasic] = useState(null)
  const [ratioLiquidity, setRatioLiquidity] = useState(-1)
  const [isChangeToken, setIsChangeToken] = useState(false)
  const [loading, setLoading] = useState(true)

  const slot0 = useSlot0(
    tokenPre,
    tokenSub,
    positionBasic,
    chainId,
    web3,
    isChangeToken
  )
  const { poolHook, priceTokenPair } = usePool(
    tokenPre,
    tokenSub,
    slot0,
    positionBasic,
    isChangeToken
  )
  const { position } = usePosition(poolHook, positionBasic)
  const pricesFromPositionHook = usePriceOrderingFromPositionForUI(position)
  const [feeValue0, feeValue1] = useV3PositionFees(
    poolHook,
    idPool,
    web3,
    chainId
  )
  const { priceLower, priceUpper, base, quote } = useInverter(
    pricesFromPositionHook,
    false
  )

  useEffect(() => {
    const getDataBasic = async () => {
      Promise.all([
        setTokenPre(null),
        setTokenSub(null),
        setPositionBasic(null),
        setRatioLiquidity(-1)
      ])
      getPositions(getPositionUniswapAddress(chainId), idPool, web3).then(
        async (pos) => {
          if (pos.liquidity) {
            Promise.all([setIsChangeToken(true)]).then(async () => {
              Promise.all([
                setTokenPre(
                  await getToken(pos.token0, chainId, listAllTokenSupport)
                ),
                setTokenSub(
                  await getToken(pos.token1, chainId, listAllTokenSupport)
                )
              ]).then(() => {
                setIsChangeToken(false)
                setPositionBasic({
                  ...pos,
                  fee: Number(pos.fee),
                  liquidity: BigNumber.from(pos.liquidity),
                  tickLower: Number(pos.tickLower),
                  tickUpper: Number(pos.tickUpper)
                })
                setIsNoData(false)
              })
            })
          } else {
            console.log({ pos })
            setIsNoData(true)
            setLoading(false)
          }
        }
      )
    }
    if (listAllTokenSupport && chainId && web3 && idPool) {
      Promise.all([setLoading(true)]).then(() => {
        getDataBasic()
      })
    }
  }, [chainId, listAllTokenSupport, web3, idPool])

  const unClaimFee = useMemo(() => {
    if (tokenPre && tokenSub && feeValue0 && feeValue1) {
      const a = formatCurrencyAmount(feeValue0, 4).toString().includes('<')
        ? 0
        : formatCurrencyAmount(feeValue0, 4)
      const b = formatCurrencyAmount(feeValue1, 4).toString().includes('<')
        ? 0
        : formatCurrencyAmount(feeValue1, 4)
      let sum = 0
      if (typeof a === 'number' && typeof b === 'number') {
        sum = Number((a + b)?.toFixed(2))
      }
      return {
        sum,
        unClaimFeePre: formatCurrencyAmount(feeValue0, 4),
        unClaimFeeSub: formatCurrencyAmount(feeValue1, 4)
      }
    }
    return null
  }, [tokenPre, tokenSub, feeValue0, feeValue1])

  useEffect(() => {
    if (position && poolHook && tokenPre && base) {
      const inverted = tokenSub ? base?.equals(tokenSub) : undefined
      const ratio = getRatio(
        inverted ? priceLower : priceUpper.invert(),
        poolHook.token0Price,
        inverted ? priceUpper : priceLower.invert()
      )
      if (ratioLiquidity >= -1 && Number(ratio) >= 0) {
        setRatioLiquidity(Number(ratio))
      }
    }
  }, [tokenSub, tokenPre, position, poolHook, base, priceLower, priceUpper])
  const inRange = useMemo(() => {
    if (position && poolHook) {
      const below =
        poolHook && Number(poolHook.tickCurrent) < Number(position?.tickLower)
      const above =
        poolHook && typeof positionBasic.tickUpper === 'number'
          ? Number(poolHook.tickCurrent) >= Number(position?.tickUpper)
          : undefined
      const inRanges = !below && !above
      return inRanges
    }
    return null
  }, [poolHook, position, positionBasic])
  const symbol = useMemo(() => {
    if (tokenPre && tokenSub) {
      return {
        symbolPre: tokenPre?.symbol,
        symbolSub: tokenSub?.symbol
      }
    }
  }, [tokenPre, tokenSub])

  const liquidity = useMemo(() => {
    if (position && ratioLiquidity >= -1) {
      let ratioPre = ratioLiquidity
      let ratioSub = 100 - ratioLiquidity
      if (
        Number(position?.amount0.toSignificant(4) ?? 0) === 0 &&
        Number(position?.amount1.toSignificant(4) ?? 0) === 0
      ) {
        ratioSub = 0
        ratioPre = 0
      }
      return {
        liquidityPre: position?.amount0.toSignificant(4),
        ratioPre,
        liquiditySub: position?.amount1.toSignificant(4),
        ratioSub
      }
    }
    return null
  }, [position, ratioLiquidity])
  const ratioUSDC = useGetRatioUSDC(tokenPre, tokenSub, liquidity, position)

  useEffect(() => {
    if (liquidity && unClaimFee && ratioUSDC) {
      setLoading(false)
    }
  }, [liquidity, unClaimFee, ratioUSDC])
  return {
    symbol,
    priceLower,
    priceUpper,
    base,
    quote,
    liquidity,
    unClaimFee,
    position,
    poolHook,
    tokenPre,
    tokenSub,
    positionBasic,
    inRange: inRange?.valueOf(),
    loading,
    priceTokenPair,
    isNoData,
    idPool,
    ratioUSDC,
    chainId
  }
}
