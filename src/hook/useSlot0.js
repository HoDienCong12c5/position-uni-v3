import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { getAddressPool } from '../service/function'
import { getSlot0 } from '../service/web3'
export const useSlot0 = (
  token0,
  token1,
  positionBasic,
  chainId,
  web3,
  isChangeToken
) => {
  const [slot0, setSlot0] = useState(null)
  useEffect(() => {
    const getData = async () => {
      if (!isChangeToken) {
        if (token0 && token1 && positionBasic && chainId) {
          getSlot0(
            getAddressPool(token0, token1, positionBasic.fee, chainId),
            web3
          ).then((resSlot0) => {
            if (resSlot0.sqrtPriceX96) {
              setSlot0({
                ...resSlot0,
                tick: Number(resSlot0.tick),
                sqrtPriceX96: BigNumber.from(resSlot0.sqrtPriceX96)
              })
            }
          })
        }
      }
    }
    setSlot0(null)
    getData()
  }, [token0, token1, positionBasic, isChangeToken, chainId])

  return slot0
}
