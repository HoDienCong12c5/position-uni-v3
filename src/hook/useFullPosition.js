// import { useFullPosition } from 'position-uni-v3'
import { formatCurrencyAmount, getRatio } from '../service/function'
import { useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'
import { useListPoolByAddress } from './useGetListPool'
import { useGetRatioUSDC } from './useGetRatioUSDC'
import { useInverter } from './useInverter'
import { usePool } from './usePool'
import { usePosition } from './usePosition'
import { usePositionBasic } from './usePositionBasic'
import { usePriceOrderingFromPositionForUI } from './usePriceOrderingFromPositionForUI'
import { useSlot0 } from './useSlot0'
import { useV3PositionFees } from './useV3PositionFees'
const SupportedChainId = {
  1: 'https://rpc.ankr.com/eth',
  10: 'https://rpc.ankr.com/optimism',
  137: 'https://rpc.ankr.com/polygon',
  42161: 'https://rpc.ankr.com/arbitrum',
  42220: 'https://rpc.ankr.com/celo'
}
const createWeb3NewBasic = (rpc) => {
  let web3 = new Web3()
  web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  return web3
}

export const useFullPosition = (address, chainId, listAllTokenSupport) => {
  const [indexPool, setIndexPool] = useState(0)
  const [listData, setListData] = useState([])
  const [isFinish, setIsFinish] = useState(false)
  const [listPoolState, setListPoolState] = useState([])
  // use hook customs
  const listPoolOfAddress = useListPoolByAddress(chainId, address)

  useEffect(() => {
    if (listPoolOfAddress?.listPoolId?.length > 0) {
      console.log({ listPoolOfAddress })
      setListPoolState([...listPoolState, listPoolOfAddress?.listPoolId])
    }
    if (
      listPoolOfAddress?.listPoolId?.length === 0 &&
      listPoolOfAddress?.noData
    ) {
      setTimeRadom()
    }
  }, [listPoolOfAddress])
  const positionBasic = usePositionBasic(
    listPoolOfAddress?.listPoolId[indexPool],
    Number(chainId),
    listAllTokenSupport,
    createWeb3NewBasic(SupportedChainId[chainId])
  )
  const slot0 = useSlot0(
    positionBasic?.tokenPre,
    positionBasic?.tokenSub,
    positionBasic?.positionBasic,
    chainId,
    createWeb3NewBasic(SupportedChainId[chainId]),
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
    createWeb3NewBasic(SupportedChainId[chainId]),
    chainId,
    false
  )

  // use memo
  const unClaimFee = useMemo(() => {
    if (
      positionBasic?.tokenPre &&
      positionBasic?.tokenSub &&
      feeValue0 &&
      feeValue1 &&
      !positionBasic?.isNoData
    ) {
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
  }, [feeValue0])

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
    if (positionSDK && ratioLiquidity >= 0 && !positionBasic?.isNoData) {
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
      const below =
        poolHook &&
        Number(poolHook.tickCurrent) < Number(positionSDK?.tickLower)
      const above =
        poolHook && typeof positionBasic.tickUpper === 'number'
          ? Number(poolHook.tickCurrent) >= Number(positionSDK?.tickUpper)
          : undefined
      const inRanges = !below && !above
      return inRanges
    }
    return null
  }, [positionSDK])
  // especially
  const ratioUSDC = useGetRatioUSDC(
    positionBasic?.tokenPre,
    positionBasic?.tokenSub,
    liquidity,
    positionSDK
  )
  // useEffect

  useEffect(() => {
    if (positionBasic?.isNoData && positionBasic) {
      setTimeRadom()
    }
  }, [positionBasic])
  useEffect(() => {
    if (!positionBasic?.isNoData && positionBasic) {
      if (
        unClaimFee &&
        ratioLiquidity >= 0 &&
        liquidity &&
        inRange !== null &&
        !isNaN(ratioUSDC?.liquidityByUSDC) &&
        ratioUSDC?.liquidityByUSDC
      ) {
        // console.log('having data')
        const data = {
          ratioLiquidity,
          liquidity,
          poolHook,
          positionBasic,
          ratioUSDC,
          idPool: listPoolOfAddress?.listPoolId[indexPool],
          chainId,
          unClaimFee,
          inRange,
          symbolPre: positionBasic?.tokenPre?.symbol,
          symbolSub: positionBasic?.tokenSub?.symbol
        }
        Promise.all([setListData((pre) => [...pre, data])]).then(() => {
          setTimeRadom()
        })
      }
    }
  }, [ratioUSDC?.liquidityByUSDC, unClaimFee])

  // use time count

  const setTimeRadom = () => {
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
    setListData([])
    setListPoolState([])
    setIndexPool(0)
    setIsFinish(false)
  }
  return {
    isFinish,
    listData,
    resetHook
  }
}
