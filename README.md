# position-uni-v3

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/position-uni-v3.svg)](https://www.npmjs.com/package/position-uni-v3) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install (for single position)

```bash
npm install --save position-uni-v3@2.2.5
```
## Install (mutil position for mutil address and having chain default not add chain new support)

```bash
npm install --save position-uni-v3@3.0.5
```
## Install (mutil position for mutil address)

```bash
npm install --save position-uni-v3
```

## Usage

```jsx 
//for version 3.0.5
import React,{useState,useEffect} from 'react'

import {  useFullListPosition} from 'position-uni-v3'
const ExamplePosition=()=>{
  //code ...
   const {isFinish,listData,resetHook} = useFullListPosition(address, chainId, listTokenPool)
  //code....
  ///.....
}
//use for version laster
import React,{useState,useEffect} from 'react'

import {  useFullPosition} from 'position-uni-v3'
const ExamplePosition=()=>{
  //code ...
  const listChainSupport = [1,2,4,6]
  const {isFinish,listData,resetHook} = useFullPosition(
    address,
    chainId,
    createWeb3NewBasic('your rpc'),
    listTokenPool,
    listChainSupport
  )
  //code....
  ///.....
}

export default ExamplePosition

```

## License

MIT © [HoDienCong12c5](https://github.com/HoDienCong12c5)
