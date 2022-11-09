import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useMemo, useState } from 'react'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { getPositionUniswapAddress } from '../service/function'
import { getOwnerOf, getPositionFee } from '../service/web3'

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool,
  tokenId,
  web3,
  chainId,
  asWETH = false
) {
  const [amountNew, setAmountNew] = useState([])
  const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

  useEffect(() => {
    const getAmountPairToken = async () => {
      const contractAddress = getPositionUniswapAddress(chainId)
      const owner = await getOwnerOf(contractAddress, tokenId, web3)
      await getPositionFee(
        contractAddress,
        tokenId,
        owner,
        MAX_UINT128,
        MAX_UINT128,
        owner,
        web3
      ).then((value) => {
        setAmountNew(value)
      })
    }

    if (pool && chainId && web3 && tokenId) {
      setAmountNew([])
      getAmountPairToken()
    }
  }, [pool])
  const PositionFeeSDK = useMemo(() => {
    if (amountNew?.length > 0 && pool) {
      return {
        feeValue0: CurrencyAmount.fromRawAmount(
          pool.token0,
          amountNew[0]?.toString()
        ),
        feeValue1: CurrencyAmount.fromRawAmount(
          pool.token1,
          amountNew[1]?.toString()
        )
      }
    }
    return {
      feeValue0: null,
      feeValue1: null
    }
  }, [amountNew])
  return PositionFeeSDK
}
