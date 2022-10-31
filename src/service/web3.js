import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/chain'
import { ethers } from 'ethers'

export const getPositionUniswapAddress = (chainId) => {
  return NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]
}
export const getPositions = (contractAdress, tokenId, web3) => {
  return new Promise((resolve, reject) => {
    const abi = [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
          }
        ],
        name: 'positions',
        outputs: [
          {
            internalType: 'uint96',
            name: 'nonce',
            type: 'uint96'
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'token0',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'token1',
            type: 'address'
          },
          {
            internalType: 'uint24',
            name: 'fee',
            type: 'uint24'
          },
          {
            internalType: 'int24',
            name: 'tickLower',
            type: 'int24'
          },
          {
            internalType: 'int24',
            name: 'tickUpper',
            type: 'int24'
          },
          {
            internalType: 'uint128',
            name: 'liquidity',
            type: 'uint128'
          },
          {
            internalType: 'uint256',
            name: 'feeGrowthInside0LastX128',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'feeGrowthInside1LastX128',
            type: 'uint256'
          },
          {
            internalType: 'uint128',
            name: 'tokensOwed0',
            type: 'uint128'
          },
          {
            internalType: 'uint128',
            name: 'tokensOwed1',
            type: 'uint128'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ]
    const contract = new web3.eth.Contract(abi, contractAdress)
    contract.methods.positions(tokenId).call((err, result) => {
      if (err) {
        resolve(err)
      }
      resolve(result)
    })
  })
}
export const getTokenSymbol = (coinContract, web3) => {
  return new Promise((resolve, reject) => {
    try {
      const minABI = [
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              name: '',
              type: 'string'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ]
      const contract = new web3.eth.Contract(minABI, coinContract)
      contract.methods.symbol().call((err, balance) => {
        if (err) {
          resolve(0)
        }
        resolve(balance)
      })
    } catch (err) {
      resolve(0)
    }
  })
}
export const getSlot0 = (addressContract, web3) => {
  return new Promise((resolve, reject) => {
    try {
      const minABI = [
        {
          inputs: [],
          name: 'slot0',
          outputs: [
            {
              internalType: 'uint160',
              name: 'sqrtPriceX96',
              type: 'uint160'
            },
            {
              internalType: 'int24',
              name: 'tick',
              type: 'int24'
            },
            {
              internalType: 'uint16',
              name: 'observationIndex',
              type: 'uint16'
            },
            {
              internalType: 'uint16',
              name: 'observationCardinality',
              type: 'uint16'
            },
            {
              internalType: 'uint16',
              name: 'observationCardinalityNext',
              type: 'uint16'
            },
            {
              internalType: 'uint8',
              name: 'feeProtocol',
              type: 'uint8'
            },
            {
              internalType: 'bool',
              name: 'unlocked',
              type: 'bool'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ]
      const contract = new web3.eth.Contract(minABI, addressContract)
      contract.methods.slot0().call((err, value) => {
        if (err) {
          resolve(0)
        }
        resolve(value)
      })
    } catch (err) {
      resolve(0)
    }
  })
}
export const getOwnerOf = (addressContract, tokenId, web3) => {
  return new Promise((resolve, reject) => {
    try {
      const minABI = [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'ownerOf',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ]
      const contract = new web3.eth.Contract(minABI, addressContract)
      contract.methods.ownerOf(tokenId).call((err, balance) => {
        if (err) {
          resolve(0)
        }
        resolve(balance)
      })
    } catch (err) {
      resolve(0)
    }
  })
}

export const getPositionFee = (
  addressContract,
  tokenId,
  recipient,
  amount0,
  amount1,
  owner,
  web3
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const minABI = [
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'tokenId',
                  type: 'uint256'
                },
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address'
                },
                {
                  internalType: 'uint128',
                  name: 'amount0Max',
                  type: 'uint128'
                },
                {
                  internalType: 'uint128',
                  name: 'amount1Max',
                  type: 'uint128'
                }
              ],
              internalType: 'struct INonfungiblePositionManager.CollectParams',
              name: 'params',
              type: 'tuple'
            }
          ],
          name: 'collect',
          outputs: [
            {
              internalType: 'uint256',
              name: 'amount0',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'amount1',
              type: 'uint256'
            }
          ],
          stateMutability: 'payable',
          type: 'function'
        }
      ]
      const web3Provider = new ethers.providers.Web3Provider(
        web3.currentProvider
      )
      const contract = new ethers.Contract(
        addressContract,
        minABI,
        web3Provider
      )

      const res = await contract.callStatic.collect(
        {
          tokenId,
          recipient, // some tokens might fail if transferred to address(0)
          amount0Max: amount0,
          amount1Max: amount1
        },
        { from: owner } // need to simulate the call as the owner
      )
      if (res) {
        resolve(res)
      } else {
        resolve(0)
      }
    } catch (err) {
      resolve(0)
    }
  })
}
