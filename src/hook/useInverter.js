import { useMemo } from 'react'

export const useInverter = (pricesFromPosition, invert = false) => {
  const inverter = useMemo(() => {
    if (pricesFromPosition) {
      return {
        priceUpper: !invert
          ? pricesFromPosition?.priceLower?.invert()
          : pricesFromPosition?.priceUpper,
        priceLower: !invert
          ? pricesFromPosition?.priceUpper?.invert()
          : pricesFromPosition?.priceLower,
        quote: invert ? pricesFromPosition?.base : pricesFromPosition?.quote,
        base: invert ? pricesFromPosition?.quote : pricesFromPosition?.base
      }
    }
    return null
  }, [invert, pricesFromPosition])
  return inverter
}
