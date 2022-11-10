import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/chain'
import UtilWeb3 from '../service/utils'
import { useState, useEffect, useMemo } from 'react'
export const useListPoolByAddress = (
  chainId,
  address,
  web3,
  listChainSupport
) => {
  const [listPoolForAddress, setListPoolForAddress] = useState([])
  const [balanceOfUser, setBalanceOfUser] = useState(-1)
  useEffect(() => {
    setBalanceOfUser(-1)
    setListPoolForAddress([])
    if (chainId && address && web3) {
      if (listChainSupport.includes(Number(chainId))) {
        UtilWeb3.getBalanceOf(
          address,
          NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[Number(chainId)],
          web3
        ).then((numberPool) => {
          setBalanceOfUser(Number(numberPool.toString()))
        })
      } else {
        setBalanceOfUser(0)
      }
    }
  }, [chainId, address])

  useEffect(() => {
    if (balanceOfUser > 0 && chainId) {
      for (let i = 0; i < balanceOfUser; i++) {
        UtilWeb3.getPoolID(
          address,
          i,
          NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[Number(chainId)],
          web3
        ).then((poolId) => {
          if (poolId > -1) {
            setListPoolForAddress((pre) => [...pre, poolId.toString()])
          }
        })
      }
    }
  }, [balanceOfUser])
  const listPoolMemo = useMemo(() => {
    if (balanceOfUser >= 1 && balanceOfUser === listPoolForAddress?.length) {
      return {
        listPoolId: listPoolForAddress
      }
    }
    if (balanceOfUser === 0) {
      return {
        listPoolId: [],
        noData: true
      }
    }
    return {
      listPoolId: []
    }
  }, [balanceOfUser, listPoolForAddress])

  return listPoolMemo
}
