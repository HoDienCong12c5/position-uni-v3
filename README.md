# position-uni-v3

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/position-uni-v3.svg)](https://www.npmjs.com/package/position-uni-v3) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install (for single position)

```bash
npm install --save position-uni-v3@2.2.5
```
## Install (mutil position for mtil address)

```bash
npm install --save position-uni-v3
```

## Usage

```jsx
import React,{useState,useEffect} from 'react'

import {  useFullPosition} from 'position-uni-v3'
const ExamplePosition=()=>{
  //code ...
   const {isFinish,listData,resetHook} = useFullListPosition(address, chainId, listAllTokenSupport)
  //code....
  ///.....
}

export default ExamplePosition

```

## License

MIT © [HoDienCong12c5](https://github.com/HoDienCong12c5)
