import { BigNumber } from 'ethers'
import { getToken } from '../service/function'
import { getPositions, getPositionUniswapAddress } from '../service/web3'
import { useEffect, useMemo, useState } from 'react'

export const usePositionBasic = (
  idPool,
  chainId,
  listAllTokenSupport,
  web3
) => {
  const [tokenPre, setTokenPre] = useState(null)
  const [tokenSub, setTokenSub] = useState(null)
  const [positionBasic, setPositionBasic] = useState(null)
  const [isChangeToken, setIsChangeToken] = useState(false)
  const [isNoData, setIsNoData] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getDataBasic = async () => {
      getPositions(
        getPositionUniswapAddress(Number(chainId)),
        Number(idPool),
        web3
      ).then((pos) => {
        if (pos.liquidity && listAllTokenSupport?.length > 0) {
          // const toekn1 = await getToken(pos.token0, chainId, listAllTokenSupport)
          // const toekn2 = await getToken(pos.token1, chainId, listAllTokenSupport)
          // console.log({ toekn1, toekn2 })
          setLoading(false)

          Promise.all([
            setTokenPre(getToken(pos.token0, chainId, listAllTokenSupport)),
            setTokenSub(getToken(pos.token1, chainId, listAllTokenSupport))
          ])
          Promise.all([
            setIsChangeToken(false),
            setPositionBasic({
              ...pos,
              fee: Number(pos.fee),
              liquidity: BigNumber.from(pos.liquidity),
              tickLower: Number(pos.tickLower),
              tickUpper: Number(pos.tickUpper)
            })
          ])
        } else {
          console.log({ pos })
          setIsNoData(true)
          setLoading(false)
        }
      })
    }
    if (loading && !isNoData && isChangeToken && idPool) {
      getDataBasic()
    }
  }, [loading, isNoData, isChangeToken, idPool])
  useEffect(() => {
    if (idPool && web3 && chainId && listAllTokenSupport?.length > 0) {
      Promise.all([
        setTokenPre(null),
        setTokenSub(null),
        setPositionBasic(null),
        setIsChangeToken(true),
        setIsNoData(false)
      ]).then(() => setLoading(true))
    }
  }, [chainId, idPool, listAllTokenSupport])

  const positionBasicMemo = useMemo(() => {
    if (!isNoData && tokenSub && tokenPre && positionBasic && !isChangeToken) {
      return {
        tokenSub,
        tokenPre,
        positionBasic,
        isChangeToken,
        isNoData,
        loading
      }
    }
    if (tokenPre && !tokenSub && !isNoData && positionBasic && !isChangeToken) {
      return {
        isNoData: true
      }
    }
    if (!tokenPre && tokenSub && !isNoData && positionBasic && !isChangeToken) {
      return {
        isNoData: true
      }
    }
    if (isNoData) {
      return {
        isNoData
      }
    }
    return null
  }, [tokenPre, tokenSub, positionBasic, isChangeToken, isNoData])
  return positionBasicMemo
}
