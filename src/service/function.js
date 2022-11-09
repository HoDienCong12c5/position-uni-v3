import {
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  V3_CORE_FACTORY_ADDRESSES
} from '../constants/chain'
import { Token, Fraction } from '@uniswap/sdk-core'
import { computePoolAddress } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'

export const getRatio = (lower, current, upper) => {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    } else if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(20))
    const b = Number.parseFloat(upper.toSignificant(20))
    const c = Number.parseFloat(current.toSignificant(20))
    const ratio = Math.floor(
      (1 /
        ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) *
        100
    )
    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}
export const getPositionUniswapAddress = (chainId) => {
  return NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]
}
export const getToken = (address, chainId, listAllToken) => {
  const tokenTemp = listAllToken.find(
    (item) => item.address.toUpperCase() === address.toUpperCase()
  )
  if (!tokenTemp) {
    // console.log('no token')
    return null
  }
  // console.log('have token')
  const tokenNew = new Token(
    Number(chainId),
    address,
    tokenTemp.decimals,
    tokenTemp.symbol,
    tokenTemp.name
  )
  return tokenNew
}
const getPoolAddress = (factoryAddress, tokenA, tokenB, fee) => {
  if (tokenA?.sortsBefore(tokenB)) {
    return computePoolAddress({
      factoryAddress,
      tokenA,
      tokenB,
      fee
    })
  }
  return computePoolAddress({
    factoryAddress,
    tokenB,
    tokenA,
    fee
  })
}
export const getAddressPool = (token0, token1, feeAmount, chainId) => {
  const v3CoreFactoryAddress = V3_CORE_FACTORY_ADDRESSES[chainId] ?? undefined
  const poolAddress = getPoolAddress(
    v3CoreFactoryAddress,
    token0,
    token1,
    feeAmount
  )
  return poolAddress
}
export const formatLocaleNumber = ({ number, sigFigs, fixedDecimals }) => {
  if (typeof number === 'number') {
    return fixedDecimals ? parseFloat(number.toFixed(fixedDecimals)) : number
  }
  const baseString = parseFloat(number.toSignificant(sigFigs))
  const numberString = fixedDecimals
    ? parseFloat(baseString.toFixed(fixedDecimals))
    : baseString
  return numberString
}

export function formatCurrencyAmount(amount, sigFigs, fixedDecimals = null) {
  if (!amount) {
    return '-'
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return '0'
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return `<${formatLocaleNumber({ number: 0.00001 })}`
  }

  return formatLocaleNumber({ number: amount, sigFigs, fixedDecimals })
}
