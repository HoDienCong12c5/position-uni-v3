import React,{useState,useEffect} from 'react'

import {  usePool, usePosition,usePriceOrderingFromPositionForUI } from 'position-uni-v3'
const ExamplePosition=()=>{
  const [tokenPre, setTokenPre] = useState(null)
  const [tokenSub, setTokenSub] = useState(null)
  const [infoPositionBasic, setinfoPositionBasic] = useState(null)
  // code ..
  //

  const {poolHook,priceTokenPair} =usePool(tokenPre,tokenSub)
  // code...
  //
  const {position}=usePosition(poolHook,infoPositionBasic)
  const {priceLower,priceUpper,base,quote}=usePriceOrderingFromPositionForUI(position)
  
  useEffect(() => {
    if (position && poolHook && tokenPre) {
      const inverted = tokenPre ? base?.equals(tokenPre) : undefined

      // const ratio = getRatio(
      //   inverted ? priceLower : priceUpper.invert(),
      //   poolHook.token0Price,
      //   inverted ? priceUpper : priceLower.invert()
      // )
      //ratioRef.current = ratio
      // ratioRef.current = 2
    }
  }, [position, poolHook, base, tokenPre])
}

export default ExamplePosition
