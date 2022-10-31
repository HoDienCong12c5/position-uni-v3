# position-uni-v3

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/position-uni-v3.svg)](https://www.npmjs.com/package/position-uni-v3) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save position-uni-v3
```

## Usage

```jsx
import React,{useState,useEffect} from 'react'

import {  useFullPosition} from 'position-uni-v3'
const ExamplePosition=()=>{
  //code ...
   const {
    symbol,
    priceLower,
    priceUpper,
    base,
    quote,
    liquidity,
    unClaimFee,
    position,
    poolHook,
    tokenPre,
    tokenSub,
    positionBasic,
    inRange,
    loading,
    priceTokenPair
  } = useFullPosition({
    idPool: id,
    chainId,
    listAllTokenSupport: listToken,
    web3: Web3Services.createWeb3Provider(),
    callback: null
  })
  //code....
  liquidity.liquidityPre
  ///.....
}

export default ExamplePosition

```

## License

MIT © [HoDienCong12c5](https://github.com/HoDienCong12c5)
