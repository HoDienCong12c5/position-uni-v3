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
  }, [invert, pricesFromPosition])
  return {
    priceLower: inverter?.priceLower ?? null,
    priceUpper: inverter?.priceUpper ?? null,
    base: inverter?.base ?? null,
    quote: inverter?.quote ?? null
  }
}
