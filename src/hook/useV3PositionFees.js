import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, useState } from 'react'
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
  const [amounts, setAmounts] = useState(null)
  const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)
  useMemo(async () => {
    setAmounts(null)
    const contractAddress = getPositionUniswapAddress(chainId)
    const owner = await getOwnerOf(contractAddress, tokenId, web3)

    return await getPositionFee(
      contractAddress,
      tokenId,
      owner,
      MAX_UINT128,
      MAX_UINT128,
      owner,
      web3
    ).then((value) => {
      setAmounts(value)
      return value
    })
  }, [pool])

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(pool.token0, amounts[0].toString()),
      CurrencyAmount.fromRawAmount(pool.token1, amounts[1].toString())
    ]
  } else {
    return [undefined, undefined]
  }
}
