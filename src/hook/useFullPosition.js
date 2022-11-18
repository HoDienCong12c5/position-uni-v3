// import { useFullPosition } from 'position-uni-v3'
import { useEffect, useMemo, useState } from 'react'
import { useListPoolByAddress } from './useGetListPool'
import { useGetLiquidityAndPriceWithUSDC } from './useGetLiquidityAndPriceWithUSDC'
import { useInverter } from './useInverter'
import { usePool } from './usePool'
import { usePosition } from './usePosition'
import { usePositionBasic } from './usePositionBasic'
import { usePriceOrderingFromPositionForUI } from './usePriceOrderingFromPositionForUI'
import { useSlot0 } from './useSlot0'
import { useV3PositionFees } from './useV3PositionFees'
import { formatCurrencyAmount, getRatio } from '../service/function'
export const useFullPosition = (
  address,
  chainId,
  web3,
  listAllTokenSupport,
  listChainSupport
) => {
  const [indexPool, setIndexPool] = useState(0)
  const [listData, setListData] = useState([])
  const [isFinish, setIsFinish] = useState(false)
  const [listPoolState, setListPoolState] = useState([])
  // use hook customs
  const listPoolOfAddress = useListPoolByAddress(
    chainId,
    address,
    web3,
    listChainSupport
  )
  useEffect(() => {
    if (listPoolOfAddress?.listPoolId?.length > 0) {
      console.log({ listPoolOfAddress })
      // @ts-ignore
      setListPoolState([...listPoolState, listPoolOfAddress?.listPoolId])
    }
    if (
      listPoolOfAddress?.listPoolId?.length === 0 &&
      listPoolOfAddress?.noData
    ) {
      nextToPools()
    }
  }, [listPoolOfAddress])
  const positionBasic = usePositionBasic(
    listPoolOfAddress?.listPoolId[indexPool],
    Number(chainId),
    listAllTokenSupport,
    web3
  )
  const slot0 = useSlot0(
    positionBasic?.tokenPre,
    positionBasic?.tokenSub,
    positionBasic?.positionBasic,
    chainId,
    web3,
    positionBasic?.isChangeToken
  )

  const { poolHook } = usePool(
    positionBasic?.tokenPre,
    positionBasic?.tokenSub,
    slot0,
    positionBasic?.positionBasic,
    positionBasic?.isChangeToken
  )
  const { positionSDK } = usePosition(poolHook, positionBasic?.positionBasic)
  const pricesFromPositionHook = usePriceOrderingFromPositionForUI(positionSDK)
  const inverterToken = useInverter(pricesFromPositionHook, false)

  const { feeValue0, feeValue1 } = useV3PositionFees(
    poolHook,
    listPoolOfAddress?.listPoolId[indexPool],
    web3,
    chainId,
    false
  )

  // use memo
  const unClaimFee = useMemo(() => {
    if (
      positionBasic &&
      positionBasic?.tokenPre &&
      positionBasic?.tokenSub &&
      feeValue0 &&
      feeValue1 &&
      !positionBasic?.isNoData
    ) {
      // console.log((positionBasic?.tokenPre))
      // console.log((positionBasic?.tokenSub))
      const tokenPre = formatCurrencyAmount(feeValue0, 4)
        .toString()
        .includes('<')
        ? 0
        : formatCurrencyAmount(feeValue0, 4)
      const tokenSub = formatCurrencyAmount(feeValue1, 4)
        .toString()
        .includes('<')
        ? 0
        : formatCurrencyAmount(feeValue1, 4)
      return {
        unClaimFeePre: tokenPre,
        unClaimFeeSub: tokenSub
      }
    }
    return null
  }, [feeValue0, feeValue1])

  const ratioLiquidity = useMemo(() => {
    if (
      positionSDK &&
      poolHook &&
      positionBasic?.tokenPre &&
      inverterToken?.base
    ) {
      const inverted = positionBasic?.tokenSub
        ? inverterToken?.base?.equals(positionBasic?.tokenSub)
        : undefined
      const ratio = getRatio(
        inverted
          ? inverterToken?.priceLower
          : inverterToken?.priceUpper.invert(),
        poolHook.token0Price,
        inverted
          ? inverterToken?.priceUpper
          : inverterToken?.priceLower.invert()
      )
      return Number(ratio)
    }
    return null
  }, [inverterToken?.base])

  const liquidity = useMemo(() => {
    if (
      positionSDK &&
      ratioLiquidity &&
      ratioLiquidity >= 0 &&
      !positionBasic?.isNoData
    ) {
      let ratioPre = ratioLiquidity
      let ratioSub = 100 - ratioLiquidity
      if (
        Number(positionSDK?.amount0.toSignificant(4) ?? 0) === 0 &&
        Number(positionSDK?.amount1.toSignificant(4) ?? 0) === 0
      ) {
        ratioSub = 0
        ratioPre = 0
      }
      return {
        liquidityPre: positionSDK?.amount0.toSignificant(4),
        ratioPre,
        liquiditySub: positionSDK?.amount1.toSignificant(4),
        ratioSub
      }
    }
    return null
  }, [ratioLiquidity])
  const inRange = useMemo(() => {
    if (positionSDK && poolHook && !positionBasic?.isNoData) {
      // console.log({ poolHook, positionSDK, positionBasic })
      const below =
        poolHook &&
        Number(poolHook.tickCurrent) < Number(positionSDK?.tickLower)
      const above =
        poolHook && typeof positionSDK.tickUpper === 'number'
          ? Number(poolHook.tickCurrent) >= Number(positionSDK?.tickUpper)
          : undefined
      return !below && !above
    }
    return null
  }, [positionSDK])
  // especially
  const liquidityAndPriceWithUSDC = useGetLiquidityAndPriceWithUSDC(
    positionBasic?.tokenPre,
    positionBasic?.tokenSub,
    liquidity,
    positionSDK
  )
  // useEffect

  useEffect(() => {
    if (positionBasic?.isNoData && positionBasic) {
      nextToPools()
    }
  }, [positionBasic])
  useEffect(() => {
    if (!positionBasic?.isNoData && positionBasic) {
      if (
        unClaimFee &&
        ratioLiquidity &&
        ratioLiquidity >= 0 &&
        liquidity &&
        inRange !== null &&
        liquidityAndPriceWithUSDC?.dataWithUSDC
      ) {
        console.log('having final data')

        const unClaimFeeTokenPre =
          Number(unClaimFee?.unClaimFeePre) *
          liquidityAndPriceWithUSDC?.dataWithUSDC?.priceTokenPre

        const unClaimFeeTokenSub =
          Number(unClaimFee?.unClaimFeeSub) *
          liquidityAndPriceWithUSDC?.dataWithUSDC?.priceTokenSub

        const data = {
          liquidity: {
            liquidityPre: liquidity?.liquidityPre,
            liquiditySub: liquidity?.liquiditySub,
            ratioPre: liquidity?.ratioPre,
            ratioSub: liquidity?.ratioSub,
            totalLiquidity:
              liquidityAndPriceWithUSDC?.dataWithUSDC?.totalLiquidity
          },
          unClaimFee: {
            unClaimFeePre: unClaimFee?.unClaimFeePre,
            unClaimFeeSub: unClaimFee?.unClaimFeeSub,
            unClaimFeeSum: unClaimFeeTokenPre + unClaimFeeTokenSub
          },
          poolHook,
          positionBasic,
          positionSDK,
          idPool: listPoolOfAddress?.listPoolId[indexPool],
          chainId,
          inRange,
          symbolPre: positionBasic?.tokenPre?.symbol,
          symbolSub: positionBasic?.tokenSub?.symbol,
          addressUser: address,
          isNotStake: positionBasic?.positionBasic?.liquidity.eq(0)
        }
        Promise.all([setListData((pre) => [...pre, data])]).then(() => {
          nextToPools()
        })
      }
    }
  }, [liquidityAndPriceWithUSDC?.dataWithUSDC, unClaimFee])
  // console.log({ liquidityAndPriceWithUSDC })
  // use time count

  const nextToPools = () => {
    if (indexPool < listPoolOfAddress?.listPoolId.length - 1) {
      setIndexPool(indexPool + 1)
    } else {
      setIsFinish(true)
    }
    if (listPoolOfAddress?.listPoolId.length === 0) {
      setIsFinish(true)
    }
  }
  const resetHook = () => {
    Promise.all([
      setListData([]),
      setListPoolState([]),
      setIndexPool(0),
      setIsFinish(false)
    ])
  }
  return {
    isFinish,
    listData,
    resetHook
  }
}
