import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/chain'
import UtilWeb3 from '../service/utils'
import { useState, useEffect, useMemo } from 'react'
import Web3 from 'web3'

// const { getContractPositionManager, createWeb3NewBasic } = require('common/function')
export const SupportedChainId = {
  1: 'https://rpc.ankr.com/eth',
  10: 'https://rpc.ankr.com/optimism',
  137: 'https://rpc.ankr.com/polygon',
  42161: 'https://rpc.ankr.com/arbitrum',
  42220: 'https://rpc.ankr.com/celo'
}
export const createWeb3NewBasic = (rpc) => {
  let web3 = new Web3()
  web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  return web3
}
export const useListPoolByAddress = (chainId, address) => {
  const [listPoolForAddress, setListPoolForAddress] = useState([])
  const [balanceOfUser, setBalanceOfUser] = useState(-1)
  useEffect(() => {
    setBalanceOfUser(-1)
    setListPoolForAddress([])
    if (chainId && address) {
      if (SupportedChainId[chainId]) {
        UtilWeb3.getBalanceOf(
          address,
          NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[Number(chainId)],
          createWeb3NewBasic(SupportedChainId[chainId])
        ).then((numberPool) => {
          setBalanceOfUser(Number(numberPool.toString()))
        })
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
          createWeb3NewBasic(SupportedChainId[Number(chainId)])
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
